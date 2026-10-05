<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class CategoryRepository extends BaseRepository
{
  const CACHE_KEY = 'categories_all';
  const CACHE_TTL = 3600; // 1 hour
  const VERSION_KEY = 'categories_cache_version';

  public function __construct(Category $model)
  {
    parent::__construct($model);
  }

  /**
   * Get all categories with caching.
   */
  public function allCached(array $relations = []): Collection
  {
    $cacheKey = self::CACHE_KEY . '_v' . (int) Cache::get(self::VERSION_KEY, 1) . '_' . implode('_', $relations);

    return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($relations) {
      return $this->all(['*'], $relations);
    });
  }

  /**
   * Get root categories with caching.
   */
  public function getRootCategories(array $relations = []): Collection
  {
    $cacheKey = self::CACHE_KEY . '_v' . (int) Cache::get(self::VERSION_KEY, 1) . '_root_' . implode('_', $relations);

    return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($relations) {
      return $this->model->with($relations)
        ->whereNull('parent_id')
        ->active()
        ->get();
    });
  }

  /**
   * Clear category cache.
   */
  public function clearCache(): void
  {
    // The version is part of every category cache key, so bumping it
    // invalidates all cached category lists (root, with relations, …).
    Cache::forever(self::VERSION_KEY, (int) Cache::get(self::VERSION_KEY, 1) + 1);
  }

  public function create(array $data): \Illuminate\Database\Eloquent\Model
  {
    $category = parent::create($data);
    $this->clearCache();
    return $category;
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
