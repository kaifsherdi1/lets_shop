<?php

namespace App\Services;

use App\Repositories\ProductRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductService
{
  protected $repository;

  public function __construct(ProductRepository $repository)
  {
    $this->repository = $repository;
  }

  public function getProducts(int $perPage = 15, array $relations = [], array $filters = []): LengthAwarePaginator
  {
    return $this->repository->paginateCached($perPage, $relations, $filters);
  }

  public function getProductById(int $id, array $relations = []): Model
  {
    return $this->repository->findOrFail($id, ['*'], $relations);
  }

  public function createProduct(array $data): Model
  {
    return $this->repository->create($data);
  }

  public function updateProduct(int $id, array $data): bool
  {
    return $this->repository->update($id, $data);
  }

  public function deleteProduct(int $id): bool
  {
    return $this->repository->delete($id);
  }

  public function getMyProducts(int $distributorId, int $perPage = 15): LengthAwarePaginator
  {
    return $this->repository->getByDistributor($distributorId, $perPage);
  }
}
