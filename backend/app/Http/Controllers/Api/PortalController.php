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

        // Money is only ever summed within one currency (AED and INR never mix).
        $byCurrency = [];
        foreach (\App\Models\Wallet::CURRENCIES as $cur) {
            $byCurrency[$cur] = [
                'total_earnings' => round((float) Commission::where('distributor_id', $userId)
                    ->where('currency', $cur)->where('status', 'paid')->sum('amount'), 2),
                'pending_earnings' => round((float) Commission::where('distributor_id', $userId)
                    ->where('currency', $cur)->where('status', 'pending')->sum('amount'), 2),
                'wallet_balance' => round((float) (\App\Models\Wallet::where('user_id', $userId)
                    ->where('currency', $cur)->value('balance') ?? 0), 2),
            ];
        }

        $recentCommissions = Commission::where('distributor_id', $userId)
            ->with(['orderItem.order:id,order_number', 'orderItem.product:id,name'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $monthlyEarnings = collect(range(5, 0))->map(function ($i) use ($userId) {
            $date = now()->subMonths($i);

            $earned = fn (string $cur) => round((float) Commission::where('distributor_id', $userId)
                ->where('currency', $cur)
                ->where('status', 'paid')
                ->whereBetween('created_at', [
                    $date->copy()->startOfMonth(),
                    $date->copy()->endOfMonth(),
                ])
                ->sum('amount'), 2);

            return [
                'name' => $date->format('M'),
                'earnings' => $earned('AED'),
                'earnings_inr' => $earned('INR'),
            ];
        });

        return response()->json([
            'my_products' => $myProducts,
            // Legacy single-figure keys are the AED amounts.
            'total_earnings' => $byCurrency['AED']['total_earnings'],
            'pending_earnings' => $byCurrency['AED']['pending_earnings'],
            'wallet_balance' => $byCurrency['AED']['wallet_balance'],
            'by_currency' => $byCurrency,
            'recent_commissions' => $recentCommissions,
            'monthly_earnings' => $monthlyEarnings,
        ]);
    }
}
