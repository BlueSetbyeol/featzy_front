<?php

namespace App\Http\Controllers\Api\Restaurant;

use App\DTOs\Restaurant\OpeningHoursDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Restaurant\UpdateOpeningHoursRequest;
use App\Http\Resources\OpeningHoursResource;
use App\Repositories\OpeningHoursRepository;
use App\Repositories\RestaurantRepository;
use App\Services\Restaurant\RestaurantService;
use Illuminate\Http\JsonResponse;

class OpeningHoursController extends Controller
{
    public function __construct(
        private readonly RestaurantRepository $restaurants,
        private readonly OpeningHoursRepository $openingHours,
        private readonly RestaurantService $service,
    ) {}

    public function index(int $restaurantId): JsonResponse
    {
        $this->restaurants->findOrFail($restaurantId);

        $hours = $this->openingHours->findByRestaurant($restaurantId);

        return $this->success(OpeningHoursResource::collection($hours));
    }

    public function upsert(UpdateOpeningHoursRequest $request, int $restaurantId): JsonResponse
    {
        $restaurant = $this->restaurants->findOrFail($restaurantId);
        $this->authorize('manageOpeningHours', $restaurant);

        $dtos = array_map(
            fn ($h) => OpeningHoursDTO::from($h),
            $request->validated('hours')
        );

        $this->service->updateOpeningHours($restaurant, $dtos);

        $hours = $this->openingHours->findByRestaurant($restaurantId);

        return $this->success(OpeningHoursResource::collection($hours), 'Horaires mis à jour.');
    }
}
