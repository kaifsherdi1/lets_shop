<?php

namespace App\Repositories;

use App\Models\Order;
use Illuminate\Pagination\LengthAwarePaginator;

class OrderRepository extends BaseRepository
{
  public function __construct(Order $model)
  {
    parent::__construct($model);
  }

  public function getForUser(int $userId, int $perPage = 20): LengthAwarePaginator
  {
    return $this->model->with(['items.product', 'address'])
      ->where('user_id', $userId)
      ->orderBy('created_at', 'desc')
      ->paginate($perPage);
  }

  public function getWithItems(int $id): Order
  {
    return $this->model->with(['items.product', 'address', 'payment'])->findOrFail($id);
  }
}
