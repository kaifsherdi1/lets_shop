<?php

namespace App\Repositories;

use App\Models\Commission;
use Illuminate\Pagination\LengthAwarePaginator;

class CommissionRepository extends BaseRepository
{
  public function __construct(Commission $model)
  {
    parent::__construct($model);
  }

  public function getFiltered(array $filters = [], int $perPage = 20): LengthAwarePaginator
  {
    $query = $this->model->with(['orderItem.order', 'orderItem.product', 'distributor']);

    if (isset($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    if (isset($filters['distributor_id'])) {
      $query->where('distributor_id', $filters['distributor_id']);
    }

    return $query->orderBy('created_at', 'desc')->paginate($perPage);
  }

  public function getSummary(int $distributorId): array
  {
    return [
      'total_pending' => $this->model->where('distributor_id', $distributorId)->where('status', 'pending')->sum('amount'),
      'total_approved' => $this->model->where('distributor_id', $distributorId)->where('status', 'approved')->sum('amount'),
      'total_paid' => $this->model->where('distributor_id', $distributorId)->where('status', 'paid')->sum('amount'),
    ];
  }
}
