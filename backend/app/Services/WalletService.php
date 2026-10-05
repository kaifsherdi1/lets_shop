<?php

namespace App\Services;

use App\Exceptions\BusinessException;
use App\Models\Transaction;
use App\Models\Wallet;
use App\Models\WithdrawalRequest;
use App\Repositories\WalletRepository;
use Illuminate\Support\Facades\DB;

class WalletService
{
  protected $walletRepository;

  public function __construct(WalletRepository $walletRepository)
  {
    $this->walletRepository = $walletRepository;
  }

  /**
   * All of a user's wallets (one per currency) with their recent ledger.
   * `wallet` (the AED wallet) is kept for older clients.
   */
  public function getWalletData(int $userId)
  {
    $wallets = Wallet::where('user_id', $userId)->orderBy('currency')->get();

    if ($wallets->isEmpty()) {
      $wallets = collect([Wallet::firstOrCreate(['user_id' => $userId, 'currency' => 'AED'], ['balance' => 0])]);
    }

    $pending = WithdrawalRequest::where('user_id', $userId)->where('status', 'pending')
      ->selectRaw('currency, SUM(amount) as total')->groupBy('currency')->pluck('total', 'currency');

    $wallets->each(function (Wallet $w) use ($pending) {
      $held = (float) ($pending[$w->currency] ?? 0);
      $w->setAttribute('pending_withdrawals', round($held, 2));
      $w->setAttribute('available_balance', round((float) $w->balance - $held, 2));
    });

    $transactions = Transaction::whereIn('wallet_id', $wallets->pluck('id'))
      ->orderBy('created_at', 'desc')
      ->paginate(20);

    return [
      'wallet' => $wallets->firstWhere('currency', 'AED') ?? $wallets->first(),
      'wallets' => $wallets->values(),
      'transactions' => $transactions,
    ];
  }

  /**
   * Post a ledger entry and move the balance atomically. Must run inside a DB
   * transaction. The (reference_type, reference_id, type) unique key makes a
   * repeated post of the same commission/withdrawal fail instead of paying twice.
   */
  public function post(int $userId, string $currency, string $type, float $amount, string $description, string $refType, int $refId): Wallet
  {
    $wallet = Wallet::lockedFor($userId, $currency);
    $amount = round($amount, 2);

    if ($type === 'debit') {
      // Never let a balance go negative through a normal debit.
      $updated = Wallet::whereKey($wallet->id)->where('balance', '>=', $amount)->decrement('balance', $amount);
      if (! $updated) {
        throw new BusinessException('Insufficient wallet balance.', 422);
      }
    } else {
      Wallet::whereKey($wallet->id)->increment('balance', $amount);
    }

    $wallet->refresh();

    Transaction::create([
      'wallet_id' => $wallet->id,
      'type' => $type,
      'amount' => $amount,
      'description' => $description,
      'reference_type' => $refType,
      'reference_id' => $refId,
      'balance_after' => $wallet->balance,
    ]);

    return $wallet;
  }

  public function createWithdrawalRequest(int $userId, array $data)
  {
    $currency = $data['currency'] ?? 'AED';
    $amount = round((float) $data['amount'], 2);

    return DB::transaction(function () use ($userId, $data, $currency, $amount) {
      // Lock the wallet so concurrent requests are evaluated one at a time.
      $wallet = Wallet::lockedFor($userId, $currency);

      // Money already requested is reserved: the sum of pending requests can
      // never exceed the balance.
      $pending = (float) WithdrawalRequest::where('user_id', $userId)
        ->where('currency', $currency)->where('status', 'pending')->sum('amount');

      if ((float) $wallet->balance - $pending < $amount) {
        throw new BusinessException('Insufficient available balance. Amounts in pending withdrawal requests are on hold.', 422);
      }

      return WithdrawalRequest::create([
        'user_id' => $userId,
        'currency' => $currency,
        'amount' => $amount,
        'status' => 'pending',
        'bank_details' => $data['bank_details'],
      ]);
    });
  }

  public function approveWithdrawal(int $requestId, int $adminId)
  {
    return DB::transaction(function () use ($requestId, $adminId) {
      $withdrawal = WithdrawalRequest::whereKey($requestId)->lockForUpdate()->firstOrFail();

      if ($withdrawal->status !== 'pending') {
        throw new BusinessException('Withdrawal request is not pending.', 409);
      }

      $this->post(
        $withdrawal->user_id,
        $withdrawal->currency,
        'debit',
        (float) $withdrawal->amount,
        'Withdrawal to bank account',
        'withdrawal',
        $withdrawal->id
      );

      $withdrawal->update([
        'status' => 'approved',
        'approved_by' => $adminId,
        'approved_at' => now(),
      ]);

      return $withdrawal;
    });
  }

  public function rejectWithdrawal(int $requestId, int $adminId, string $notes)
  {
    return DB::transaction(function () use ($requestId, $adminId, $notes) {
      $withdrawal = WithdrawalRequest::whereKey($requestId)->lockForUpdate()->firstOrFail();

      if ($withdrawal->status !== 'pending') {
        throw new BusinessException('Withdrawal request is not pending.', 409);
      }

      $withdrawal->update([
        'status' => 'rejected',
        'approved_by' => $adminId,
        'approved_at' => now(),
        'notes' => $notes,
      ]);

      return $withdrawal;
    });
  }

  public function creditWallet(int $userId, float $amount, string $description, string $refType, int $refId, string $currency = 'AED')
  {
    return DB::transaction(fn () => $this->post($userId, $currency, 'credit', $amount, $description, $refType, $refId));
  }
}
