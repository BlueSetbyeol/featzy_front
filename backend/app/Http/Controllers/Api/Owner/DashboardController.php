<?php

namespace App\Http\Controllers\Api\Owner;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuItemResource;
use App\Repositories\MenuItemRepository;
use App\Repositories\MenuRepository;
use App\Repositories\RestaurantRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private readonly RestaurantRepository $restaurants,
        private readonly MenuRepository $menus,
        private readonly MenuItemRepository $items,
    ) {}

    public function index(Request $request, int $restaurantId): JsonResponse
    {
        $restaurant = $this->restaurants->findOrFail($restaurantId);
        $this->authorize('update', $restaurant);

        $menus = $this->menus->findActiveByRestaurant($restaurantId);

        $menuIds    = $menus->pluck('id')->all();
        $allItems   = $this->items->where(['menu_id' => null]); // placeholder — fetch via menuIds

        // Fetch all items for this restaurant's menus
        $allItems = \App\Models\MenuItem::whereIn('menu_id', $menuIds)->get();

        $activeItems = $allItems->where('is_available', true)->count();

        $lowStockItems = $allItems
            ->filter(fn ($i) => $i->stock_quantity !== null && $i->stock_quantity <= 5 && $i->stock_quantity > 0)
            ->values();

        return $this->success([
            'menu_count'      => $menus->count(),
            'active_items'    => $activeItems,
            'low_stock_items' => MenuItemResource::collection($lowStockItems),
        ]);
    }
}
