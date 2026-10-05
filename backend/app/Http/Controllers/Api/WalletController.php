<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use App\Models\WithdrawalRequest;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WalletController extends Controller
{
    protected $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    // Wallet balances (one per currency) and transactions
    public function index(Request $request)
    {
        return response()->json($this->walletService->getWalletData($request->user()->id));
    }

    // Request withdrawal
    public function requestWithdrawal(Request $request)
    {
        $data = $request->validate([
            'currency' => ['sometimes', Rule::in(Wallet::CURRENCIES)],
            'amount' => 'required|numeric|min:100|max:10000000',
            'bank_details' => 'required|array',
            'bank_details.account_name' => 'required|string|max:255',
            'bank_details.account_number' => 'required|string|max:64',
            'bank_details.bank_name' => 'required|string|max:255',
            'bank_details.ifsc_code' => 'required|string|max:32',
        ]);

        $withdrawalRequest = $this->walletService->createWithdrawalRequest($request->user()->id, $data);

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
        $perPage = min(max((int) $request->get('per_page', 20), 1), 100);

        $withdrawals = WithdrawalRequest::with('user:id,name,full_name,email,phone')
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($withdrawals);
    }

    // Approve withdrawal (Admin/Accountant)
    public function approveWithdrawal(Request $request, $id)
    {
        $withdrawalRequest = $this->walletService->approveWithdrawal((int) $id, $request->user()->id);

        return response()->json([
            'message' => 'Withdrawal approved successfully',
            'withdrawal_request' => $withdrawalRequest,
        ]);
    }

    // Reject withdrawal (Admin/Accountant)
    public function rejectWithdrawal(Request $request, WithdrawalRequest $withdrawalRequest)
    {
        $data = $request->validate([
            'notes' => 'required|string|max:1000',
        ]);

        $withdrawalRequest = $this->walletService->rejectWithdrawal($withdrawalRequest->id, $request->user()->id, $data['notes']);

        return response()->json([
            'message' => 'Withdrawal request rejected',
            'withdrawal_request' => $withdrawalRequest,
        ]);
    }
}
