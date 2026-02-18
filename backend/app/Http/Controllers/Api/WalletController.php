<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WithdrawalRequest;
use App\Services\WalletService;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    protected $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    // Get wallet balance and transactions
    public function index(Request $request)
    {
        $data = $this->walletService->getWalletData($request->user()->id);
        return response()->json($data);
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

        try {
            $withdrawalRequest = $this->walletService->createWithdrawalRequest($request->user()->id, $request->all());

            return response()->json([
                'message' => 'Withdrawal request submitted successfully',
                'withdrawal_request' => $withdrawalRequest,
            ], 201);
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 400);
        }
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
    public function approveWithdrawal(Request $request, $id)
    {
        try {
            $withdrawalRequest = $this->walletService->approveWithdrawal($id, $request->user()->id);

            return response()->json([
                'message' => 'Withdrawal approved successfully',
                'withdrawal_request' => $withdrawalRequest,
            ]);
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 400);
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
