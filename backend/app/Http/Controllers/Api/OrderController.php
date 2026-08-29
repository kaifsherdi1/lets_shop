<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index(Request $request)
    {
        // If user is admin or manager, return ALL orders. Otherwise, return only their own.
        if ($request->user()->isAdmin() || $request->user()->hasRole('manager')) {
            $orders = \App\Models\Order::with(['items.product', 'user'])
                ->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 20));
        } else {
            $orders = $this->orderService->getUserOrders($request->user()->id, 20);
        }
        
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        if (is_null($request->user()->email_verified_at)) {
            return response()->json([
                'message' => 'Please verify your email address before placing an order.',
                'code' => 'email_unverified',
            ], 403);
        }

        $request->validate([
            'delivery_address' => 'required|string|min:10',
            'recipient_name' => 'nullable|string|max:255',
            'recipient_phone' => 'nullable|string|max:20',
            'currency' => 'required|in:INR,AED',
            'payment_method' => 'required|in:cod,bank_transfer',
            'notes' => 'nullable|string',
        ]);

        try {
            $order = $this->orderService->placeOrder($request->user()->id, $request->all());

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage() ?: 'Failed to place order',
            ], $e->getCode() ?: 400);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $order = $this->orderService->getOrderDetails($id, $request->user()->id, $request->user()->isAdmin());

            return response()->json([
                'order' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 404);
        }
    }

    public function cancel(Request $request, $id)
    {
        try {
            $order = $this->orderService->cancelOrder($id, $request->user()->id);

            return response()->json([
                'message' => 'Order cancelled successfully',
                'order' => $order,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 400);
        }
    }
}
