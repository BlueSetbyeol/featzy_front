<?php

namespace App\Http\Controllers\Api\Restaurant;

use App\DTOs\Restaurant\AddressDTO;
use App\DTOs\Restaurant\RestaurantDTO;
use App\DTOs\Restaurant\RestaurantSearchDTO;
use App\Exceptions\NotFoundException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Restaurant\CreateRestaurantRequest;
use App\Http\Requests\Restaurant\SearchRestaurantRequest;
use App\Http\Requests\Restaurant\UpdateRestaurantRequest;
use App\Http\Resources\RestaurantResource;
use App\Repositories\RestaurantRepository;
use App\Services\Restaurant\RestaurantService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public function __construct(
        private readonly RestaurantService $service,
        private readonly RestaurantRepository $restaurants,
    ) {}

    public function index(SearchRestaurantRequest $request): JsonResponse
    {
        $dto     = RestaurantSearchDTO::from($request->validated());
        $results = $this->service->search($dto);

        return $this->success(RestaurantResource::collection($results));
    }

    public function show(int $id): JsonResponse
    {
        $restaurant = $this->restaurants->find($id);

        if (! $restaurant || ! $restaurant->is_active) {
            throw new NotFoundException('Restaurant');
        }

        return $this->success(
            RestaurantResource::make($restaurant->load('address', 'openingHours'))
        );
    }

    public function store(CreateRestaurantRequest $request): JsonResponse
    {
        $this->authorize('create', \App\Models\Restaurant::class);

        $data       = $request->validated();
        $dto        = RestaurantDTO::from($data);
        $addressDto = AddressDTO::from($data['address']);

        $restaurant = $this->service->create($dto, $addressDto, $request->user());

        return $this->created(
            RestaurantResource::make($restaurant->load('address')),
            'Restaurant créé avec succès.'
        );
    }

    public function update(UpdateRestaurantRequest $request, int $id): JsonResponse
    {
        $restaurant = $this->restaurants->findOrFail($id);
        $this->authorize('update', $restaurant);

        $data       = $request->validated();
        $dto        = RestaurantDTO::from(array_merge(
            $restaurant->toArray(),
            $data
        ));
        $addressDto = isset($data['address']) ? AddressDTO::from($data['address']) : null;

        $restaurant = $this->service->update($restaurant, $dto, $addressDto);

        return $this->success(
            RestaurantResource::make($restaurant->load('address')),
            'Restaurant mis à jour.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $restaurant = $this->restaurants->findOrFail($id);
        $this->authorize('delete', $restaurant);

        $this->service->delete($restaurant);

        return $this->noContent();
    }

    public function availability(Request $request, int $id): JsonResponse
    {
        $restaurant = $this->restaurants->findOrFail($id);

        $request->validate([
            'datetime' => ['required', 'date'],
            'guests'   => ['required', 'integer', 'min:1'],
        ]);

        $datetime        = Carbon::parse($request->input('datetime'));
        $remainingSeats  = $this->service->getAvailableCapacity($restaurant, $datetime);
        $guests          = (int) $request->input('guests');

        return $this->success([
            'available'       => $remainingSeats >= $guests,
            'remaining_seats' => $remainingSeats,
        ]);
    }
}
