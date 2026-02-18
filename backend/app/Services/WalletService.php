<?php

namespace App\Services;

use App\Repositories\WalletRepository;
use App\Models\WithdrawalRequest;
use Illuminate\Support\Facades\DB;
use Exception;

class WalletService
{
  protected $walletRepository;

  public function __construct(WalletRepository $walletRepository)
  {
    $this->walletRepository = $walletRepository;
  }

  public function getWalletData(int $userId)
  {
    $wallet = $this->walletRepository->getByUserId($userId);

    if (!$wallet) {
      $wallet = $this->walletRepository->create([
        'user_id' => $userId,
        'balance' => 0,
      ]);
    }

    $transactions = $this->walletRepository->getTransactions($wallet->id);

    return [
      'wallet' => $wallet,
      'transactions' => $transactions,
    ];
  }

  public function createWithdrawalRequest(int $userId, array $data)
  {
    $wallet = $this->walletRepository->getByUserId($userId);

    if (!$wallet || $wallet->balance < $data['amount']) {
      throw new Exception('Insufficient balance', 400);
    }

    return WithdrawalRequest::create([
      'user_id' => $userId,
      'amount' => $data['amount'],
      'status' => 'pending',
      'bank_details' => $data['bank_details'],
    ]);
  }

  public function approveWithdrawal(int $requestId, int $adminId)
  {
    $withdrawalRequest = WithdrawalRequest::with('user.wallet')->findOrFail($requestId);

    if ($withdrawalRequest->status !== 'pending') {
      throw new Exception('Withdrawal request is not pending', 400);
    }

    $wallet = $withdrawalRequest->user->wallet;

    if ($wallet->balance < $withdrawalRequest->amount) {
      throw new Exception('Insufficient wallet balance', 400);
    }

    return DB::transaction(function () use ($withdrawalRequest, $wallet, $adminId) {
      $newBalance = $wallet->balance - $withdrawalRequest->amount;
      $wallet->update(['balance' => $newBalance]);

      $this->walletRepository->createTransaction([
        'wallet_id' => $wallet->id,
        'type' => 'debit',
        'amount' => $withdrawalRequest->amount,
        'description' => 'Withdrawal to bank account',
        'reference_type' => 'withdrawal',
        'reference_id' => $withdrawalRequest->id,
        'balance_after' => $newBalance,
      ]);

      $withdrawalRequest->update([
        'status' => 'approved',
        'approved_by' => $adminId,
        'approved_at' => now(),
      ]);

      return $withdrawalRequest;
    });
  }

  public function creditWallet(int $userId, float $amount, string $description, string $refType, int $refId)
  {
    $wallet = $this->walletRepository->getByUserId($userId);

    if (!$wallet) {
      $wallet = $this->walletRepository->create([
        'user_id' => $userId,
        'balance' => 0,
      ]);
    }

    return DB::transaction(function () use ($wallet, $amount, $description, $refType, $refId) {
      $newBalance = $wallet->balance + $amount;
      $wallet->update(['balance' => $newBalance]);

      $this->walletRepository->createTransaction([
        'wallet_id' => $wallet->id,
        'type' => 'credit',
        'amount' => $amount,
        'description' => $description,
        'reference_type' => $refType,
        'reference_id' => $refId,
        'balance_after' => $newBalance,
      ]);

      return $wallet;
    });
  }
}
