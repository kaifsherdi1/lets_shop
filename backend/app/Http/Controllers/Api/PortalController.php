<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\Product;
use Illuminate\Http\Request;

class PortalController extends Controller
{
    /**
     * GET /api/portal/stats
     * Stats scoped to the authenticated distributor / agent.
     */
    public function stats(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;

        $myProducts = Product::where('distributor_id', $userId)->count();

        $totalEarnings = Commission::where('distributor_id', $userId)
            ->whereIn('status', ['approved', 'paid'])
            ->sum('amount');

        $pendingEarnings = Commission::where('distributor_id', $userId)
            ->where('status', 'pending')
            ->sum('amount');

        $wallet = $user->wallet;
        $walletBalance = $wallet ? $wallet->balance : 0;

        $recentCommissions = Commission::where('distributor_id', $userId)
            ->with(['orderItem.order:id,order_number', 'orderItem.product:id,name'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $monthlyEarnings = collect(range(5, 0))->map(function ($i) use ($userId) {
            $date = now()->subMonths($i);

            $earned = Commission::where('distributor_id', $userId)
                ->whereIn('status', ['approved', 'paid'])
                ->whereBetween('created_at', [
                    $date->copy()->startOfMonth(),
                    $date->copy()->endOfMonth(),
                ])
                ->sum('amount');

            return [
                'name' => $date->format('M'),
                'earnings' => round((float) $earned, 2),
            ];
        });

        return response()->json([
            'my_products' => $myProducts,
            'total_earnings' => round((float) $totalEarnings, 2),
            'pending_earnings' => round((float) $pendingEarnings, 2),
            'wallet_balance' => round((float) $walletBalance, 2),
            'recent_commissions' => $recentCommissions,
            'monthly_earnings' => $monthlyEarnings,
        ]);
    }
}
