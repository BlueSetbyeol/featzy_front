<?php

namespace App\Http\Controllers\Api\Restaurant;

use App\Http\Controllers\Controller;
use App\Http\Resources\FavoriteResource;
use App\Repositories\FavoriteRepository;
use App\Repositories\RestaurantRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function __construct(
        private readonly FavoriteRepository $favorites,
        private readonly RestaurantRepository $restaurants,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $favorites = $this->favorites->findByUser($request->user()->id);

        return $this->success(FavoriteResource::collection($favorites));
    }

    public function toggle(Request $request, int $restaurantId): JsonResponse
    {
        $this->restaurants->findOrFail($restaurantId);

        $added = $this->favorites->toggle($request->user()->id, $restaurantId);

        return $this->success(
            ['favorited' => $added],
            $added ? 'Ajouté aux favoris.' : 'Retiré des favoris.'
        );
    }
}
