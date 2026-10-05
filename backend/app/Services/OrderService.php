<?php

namespace App\Services;

use App\Exceptions\BusinessException;
use App\Mail\OrderConfirmationMail;
use App\Models\Cart;
use App\Models\Commission;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Repositories\OrderRepository;
use App\Repositories\ProductRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class OrderService
{
  /** Allowed order-status moves. Delivered and cancelled are final. */
  public const TRANSITIONS = [
    'pending' => ['processing', 'cancelled'],
    'processing' => ['shipped', 'cancelled'],
    'shipped' => ['delivered'],
    'delivered' => [],
    'cancelled' => [],
  ];

  public const TAX_RATE = 0.05;

  protected $orderRepository;
  protected $walletService;

  public function __construct(OrderRepository $orderRepository, WalletService $walletService)
  {
    $this->orderRepository = $orderRepository;
    $this->walletService = $walletService;
  }

  public function getUserOrders(int $userId, int $perPage = 20)
  {
    return $this->orderRepository->getForUser($userId, $perPage);
  }

  public function getOrderDetails(int $id, int $userId, bool $canViewAll = false)
  {
    $order = $this->orderRepository->getWithItems($id);

    if (! $canViewAll && $order->user_id !== $userId) {
      throw new BusinessException('You do not have access to this order.', 403);
    }

    return $order;
  }

  public function placeOrder(int $userId, array $data)
  {
    $currency = $data['currency'] ?? 'AED';

    $order = DB::transaction(function () use ($userId, $data, $currency) {
      $cart = Cart::with('items')->where('user_id', $userId)->lockForUpdate()->first();

      if (! $cart || $cart->items->isEmpty()) {
        throw new BusinessException('Your cart is empty.', 422);
      }

      $order = $this->orderRepository->create([
        'order_number' => Order::generateOrderNumber(),
        'user_id' => $userId,
        'currency' => $currency,
        'subtotal' => 0,
        'tax' => 0,
        'shipping_fee' => 0,
        'total' => 0,
        'total_amount' => 0,
        'payment_method' => $data['payment_method'],
        'payment_status' => 'pending',
        'order_status' => 'pending',
        'status' => 'pending',
        'notes' => $data['notes'] ?? null,
        'delivery_address' => $data['delivery_address'] ?? null,
        'recipient_name' => $data['recipient_name'] ?? null,
        'recipient_phone' => $data['recipient_phone'] ?? null,
      ]);

      $subtotal = 0.0;

      foreach ($cart->items as $item) {
        // Lock the product row: concurrent checkouts for the same product are
        // serialised, so stock is checked and reduced against the latest value.
        $product = Product::whereKey($item->product_id)->lockForUpdate()->first();

        if (! $product || $product->status !== 'active') {
          throw new BusinessException('An item in your cart is no longer available. Please remove it and try again.', 422);
        }

        // Atomic conditional decrement — can never take stock below zero.
        $reduced = Product::whereKey($product->id)
          ->where('stock_quantity', '>=', $item->quantity)
          ->decrement('stock_quantity', $item->quantity);

        if (! $reduced) {
          throw new BusinessException("Sorry, only {$product->stock_quantity} of \"{$product->name}\" left in stock.", 422);
        }

        $price = (float) ($currency === 'INR' ? $product->price_inr : $product->price_aed);
        $distributorPrice = $currency === 'INR' ? $product->distributor_price_inr : $product->distributor_price_aed;
        $commissionUnit = (float) ($currency === 'INR' ? $product->commission_amount_inr : $product->commission_amount_aed);

        $subtotal = round($subtotal + $price * $item->quantity, 2);

        $orderItem = OrderItem::create([
          'order_id' => $order->id,
          'product_id' => $product->id,
          'distributor_id' => $product->distributor_id,
          'quantity' => $item->quantity,
          'price' => $price,
          'distributor_price' => $distributorPrice,
          'commission_amount' => $commissionUnit,
          'commission_status' => 'pending',
        ]);

        if ($this->earnsCommission($product, $userId) && $commissionUnit > 0) {
          Commission::create([
            'order_item_id' => $orderItem->id,
            'distributor_id' => $product->distributor_id,
            'currency' => $currency,
            'amount' => round($commissionUnit * $item->quantity, 2),
            'status' => 'pending',
          ]);
        } else {
          $orderItem->update(['commission_status' => 'none']);
        }
      }

      $tax = round($subtotal * self::TAX_RATE, 2);
      $total = round($subtotal + $tax, 2);

      $order->update([
        'subtotal' => $subtotal,
        'tax' => $tax,
        'total' => $total,
        'total_amount' => $total,
      ]);

      $cart->items()->delete();

      return $order;
    });

    $order->load(['items.product']);
    ProductRepository::bumpCacheVersion(); // stock changed

    // Email after the transaction has committed, so a slow mail server never
    // holds row locks — and a mail failure never undoes a placed order.
    try {
      $user = User::find($userId);
      if ($user) {
        Mail::to($user->email)->send(new OrderConfirmationMail($order, $user));
      }
    } catch (\Throwable $e) {
      Log::error('Order confirmation email failed: ' . $e->getMessage(), ['order_id' => $order->id]);
    }

    return $order;
  }

  /** Vendors earn commission on sales to others — not on staff-owned or self-bought products. */
  private function earnsCommission(Product $product, int $buyerId): bool
  {
    if (! $product->distributor_id || $product->distributor_id === $buyerId) {
      return false;
    }

    $owner = User::with('role')->find($product->distributor_id);

    return $owner && $owner->hasAnyRole(['distributor', 'agent']);
  }

  /** Customer-initiated cancellation of their own order. */
  public function cancelOrder(int $id, int $userId)
  {
    return $this->cancel($id, $userId);
  }

  /**
   * Cancel an order: restore stock exactly once, void open commissions and
   * claw back any already paid. Locks the order so concurrent cancels can't
   * restore stock twice. $userId null = staff action (no ownership check).
   */
  public function cancel(int $id, ?int $userId = null)
  {
    $order = DB::transaction(function () use ($id, $userId) {
      $order = Order::with('items')->whereKey($id)->lockForUpdate()->firstOrFail();

      if ($userId !== null && $order->user_id !== $userId) {
        throw new BusinessException('You do not have access to this order.', 403);
      }

      if (! in_array('cancelled', self::TRANSITIONS[$order->order_status] ?? [], true)) {
        throw new BusinessException('This order can no longer be cancelled.', 422);
      }

      foreach ($order->items as $item) {
        Product::withTrashed()->whereKey($item->product_id)->increment('stock_quantity', $item->quantity);

        $commission = Commission::where('order_item_id', $item->id)->lockForUpdate()->first();
        if ($commission) {
          if ($commission->status === 'paid') {
            $this->walletService->post(
              $commission->distributor_id,
              $commission->currency ?: $order->currency,
              'debit',
              (float) $commission->amount,
              'Commission reversed — Order #' . $order->order_number . ' cancelled',
              'commission',
              $commission->id
            );
            $commission->update(['status' => 'reversed']);
          } elseif (in_array($commission->status, ['pending', 'approved'], true)) {
            $commission->update(['status' => 'cancelled']);
          }
        }
        $item->update(['commission_status' => 'cancelled']);
      }

      $order->update(['order_status' => 'cancelled', 'status' => 'cancelled']);

      return $order->fresh(['items.product']);
    });

    ProductRepository::bumpCacheVersion(); // stock restored

    return $order;
  }

  /** Staff status change, constrained to the allowed transitions. */
  public function transition(int $id, string $to)
  {
    if ($to === 'cancelled') {
      return $this->cancel($id);
    }

    return DB::transaction(function () use ($id, $to) {
      $order = Order::whereKey($id)->lockForUpdate()->firstOrFail();
      $allowed = self::TRANSITIONS[$order->order_status] ?? [];

      if (! in_array($to, $allowed, true)) {
        $next = $allowed ? implode(' or ', $allowed) : 'nothing (final state)';
        throw new BusinessException("An order that is {$order->order_status} can only move to {$next}.", 422);
      }

      $changes = ['order_status' => $to, 'status' => $to];
      // Cash on delivery is collected when the order is delivered.
      if ($to === 'delivered' && $order->payment_method === 'cod') {
        $changes['payment_status'] = 'paid';
      }
      $order->update($changes);

      return $order;
    });
  }
}
