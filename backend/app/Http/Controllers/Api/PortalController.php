<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\Order;
use App\Models\Product;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PortalController extends Controller
{
    /**
     * GET /api/portal/stats
     * Returns stats scoped to the authenticated distributor/agent.
     */
    public function stats(Request $request)
    {
        $user   = $request->user();
        $userId = $user->id;

        // My products count
        $myProducts = Product::where('distributor_id', $userId)->count();

        // Total earnings (approved commissions)
        $totalEarnings = Commission::where('user_id', $userId)
            ->where('status', 'paid')
            ->sum('amount');

        // Pending commissions
        $pendingEarnings = Commission::where('user_id', $userId)
            ->where('status', 'pending')
            ->sum('amount');

        // Wallet balance
        $wallet = $user->wallet;
        $walletBalance = $wallet ? $wallet->balance : 0;

        // Recent commissions (last 5)
        $recentCommissions = Commission::where('user_id', $userId)
            ->with('order')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Monthly earnings for last 6 months
        $monthlyEarnings = collect(range(5, 0))->map(function ($i) use ($userId) {
            $date  = now()->subMonths($i);
            $start = $date->copy()->startOfMonth();
            $end   = $date->copy()->endOfMonth();

            $earned = Commission::where('user_id', $userId)
                ->where('status', 'paid')
                ->whereBetween('created_at', [$start, $end])
                ->sum('amount');

            return [
                'name'     => $date->format('M'),
                'earnings' => round($earned, 2),
            ];
        });

        return response()->json([
            'my_products'         => $myProducts,
            'total_earnings'      => round($totalEarnings, 2),
            'pending_earnings'    => round($pendingEarnings, 2),
            'wallet_balance'      => round($walletBalance, 2),
            'recent_commissions'  => $recentCommissions,
            'monthly_earnings'    => $monthlyEarnings,
        ]);
    }
}
