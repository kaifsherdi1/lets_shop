<?php

namespace App\Repositories;

use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Pagination\LengthAwarePaginator;

class WalletRepository extends BaseRepository
{
  public function __construct(Wallet $model)
  {
    parent::__construct($model);
  }

  public function getByUserId(int $userId): ?Wallet
  {
    return $this->model->where('user_id', $userId)->first();
  }

  public function getTransactions(int $walletId, int $perPage = 20): LengthAwarePaginator
  {
    return Transaction::where('wallet_id', $walletId)
      ->orderBy('created_at', 'desc')
      ->paginate($perPage);
  }

  public function createTransaction(array $data): Transaction
  {
    return Transaction::create($data);
  }
}
