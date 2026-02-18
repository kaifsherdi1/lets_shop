<?php

namespace App\Services;

use App\Repositories\OrderRepository;
use App\Models\Cart;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderService
{
  protected $orderRepository;

  public function __construct(OrderRepository $orderRepository)
  {
    $this->orderRepository = $orderRepository;
  }

  public function getUserOrders(int $userId, int $perPage = 20)
  {
    return $this->orderRepository->getForUser($userId, $perPage);
  }

  public function getOrderDetails(int $id, int $userId, bool $isAdmin = false)
  {
    $order = $this->orderRepository->getWithItems($id);

    if (!$isAdmin && $order->user_id !== $userId) {
      throw new Exception('Unauthorized', 403);
    }

    return $order;
  }

  public function placeOrder(int $userId, array $data)
  {
    // Get user's cart
    $cart = Cart::with('items.product')->where('user_id', $userId)->first();

    if (!$cart || $cart->items->isEmpty()) {
      throw new Exception('Cart is empty', 400);
    }

    // Validate stock
    foreach ($cart->items as $item) {
      if ($item->product->stock_quantity < $item->quantity) {
        throw new Exception("Insufficient stock for product: {$item->product->name}", 400);
      }
    }

    return DB::transaction(function () use ($userId, $data, $cart) {
      // Calculate totals
      $subtotal = 0;
      foreach ($cart->items as $item) {
        $price = $data['currency'] === 'INR'
          ? $item->product->price_inr
          : $item->product->price_aed;
        $subtotal += $price * $item->quantity;
      }

      $tax = $subtotal * 0.05;
      $shippingFee = 50;
      $total = $subtotal + $tax + $shippingFee;

      // Create order
      $order = $this->orderRepository->create([
        'order_number' => \App\Models\Order::generateOrderNumber(),
        'user_id' => $userId,
        'address_id' => $data['address_id'],
        'currency' => $data['currency'],
        'subtotal' => $subtotal,
        'tax' => $tax,
        'shipping_fee' => $shippingFee,
        'total' => $total,
        'payment_method' => $data['payment_method'],
        'payment_status' => 'pending',
        'order_status' => 'pending',
        'notes' => $data['notes'] ?? null,
      ]);

      // Create order items and reduce stock with atomic locks
      foreach ($cart->items as $item) {
        $lock = \Illuminate\Support\Facades\Cache::lock('product_stock_' . $item->product_id, 10);

        try {
          $lock->block(5); // Wait up to 5 seconds for the lock

          // Refresh product stock data within the lock
          $product = \App\Models\Product::findOrFail($item->product_id);

          if ($product->stock_quantity < $item->quantity) {
            throw new Exception("Product {$product->name} just went out of stock.", 400);
          }

          $price = $data['currency'] === 'INR' ? $product->price_inr : $product->price_aed;
          $distributorPrice = $data['currency'] === 'INR' ? $product->distributor_price_inr : $product->distributor_price_aed;
          $commissionAmount = $data['currency'] === 'INR' ? $product->commission_amount_inr : $product->commission_amount_aed;

          OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'distributor_id' => $product->distributor_id,
            'quantity' => $item->quantity,
            'price' => $price,
            'distributor_price' => $distributorPrice,
            'commission_amount' => $commissionAmount,
            'commission_status' => 'pending',
          ]);

          $product->decreaseStock($item->quantity);

        }
        finally {
          optional($lock)->release();
        }
      }

      $cart->items()->delete();

      return $order->load(['items.product', 'address']);
    });
  }

  public function cancelOrder(int $id, int $userId)
  {
    $order = $this->orderRepository->findOrFail($id);

    if ($order->user_id !== $userId) {
      throw new Exception('Unauthorized', 403);
    }

    if ($order->order_status !== 'pending') {
      throw new Exception('Order cannot be cancelled', 400);
    }

    return DB::transaction(function () use ($order) {
      foreach ($order->items as $item) {
        $item->product->increaseStock($item->quantity);
      }

      $order->update(['order_status' => 'cancelled']);
      return $order;
    });
  }
}
