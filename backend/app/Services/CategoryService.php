<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class CategoryService
{
  protected $repository;

  public function __construct(CategoryRepository $repository)
  {
    $this->repository = $repository;
  }

  public function getAllCategories(array $relations = []): Collection
  {
    return $this->repository->allCached($relations);
  }

  public function getRootCategories(array $relations = []): Collection
  {
    return $this->repository->getRootCategories($relations);
  }

  public function getCategoryById(int $id, array $relations = []): Model
  {
    return $this->repository->findOrFail($id, ['*'], $relations);
  }

  public function createCategory(array $data): Model
  {
    // Add business logic here (e.g., slug generation if not in model)
    return $this->repository->create($data);
  }

  public function updateCategory(int $id, array $data): bool
  {
    return $this->repository->update($id, $data);
  }

  public function deleteCategory(int $id): bool
  {
    return $this->repository->delete($id);
  }
}
