<?php

namespace App\Http\Controllers\Api\Menu;

use App\DTOs\Menu\MenuDTO;
use App\DTOs\Menu\MenuItemDTO;
use App\DTOs\Menu\StockUpdateDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Menu\AdjustStockRequest;
use App\Http\Requests\Menu\CreateMenuItemRequest;
use App\Http\Requests\Menu\CreateMenuRequest;
use App\Http\Requests\Menu\UpdateMenuItemRequest;
use App\Http\Requests\Menu\UpdateMenuRequest;
use App\Http\Resources\MenuItemResource;
use App\Http\Resources\MenuResource;
use App\Repositories\MenuItemRepository;
use App\Repositories\MenuRepository;
use App\Repositories\RestaurantRepository;
use App\Services\Menu\MenuItemService;
use App\Services\Menu\MenuService;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    public function __construct(
        private readonly MenuService $menuService,
        private readonly MenuItemService $itemService,
        private readonly MenuRepository $menus,
        private readonly MenuItemRepository $items,
        private readonly RestaurantRepository $restaurants,
    ) {}

    // ── Menus ────────────────────────────────────────────────────────────────

    public function index(int $restaurantId): JsonResponse
    {
        $this->restaurants->findOrFail($restaurantId);

        $menus = $this->menus->findActiveByRestaurant($restaurantId);

        return $this->success(MenuResource::collection($menus));
    }

    public function show(int $id): JsonResponse
    {
        $menu = $this->menus->findWithItems($id);

        if (! $menu) {
            throw new \App\Exceptions\NotFoundException('Menu');
        }

        return $this->success(MenuResource::make($menu->loadMissing('items')));
    }

    public function store(CreateMenuRequest $request, int $restaurantId): JsonResponse
    {
        $restaurant = $this->restaurants->findOrFail($restaurantId);
        $this->authorize('create', [\App\Models\Menu::class, $restaurant]);

        $menu = $this->menuService->create($restaurant, MenuDTO::from($request->validated()));

        return $this->created(MenuResource::make($menu), 'Menu créé avec succès.');
    }

    public function update(UpdateMenuRequest $request, int $id): JsonResponse
    {
        $menu = $this->menus->findOrFail($id);
        $this->authorize('update', $menu);

        $menu = $this->menuService->update($menu, MenuDTO::from(
            array_merge($menu->toArray(), $request->validated())
        ));

        return $this->success(MenuResource::make($menu->loadMissing('items')), 'Menu mis à jour.');
    }

    public function destroy(int $id): JsonResponse
    {
        $menu = $this->menus->findOrFail($id);
        $this->authorize('delete', $menu);

        $this->menuService->delete($menu);

        return $this->noContent();
    }

    // ── Items ────────────────────────────────────────────────────────────────

    public function storeItem(CreateMenuItemRequest $request, int $menuId): JsonResponse
    {
        $menu = $this->menus->findOrFail($menuId);
        $this->authorize('create', [\App\Models\MenuItem::class, $menu]);

        $item = $this->itemService->create($menu, MenuItemDTO::from($request->validated()));

        return $this->created(MenuItemResource::make($item), 'Article créé avec succès.');
    }

    public function updateItem(UpdateMenuItemRequest $request, int $id): JsonResponse
    {
        $item = $this->items->findOrFail($id);
        $this->authorize('update', $item);

        $item = $this->itemService->update($item, MenuItemDTO::from(
            array_merge($item->toArray(), ['category' => $item->category->value], $request->validated())
        ));

        return $this->success(MenuItemResource::make($item), 'Article mis à jour.');
    }

    public function destroyItem(int $id): JsonResponse
    {
        $item = $this->items->findOrFail($id);
        $this->authorize('delete', $item);

        $this->itemService->delete($item);

        return $this->noContent();
    }

    public function adjustStock(AdjustStockRequest $request, int $id): JsonResponse
    {
        $item = $this->items->findOrFail($id);
        $this->authorize('updateStock', $item);

        $item = $this->itemService->adjustStock($item, StockUpdateDTO::from($request->validated()));

        return $this->success(MenuItemResource::make($item), 'Stock ajusté.');
    }
}
