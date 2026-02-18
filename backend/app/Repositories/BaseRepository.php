<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository
{
  protected $model;

  public function __construct(Model $model)
  {
    $this->model = $model;
  }

  public function all(array $columns = ['*'], array $relations = []): Collection
  {
    return $this->model->with($relations)->get($columns);
  }

  public function paginate(int $perPage = 15, array $columns = ['*'], array $relations = []): LengthAwarePaginator
  {
    return $this->model->with($relations)->paginate($perPage, $columns);
  }

  public function create(array $data): Model
  {
    return $this->model->create($data);
  }

  public function update(int $id, array $data): bool
  {
    return $this->model->findOrFail($id)->update($data);
  }

  public function delete(int $id): bool
  {
    return $this->model->findOrFail($id)->delete();
  }

  public function find(int $id, array $columns = ['*'], array $relations = []): ?Model
  {
    return $this->model->with($relations)->find($id, $columns);
  }

  public function findOrFail(int $id, array $columns = ['*'], array $relations = []): Model
  {
    return $this->model->with($relations)->findOrFail($id, $columns);
  }
}
