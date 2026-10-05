<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /** Staff who manage every customer's orders. */
    private function canManageAllOrders(Request $request): bool
    {
        return $request->user()->hasAnyRole(['admin', 'manager']);
    }

    public function index(Request $request)
    {
        $perPage = min(max((int) $request->get('per_page', 20), 1), 100);

        if ($this->canManageAllOrders($request)) {
            $orders = Order::with(['items.product', 'user:id,name,full_name,email,phone'])
                ->when($request->filled('status'), fn ($q) => $q->where('order_status', $request->status))
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);
        } else {
            $orders = $this->orderService->getUserOrders($request->user()->id, $perPage);
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

        // Only these fields reach the service — nothing else from the request
        // (e.g. someone else's address_id) can be smuggled into the order.
        $data = $request->validate([
            'delivery_address' => 'required|string|min:10|max:1000',
            'recipient_name' => 'nullable|string|max:255',
            'recipient_phone' => ['nullable', 'string', 'max:20', 'regex:/^\+?[0-9\s\-()]{7,20}$/'],
            'currency' => 'required|in:INR,AED',
            'payment_method' => 'required|in:cod,bank_transfer',
            'notes' => 'nullable|string|max:1000',
        ]);

        $order = $this->orderService->placeOrder($request->user()->id, $data);

        return response()->json([
            'message' => 'Order placed successfully',
            'order' => $order,
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $order = $this->orderService->getOrderDetails((int) $id, $request->user()->id, $this->canManageAllOrders($request));

        return response()->json(['order' => $order]);
    }

    public function cancel(Request $request, $id)
    {
        $order = $this->orderService->cancelOrder((int) $id, $request->user()->id);

        return response()->json([
            'message' => 'Order cancelled successfully',
            'order' => $order,
        ]);
    }
}
