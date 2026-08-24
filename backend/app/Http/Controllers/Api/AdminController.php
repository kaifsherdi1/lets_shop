<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
  /**
   * GET /api/admin/stats
   * Dashboard summary statistics
   */
  public function stats()
  {
    $totalUsers = User::count();
    $totalProducts = Product::count();
    $totalOrders = Order::count();
    $totalRevenue = Order::whereNotIn('order_status', ['cancelled'])
      ->sum(DB::raw('COALESCE(total_amount, total, 0)'));

    $recentOrders = Order::with(['items.product'])
      ->orderBy('created_at', 'desc')
      ->limit(5)
      ->get();

    return response()->json([
      'total_users'    => $totalUsers,
      'total_products' => $totalProducts,
      'total_orders'   => $totalOrders,
      'total_revenue'  => round($totalRevenue, 2),
      'recent_orders'  => $recentOrders,
    ]);
  }

  /**
   * GET /api/admin/monthly-stats
   * Real monthly order + revenue data for dashboard charts (last 6 months)
   */
  public function monthlyStats()
  {
    $months = collect(range(5, 0))->map(function ($i) {
      $date = now()->subMonths($i);
      $start = $date->copy()->startOfMonth();
      $end   = $date->copy()->endOfMonth();

      $orders = Order::whereBetween('created_at', [$start, $end])->count();
      $revenue = Order::whereBetween('created_at', [$start, $end])
        ->whereNotIn('order_status', ['cancelled'])
        ->sum(DB::raw('COALESCE(total_amount, total, 0)'));

      return [
        'name'    => $date->format('M'),
        'orders'  => $orders,
        'revenue' => round($revenue, 2),
      ];
    });

    return response()->json($months);
  }

  /**
   * GET /api/admin/users
   * Paginated user list
   */
  public function users(Request $request)
  {
    $users = User::with('role')
      ->orderBy('created_at', 'desc')
      ->paginate($request->get('per_page', 50));

    // Flatten role slug into user object
    $users->getCollection()->transform(function ($user) {
      return [
        'id' => $user->id,
        'full_name' => $user->full_name ?? $user->name,
        'name' => $user->name,
        'email' => $user->email,
        'phone' => $user->phone,
        'role' => $user->role?->slug ?? 'customer',
        'status' => $user->status,
        'email_verified_at' => $user->email_verified_at,
        'created_at' => $user->created_at,
      ];
    });

    return response()->json($users);
  }

  /**
   * PATCH /api/admin/orders/{id}/status
   * Update order status
   */
  public function updateOrderStatus(Request $request, $id)
  {
    $request->validate([
      'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
    ]);

    $order = Order::findOrFail($id);
    $order->update([
      'order_status' => $request->status,
      'status' => $request->status,
    ]);

    return response()->json([
      'message' => 'Order status updated',
      'order'   => $order,
    ]);
  }

  /**
   * PATCH /api/admin/users/{id}/status
   * Toggle a user's active/inactive status
   */
  public function toggleUserStatus(Request $request, $id)
  {
    $request->validate([
      'status' => 'required|in:active,inactive,suspended',
    ]);

    $user = User::findOrFail($id);
    $user->update(['status' => $request->status]);

    return response()->json([
      'message' => 'User status updated to ' . $request->status,
      'user'    => [
        'id'     => $user->id,
        'name'   => $user->name,
        'email'  => $user->email,
        'status' => $user->status,
      ],
    ]);
  }
}
