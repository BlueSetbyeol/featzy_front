<?php

namespace App\Services\Menu;

use App\DTOs\Menu\MenuDTO;
use App\Models\Menu;
use App\Models\Restaurant;
use App\Repositories\MenuRepository;

class MenuService
{
    public function __construct(private readonly MenuRepository $menus) {}

    public function create(Restaurant $restaurant, MenuDTO $dto): Menu
    {
        return $this->menus->create([
            'restaurant_id' => $restaurant->id,
            'name'          => $dto->name,
            'description'   => $dto->description,
            'is_active'     => $dto->is_active,
        ]);
    }

    public function update(Menu $menu, MenuDTO $dto): Menu
    {
        return $this->menus->update($menu, [
            'name'        => $dto->name,
            'description' => $dto->description,
            'is_active'   => $dto->is_active,
        ]);
    }

    public function delete(Menu $menu): void
    {
        $this->menus->delete($menu);
    }

    public function toggleActive(Menu $menu): Menu
    {
        return $this->menus->update($menu, ['is_active' => ! $menu->is_active]);
    }
}
