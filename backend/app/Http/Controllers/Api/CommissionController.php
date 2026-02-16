<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\OrderItem;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommissionController extends Controller
{
    // Get all commissions (Admin/Accountant)
    public function index(Request $request)
    {
        $query = Commission::with(['orderItem.order', 'orderItem.product', 'distributor']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by distributor
        if ($request->has('distributor_id')) {
            $query->where('distributor_id', $request->distributor_id);
        }

        $commissions = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($commissions);
    }

    // Get my commissions (Distributor/Agent)
    public function myCommissions(Request $request)
    {
        $commissions = Commission::with(['orderItem.order', 'orderItem.product'])
            ->where('distributor_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $summary = [
            'total_pending' => Commission::where('distributor_id', $request->user()->id)
            ->where('status', 'pending')
            ->sum('amount'),
            'total_approved' => Commission::where('distributor_id', $request->user()->id)
            ->where('status', 'approved')
            ->sum('amount'),
            'total_paid' => Commission::where('distributor_id', $request->user()->id)
            ->where('status', 'paid')
            ->sum('amount'),
        ];

        return response()->json([
            'commissions' => $commissions,
            'summary' => $summary,
        ]);
    }

    // Approve commission (Admin/Accountant)
    public function approve(Request $request, Commission $commission)
    {
        if ($commission->status !== 'pending') {
            return response()->json([
                'message' => 'Commission is not pending'
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Update commission status
            $commission->update([
                'status' => 'approved',
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
            ]);

            // Update order item commission status
            $commission->orderItem->update([
                'commission_status' => 'approved',
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
            ]);

            // Credit to wallet
            $wallet = $commission->distributor->wallet;
            $oldBalance = $wallet->balance;
            $newBalance = $oldBalance + $commission->amount;

            $wallet->update(['balance' => $newBalance]);

            // Create transaction record
            Transaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'credit',
                'amount' => $commission->amount,
                'description' => 'Commission from Order #' . $commission->orderItem->order->order_number,
                'reference_type' => 'commission',
                'reference_id' => $commission->id,
                'balance_after' => $newBalance,
            ]);

            // Mark commission as paid
            $commission->update([
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            $commission->orderItem->update([
                'commission_status' => 'paid',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Commission approved and paid successfully',
                'commission' => $commission,
            ]);

        }
        catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to approve commission',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Bulk approve commissions
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'commission_ids' => 'required|array',
            'commission_ids.*' => 'exists:commissions,id',
        ]);

        $approved = 0;
        $failed = 0;

        foreach ($request->commission_ids as $commissionId) {
            $commission = Commission::find($commissionId);

            if ($commission && $commission->status === 'pending') {
                DB::beginTransaction();

                try {
                    // Same approval logic as single approve
                    $commission->update([
                        'status' => 'approved',
                        'approved_by' => $request->user()->id,
                        'approved_at' => now(),
                    ]);

                    $wallet = $commission->distributor->wallet;
                    $oldBalance = $wallet->balance;
                    $newBalance = $oldBalance + $commission->amount;
                    $wallet->update(['balance' => $newBalance]);

                    Transaction::create([
                        'wallet_id' => $wallet->id,
                        'type' => 'credit',
                        'amount' => $commission->amount,
                        'description' => 'Commission from Order #' . $commission->orderItem->order->order_number,
                        'reference_type' => 'commission',
                        'reference_id' => $commission->id,
                        'balance_after' => $newBalance,
                    ]);

                    $commission->update(['status' => 'paid', 'paid_at' => now()]);

                    DB::commit();
                    $approved++;

                }
                catch (\Exception $e) {
                    DB::rollBack();
                    $failed++;
                }
            }
        }

        return response()->json([
            'message' => "Approved {$approved} commissions, {$failed} failed",
            'approved' => $approved,
            'failed' => $failed,
        ]);
    }
}
