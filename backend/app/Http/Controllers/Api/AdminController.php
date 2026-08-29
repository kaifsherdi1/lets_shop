<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\Order;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WithdrawalRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class AdminController extends Controller
{
    private const LOW_STOCK = 10;

    /**
     * GET /api/admin/stats — command-centre summary.
     */
    public function stats()
    {
        $revenueExpr = DB::raw('COALESCE(total_amount, total, 0)');
        $paidOrders = Order::whereNotIn('order_status', ['cancelled']);

        $ordersByStatus = Order::select('order_status', DB::raw('count(*) as c'))
            ->groupBy('order_status')
            ->pluck('c', 'order_status');

        $revenueByCurrency = (clone $paidOrders)
            ->select('currency', DB::raw("SUM(COALESCE(total_amount, total, 0)) as total"))
            ->groupBy('currency')
            ->pluck('total', 'currency');

        return response()->json([
            'total_users' => User::count(),
            'customers' => $this->countByRole('customer'),
            'vendors' => $this->countByRole(['distributor', 'agent']),
            'staff' => $this->countByRole(['admin', 'manager', 'accountant', 'hr']),
            'unverified_users' => User::whereNull('email_verified_at')->count(),

            'total_products' => Product::count(),
            'active_products' => Product::where('status', 'active')->count(),
            'low_stock_products' => Product::whereBetween('stock_quantity', [1, self::LOW_STOCK])->count(),
            'out_of_stock_products' => Product::where('stock_quantity', 0)->count(),

            'total_orders' => Order::count(),
            'orders_by_status' => [
                'pending' => (int) ($ordersByStatus['pending'] ?? 0),
                'processing' => (int) ($ordersByStatus['processing'] ?? 0),
                'shipped' => (int) ($ordersByStatus['shipped'] ?? 0),
                'delivered' => (int) ($ordersByStatus['delivered'] ?? 0),
                'cancelled' => (int) ($ordersByStatus['cancelled'] ?? 0),
            ],

            'total_revenue' => round((float) (clone $paidOrders)->sum($revenueExpr), 2),
            'revenue_by_currency' => [
                'AED' => round((float) ($revenueByCurrency['AED'] ?? 0), 2),
                'INR' => round((float) ($revenueByCurrency['INR'] ?? 0), 2),
            ],

            'pending_commissions' => Commission::where('status', 'pending')->count(),
            'pending_commission_value' => round((float) Commission::where('status', 'pending')->sum('amount'), 2),
            'pending_withdrawals' => WithdrawalRequest::where('status', 'pending')->count(),
            'pending_withdrawal_value' => round((float) WithdrawalRequest::where('status', 'pending')->sum('amount'), 2),

            'recent_orders' => Order::with(['items.product', 'user:id,full_name,name,email'])
                ->orderByDesc('created_at')->limit(6)->get(),
            'recent_users' => User::with('role:id,slug')
                ->orderByDesc('created_at')->limit(6)->get()
                ->map(fn ($u) => [
                    'id' => $u->id,
                    'full_name' => $u->full_name ?? $u->name,
                    'email' => $u->email,
                    'role' => $u->role?->slug ?? 'customer',
                    'status' => $u->status,
                    'created_at' => $u->created_at,
                ]),
        ]);
    }

    private function countByRole(string|array $slugs): int
    {
        return User::whereHas('role', fn ($q) => $q->whereIn('slug', (array) $slugs))->count();
    }

    /**
     * GET /api/admin/monthly-stats — 6-month order + revenue series.
     */
    public function monthlyStats()
    {
        $months = collect(range(5, 0))->map(function ($i) {
            $date = now()->subMonths($i);
            $range = [$date->copy()->startOfMonth(), $date->copy()->endOfMonth()];

            return [
                'name' => $date->format('M'),
                'orders' => Order::whereBetween('created_at', $range)->count(),
                'revenue' => round((float) Order::whereBetween('created_at', $range)
                    ->whereNotIn('order_status', ['cancelled'])
                    ->sum(DB::raw('COALESCE(total_amount, total, 0)')), 2),
            ];
        });

        return response()->json($months);
    }

    /**
     * GET /api/admin/users — filterable paginated list.
     */
    public function users(Request $request)
    {
        $query = User::with('role')->orderByDesc('created_at');

        if ($search = $request->get('search')) {
            $query->where(fn ($q) => $q->where('full_name', 'like', "%{$search}%")
                ->orWhere('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%"));
        }
        if ($role = $request->get('role')) {
            $query->whereHas('role', fn ($q) => $q->where('slug', $role));
        }
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }
        if ($request->boolean('unverified')) {
            $query->whereNull('email_verified_at');
        }

        $users = $query->paginate((int) $request->get('per_page', 25));
        $users->getCollection()->transform(fn ($u) => $this->userRow($u));

        return response()->json($users);
    }

    /**
     * GET /api/admin/users/{id} — full profile with orders, wallet, commissions.
     */
    public function userShow($id)
    {
        $user = User::with('role')->findOrFail($id);

        $orders = Order::where('user_id', $user->id)
            ->withCount('items')
            ->orderByDesc('created_at')->limit(10)->get();

        $commissionSummary = Commission::where('distributor_id', $user->id)
            ->select('status', DB::raw('count(*) as count'), DB::raw('SUM(amount) as total'))
            ->groupBy('status')->get()->keyBy('status');

        return response()->json([
            'user' => $this->userRow($user),
            'orders' => $orders,
            'orders_total' => Order::where('user_id', $user->id)->count(),
            'wallet' => Wallet::where('user_id', $user->id)->first(),
            'products_count' => Product::where('distributor_id', $user->id)->count(),
            'commission_summary' => [
                'pending' => (float) ($commissionSummary['pending']->total ?? 0),
                'approved' => (float) ($commissionSummary['approved']->total ?? 0),
                'paid' => (float) ($commissionSummary['paid']->total ?? 0),
            ],
        ]);
    }

    /**
     * POST /api/admin/users — create a user of any role (staff onboarding).
     */
    public function userStore(Request $request)
    {
        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', Rule::exists('roles', 'slug')],
        ]);

        $role = Role::where('slug', $data['role'])->firstOrFail();

        $user = User::create([
            'name' => $data['full_name'],
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
            'role_id' => $role->id,
            'status' => 'active',
        ]);
        // Admin-created accounts are pre-verified.
        $user->forceFill(['email_verified_at' => now()])->save();

        if (in_array($data['role'], ['distributor', 'agent'])) {
            Wallet::firstOrCreate(['user_id' => $user->id], ['balance' => 0]);
        }

        return response()->json([
            'message' => 'User created',
            'user' => $this->userRow($user->load('role')),
        ], 201);
    }

    /**
     * PATCH /api/admin/users/{id}/role — reassign a user's role.
     */
    public function updateUserRole(Request $request, $id)
    {
        $request->validate(['role' => ['required', Rule::exists('roles', 'slug')]]);

        $user = User::findOrFail($id);
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot change your own role.'], 422);
        }

        $role = Role::where('slug', $request->role)->firstOrFail();
        $user->update(['role_id' => $role->id]);

        if (in_array($request->role, ['distributor', 'agent'])) {
            Wallet::firstOrCreate(['user_id' => $user->id], ['balance' => 0]);
        }

        return response()->json(['message' => "Role updated to {$request->role}", 'user' => $this->userRow($user->load('role'))]);
    }

    /**
     * PATCH /api/admin/orders/{id}/status
     */
    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['order_status' => $request->status, 'status' => $request->status]);

        return response()->json(['message' => 'Order status updated', 'order' => $order]);
    }

    /**
     * PATCH /api/admin/users/{id}/status
     */
    public function toggleUserStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:active,inactive,suspended']);

        $user = User::findOrFail($id);
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot change your own account status.'], 422);
        }

        $user->update(['status' => $request->status]);

        // Kill active sessions when an account is locked.
        if (in_array($request->status, ['inactive', 'suspended'])) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => "User status updated to {$request->status}",
            'user' => $this->userRow($user->load('role')),
        ]);
    }

    private function userRow(User $u): array
    {
        return [
            'id' => $u->id,
            'full_name' => $u->full_name ?? $u->name,
            'name' => $u->name,
            'email' => $u->email,
            'phone' => $u->phone,
            'role' => $u->role?->slug ?? 'customer',
            'status' => $u->status,
            'email_verified_at' => $u->email_verified_at,
            'created_at' => $u->created_at,
        ];
    }
}
