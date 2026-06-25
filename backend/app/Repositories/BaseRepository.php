<?php

namespace App\Repositories;

use App\Exceptions\NotFoundException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

abstract class BaseRepository
{
    protected Builder $query;

    public function __construct(protected readonly Model $model)
    {
        $this->resetQuery();
    }

    protected function resetQuery(): void
    {
        $this->query = $this->model->newQuery();
    }

    public function with(array $relations): static
    {
        $this->query = $this->query->with($relations);

        return $this;
    }

    public function orderBy(string $column, string $direction = 'asc'): static
    {
        $this->query = $this->query->orderBy($column, $direction);

        return $this;
    }

    public function find(int $id): ?Model
    {
        $result = $this->query->find($id);
        $this->resetQuery();

        return $result;
    }

    public function findOrFail(int $id): Model
    {
        $model = $this->find($id);

        if (! $model) {
            throw new NotFoundException('Ressource introuvable.');
        }

        return $model;
    }

    public function all(array $columns = ['*']): Collection
    {
        $result = $this->query->get($columns);
        $this->resetQuery();

        return $result;
    }

    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        $result = $this->query->paginate($perPage, $columns);
        $this->resetQuery();

        return $result;
    }

    public function create(array $data): Model
    {
        return $this->model->newQuery()->create($data);
    }

    public function update(Model $model, array $data): Model
    {
        $model->fill($data)->save();

        return $model->fresh();
    }

    public function delete(Model $model): bool
    {
        return (bool) $model->delete();
    }

    public function findBy(string $column, mixed $value): ?Model
    {
        $result = $this->query->where($column, $value)->first();
        $this->resetQuery();

        return $result;
    }

    public function where(array $criteria): Collection
    {
        foreach ($criteria as $column => $value) {
            $this->query = $this->query->where($column, $value);
        }

        $result = $this->query->get();
        $this->resetQuery();

        return $result;
    }
}
