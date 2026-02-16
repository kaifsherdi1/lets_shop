<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with(['items.product', 'address'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'currency' => 'required|in:INR,AED',
            'payment_method' => 'required|in:cod,online,emi',
            'notes' => 'nullable|string',
        ]);

        // Get user's cart
        $cart = Cart::with('items.product')
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty'
            ], 400);
        }

        // Validate stock availability for all items
        foreach ($cart->items as $item) {
            if ($item->product->stock_quantity < $item->quantity) {
                return response()->json([
                    'message' => "Insufficient stock for product: {$item->product->name}"
                ], 400);
            }
        }

        DB::beginTransaction();

        try {
            // Calculate totals
            $subtotal = 0;
            foreach ($cart->items as $item) {
                $price = $request->currency === 'INR'
                    ? $item->product->price_inr
                    : $item->product->price_aed;
                $subtotal += $price * $item->quantity;
            }

            $tax = $subtotal * 0.05; // 5% tax
            $shippingFee = 50; // Fixed shipping fee
            $total = $subtotal + $tax + $shippingFee;

            // Create order
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => $request->user()->id,
                'address_id' => $request->address_id,
                'currency' => $request->currency,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_fee' => $shippingFee,
                'total' => $total,
                'payment_method' => $request->payment_method,
                'payment_status' => $request->payment_method === 'cod' ? 'pending' : 'pending',
                'order_status' => 'pending',
                'notes' => $request->notes,
            ]);

            // Create order items and reduce stock
            foreach ($cart->items as $item) {
                $price = $request->currency === 'INR'
                    ? $item->product->price_inr
                    : $item->product->price_aed;

                $distributorPrice = $request->currency === 'INR'
                    ? $item->product->distributor_price_inr
                    : $item->product->distributor_price_aed;

                $commissionAmount = $request->currency === 'INR'
                    ? $item->product->commission_amount_inr
                    : $item->product->commission_amount_aed;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'distributor_id' => $item->product->distributor_id,
                    'quantity' => $item->quantity,
                    'price' => $price,
                    'distributor_price' => $distributorPrice,
                    'commission_amount' => $commissionAmount,
                    'commission_status' => 'pending',
                ]);

                // Reduce stock
                $item->product->decreaseStock($item->quantity);
            }

            // Clear cart
            $cart->items()->delete();

            DB::commit();

            $order->load(['items.product', 'address']);

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order,
            ], 201);

        }
        catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to place order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request, Order $order)
    {
        // Verify ownership
        if ($order->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->load(['items.product', 'address', 'payment']);

        return response()->json([
            'order' => $order
        ]);
    }

    public function cancel(Request $request, Order $order)
    {
        // Verify ownership
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Can only cancel pending orders
        if ($order->order_status !== 'pending') {
            return response()->json([
                'message' => 'Order cannot be cancelled'
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Restore stock
            foreach ($order->items as $item) {
                $item->product->increaseStock($item->quantity);
            }

            $order->update([
                'order_status' => 'cancelled',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Order cancelled successfully',
                'order' => $order,
            ]);

        }
        catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to cancel order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
