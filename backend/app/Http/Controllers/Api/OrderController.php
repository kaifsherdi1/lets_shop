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
        $orders = $this->orderService->getUserOrders($request->user()->id, 20);
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

        try {
            $order = $this->orderService->placeOrder($request->user()->id, $request->all());

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order,
            ], 201);
        }
        catch (\Exception $e) {
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
        }
        catch (\Exception $e) {
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
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 400);
        }
    }
}
