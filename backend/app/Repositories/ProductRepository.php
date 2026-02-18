<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class ProductRepository extends BaseRepository
{
  const CACHE_KEY = 'products';
  const CACHE_TTL = 3600;

  public function __construct(Product $model)
  {
    parent::__construct($model);
  }

  /**
   * Get products with pagination and caching.
   */
  public function paginateCached(int $perPage = 15, array $relations = [], array $filters = []): LengthAwarePaginator
  {
    $page = request()->get('page', 1);
    $filterKey = md5(serialize($filters));
    $cacheKey = self::CACHE_KEY . "_page_{$page}_{$perPage}_{$filterKey}_" . implode('_', $relations);

    return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($perPage, $relations, $filters) {
      $query = $this->model->with($relations)
        ->active()
        ->inStock();

      if (isset($filters['category_id'])) {
        $query->where('category_id', $filters['category_id']);
      }

      if (isset($filters['distributor_id'])) {
        $query->where('distributor_id', $filters['distributor_id']);
      }

      if (isset($filters['search'])) {
        $search = $filters['search'];
        $query->where(function ($q) use ($search) {
              $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhere('sku', 'like', "%{$search}%");
            }
            );
          }

          return $query->orderBy('created_at', 'desc')->paginate($perPage);
        });
  }

  /**
   * Get products for a specific distributor.
   */
  public function getByDistributor(int $distributorId, int $perPage = 15): LengthAwarePaginator
  {
    return $this->model->where('distributor_id', $distributorId)
      ->with(['category'])
      ->paginate($perPage);
  }

  /**
   * Clear product cache.
   */
  public function clearCache(): void
  {
  // Ideally use tags, but for now we clear generic keys or documented patterns
  // Cache::tags(['products'])->flush();
  // Since we aren't using tags yet, we rely on TTL or manual flush if needed.
  }

  public function create(array $data): \Illuminate\Database\Eloquent\Model
  {
    $product = parent::create($data);
    $this->clearCache();
    return $product;
  }

  public function update(int $id, array $data): bool
  {
    $updated = parent::update($id, $data);
    if ($updated) {
      $this->clearCache();
    }
    return $updated;
  }

  public function delete(int $id): bool
  {
    $deleted = parent::delete($id);
    if ($deleted) {
      $this->clearCache();
    }
    return $deleted;
  }
}
