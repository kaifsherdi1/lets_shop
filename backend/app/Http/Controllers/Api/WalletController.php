<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Wallet;
use App\Models\WithdrawalRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    // Get wallet balance and transactions
    public function index(Request $request)
    {
        $wallet = Wallet::with('transactions')
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$wallet) {
            $wallet = Wallet::create([
                'user_id' => $request->user()->id,
                'balance' => 0,
            ]);
        }

        $transactions = Transaction::where('wallet_id', $wallet->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'wallet' => $wallet,
            'transactions' => $transactions,
        ]);
    }

    // Request withdrawal
    public function requestWithdrawal(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:100',
            'bank_details' => 'required|array',
            'bank_details.account_name' => 'required|string',
            'bank_details.account_number' => 'required|string',
            'bank_details.bank_name' => 'required|string',
            'bank_details.ifsc_code' => 'required|string',
        ]);

        $wallet = $request->user()->wallet;

        if (!$wallet || $wallet->balance < $request->amount) {
            return response()->json([
                'message' => 'Insufficient balance'
            ], 400);
        }

        $withdrawalRequest = WithdrawalRequest::create([
            'user_id' => $request->user()->id,
            'amount' => $request->amount,
            'status' => 'pending',
            'bank_details' => $request->bank_details,
        ]);

        return response()->json([
            'message' => 'Withdrawal request submitted successfully',
            'withdrawal_request' => $withdrawalRequest,
        ], 201);
    }

    // Get withdrawal requests (User)
    public function myWithdrawals(Request $request)
    {
        $withdrawals = WithdrawalRequest::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($withdrawals);
    }

    // Get all withdrawal requests (Admin/Accountant)
    public function allWithdrawals(Request $request)
    {
        $query = WithdrawalRequest::with('user');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $withdrawals = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($withdrawals);
    }

    // Approve withdrawal (Admin/Accountant)
    public function approveWithdrawal(Request $request, WithdrawalRequest $withdrawalRequest)
    {
        if ($withdrawalRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Withdrawal request is not pending'
            ], 400);
        }

        $wallet = $withdrawalRequest->user->wallet;

        if ($wallet->balance < $withdrawalRequest->amount) {
            return response()->json([
                'message' => 'Insufficient wallet balance'
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Deduct from wallet
            $oldBalance = $wallet->balance;
            $newBalance = $oldBalance - $withdrawalRequest->amount;
            $wallet->update(['balance' => $newBalance]);

            // Create transaction record
            Transaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'debit',
                'amount' => $withdrawalRequest->amount,
                'description' => 'Withdrawal to bank account',
                'reference_type' => 'withdrawal',
                'reference_id' => $withdrawalRequest->id,
                'balance_after' => $newBalance,
            ]);

            // Update withdrawal request
            $withdrawalRequest->update([
                'status' => 'approved',
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Withdrawal approved successfully',
                'withdrawal_request' => $withdrawalRequest,
            ]);

        }
        catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to approve withdrawal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Reject withdrawal (Admin/Accountant)
    public function rejectWithdrawal(Request $request, WithdrawalRequest $withdrawalRequest)
    {
        if ($withdrawalRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Withdrawal request is not pending'
            ], 400);
        }

        $request->validate([
            'notes' => 'required|string',
        ]);

        $withdrawalRequest->update([
            'status' => 'rejected',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Withdrawal request rejected',
            'withdrawal_request' => $withdrawalRequest,
        ]);
    }
}
