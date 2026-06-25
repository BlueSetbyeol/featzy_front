<?php

namespace App\Repositories;

use App\Models\Menu;
use Illuminate\Support\Collection;

class MenuRepository extends BaseRepository
{
    public function __construct(Menu $model)
    {
        parent::__construct($model);
    }

    public function findActiveByRestaurant(int $restaurantId): Collection
    {
        return $this->model->newQuery()
            ->where('restaurant_id', $restaurantId)
            ->where('is_active', true)
            ->with('items')
            ->get();
    }

    public function findWithItems(int $menuId): ?Menu
    {
        return $this->model->newQuery()
            ->with('items')
            ->find($menuId);
    }
}
