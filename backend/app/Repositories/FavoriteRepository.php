<?php

namespace App\Repositories;

use App\Models\Favorite;
use Illuminate\Support\Collection;

class FavoriteRepository extends BaseRepository
{
    public function __construct(Favorite $model)
    {
        parent::__construct($model);
    }

    public function findByUser(int $userId): Collection
    {
        return $this->model->newQuery()
            ->where('user_id', $userId)
            ->with('restaurant.address')
            ->get();
    }

    public function isFavorited(int $userId, int $restaurantId): bool
    {
        return $this->model->newQuery()
            ->where('user_id', $userId)
            ->where('restaurant_id', $restaurantId)
            ->exists();
    }

    public function toggle(int $userId, int $restaurantId): bool
    {
        $existing = $this->model->newQuery()
            ->where('user_id', $userId)
            ->where('restaurant_id', $restaurantId)
            ->first();

        if ($existing) {
            $existing->delete();
            return false;
        }

        $this->model->newQuery()->create([
            'user_id'       => $userId,
            'restaurant_id' => $restaurantId,
        ]);

        return true;
    }
}
