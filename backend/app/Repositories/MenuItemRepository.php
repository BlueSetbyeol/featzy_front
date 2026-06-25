<?php

namespace App\Repositories;

use App\Exceptions\InsufficientStockException;
use App\Models\MenuItem;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class MenuItemRepository extends BaseRepository
{
    public function __construct(MenuItem $model)
    {
        parent::__construct($model);
    }

    public function findAvailableByMenu(int $menuId): Collection
    {
        return $this->model->newQuery()
            ->where('menu_id', $menuId)
            ->where('is_available', true)
            ->where(fn ($q) => $q->whereNull('stock_quantity')->orWhere('stock_quantity', '>', 0))
            ->get();
    }

    public function decrementStock(MenuItem $item, int $quantity): void
    {
        DB::transaction(function () use ($item, $quantity) {
            $fresh = $this->model->newQuery()->lockForUpdate()->find($item->id);

            if ($fresh->stock_quantity !== null && $fresh->stock_quantity < $quantity) {
                throw new InsufficientStockException($fresh->name, $quantity, $fresh->stock_quantity);
            }

            if ($fresh->stock_quantity !== null) {
                $fresh->decrement('stock_quantity', $quantity);
            }
        });
    }

    public function incrementStock(MenuItem $item, int $quantity): void
    {
        if ($item->stock_quantity !== null) {
            $item->increment('stock_quantity', $quantity);
        }
    }

    public function findWithSufficientStock(array $itemIds, array $quantities): Collection
    {
        $items = $this->model->newQuery()->whereIn('id', $itemIds)->get()->keyBy('id');

        return $items->filter(function (MenuItem $item) use ($quantities, $itemIds) {
            $index    = array_search($item->id, $itemIds);
            $required = $quantities[$index] ?? 0;

            return $item->stock_quantity === null || $item->stock_quantity >= $required;
        })->values();
    }
}
