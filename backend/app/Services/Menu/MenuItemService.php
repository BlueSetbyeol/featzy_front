<?php

namespace App\Services\Menu;

use App\DTOs\Menu\MenuItemDTO;
use App\DTOs\Menu\StockUpdateDTO;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\StockNotTrackedException;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Repositories\MenuItemRepository;

class MenuItemService
{
    public function __construct(private readonly MenuItemRepository $items) {}

    public function create(Menu $menu, MenuItemDTO $dto): MenuItem
    {
        return $this->items->create([
            'menu_id'        => $menu->id,
            'name'           => $dto->name,
            'description'    => $dto->description,
            'price'          => $dto->price,
            'category'       => $dto->category->value,
            'stock_quantity' => $dto->stock_quantity,
            'is_available'   => $dto->is_available,
            'image_url'      => $dto->image_url,
        ]);
    }

    public function update(MenuItem $item, MenuItemDTO $dto): MenuItem
    {
        return $this->items->update($item, [
            'name'           => $dto->name,
            'description'    => $dto->description,
            'price'          => $dto->price,
            'category'       => $dto->category->value,
            'stock_quantity' => $dto->stock_quantity,
            'is_available'   => $dto->is_available,
            'image_url'      => $dto->image_url,
        ]);
    }

    public function delete(MenuItem $item): void
    {
        $this->items->delete($item);
    }

    public function adjustStock(MenuItem $item, StockUpdateDTO $dto): MenuItem
    {
        if ($item->stock_quantity === null) {
            if ($dto->delta < 0) {
                throw new StockNotTrackedException($item->name);
            }
            return $item; // delta positif sur stock illimité : no-op
        }

        if ($dto->delta < 0 && $item->stock_quantity < abs($dto->delta)) {
            throw new InsufficientStockException($item->name, abs($dto->delta), $item->stock_quantity);
        }

        if ($dto->delta < 0) {
            $this->items->decrementStock($item, abs($dto->delta));
        } else {
            $this->items->incrementStock($item, $dto->delta);
        }

        return $item->fresh();
    }
}
