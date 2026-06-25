<?php

namespace App\Repositories;

use App\DTOs\Restaurant\RestaurantSearchDTO;
use App\Models\Restaurant;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class RestaurantRepository extends BaseRepository
{
    public function __construct(Restaurant $model)
    {
        parent::__construct($model);
    }

    public function searchWithFilters(RestaurantSearchDTO $dto): LengthAwarePaginator
    {
        $query = $this->model->newQuery()->where('is_active', true);

        if ($dto->query) {
            $query->where(function ($q) use ($dto) {
                $q->where('name', 'like', '%' . $dto->query . '%')
                  ->orWhere('description', 'like', '%' . $dto->query . '%');
            });
        }

        if ($dto->price_range) {
            $query->where('price_range', $dto->price_range->value);
        }

        if ($dto->cuisine_type) {
            $query->where('cuisine_type', $dto->cuisine_type);
        }

        if ($dto->hasGeoFilter()) {
            $haversine = $this->haversineSelect($dto->lat, $dto->lng);
            $query->selectRaw("restaurants.*, ({$haversine}) AS distance_km")
                  ->havingRaw("distance_km <= ?", [$dto->radius_km])
                  ->orderByRaw("distance_km ASC");
        } else {
            $query->select('restaurants.*')
                  ->orderBy('average_rating', 'desc');
        }

        return $query->with('address')->paginate($dto->per_page);
    }

    public function getActiveNear(float $lat, float $lng, float $km): Collection
    {
        $haversine = $this->haversineSelect($lat, $lng);

        return $this->model->newQuery()
            ->selectRaw("restaurants.*, ({$haversine}) AS distance_km")
            ->where('is_active', true)
            ->havingRaw("distance_km <= ?", [$km])
            ->orderByRaw("distance_km ASC")
            ->with('address')
            ->get();
    }

    public function countAvailableSeatsForSlot(int $restaurantId, Carbon $datetime, int $durationMin = 120): int
    {
        $restaurant = $this->model->newQuery()->lockForUpdate()->find($restaurantId);

        if (! $restaurant) {
            return 0;
        }

        $slotEnd = (clone $datetime)->addMinutes($durationMin);

        $confirmedGuests = DB::table('reservations')
            ->where('restaurant_id', $restaurantId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('reservation_datetime', '<', $slotEnd)
            ->whereRaw("DATE_ADD(reservation_datetime, INTERVAL ? MINUTE) > ?", [$durationMin, $datetime])
            ->sum('number_of_guests');

        return max(0, $restaurant->capacity - (int) $confirmedGuests);
    }

    private function haversineSelect(float $lat, float $lng): string
    {
        return "(6371 * ACOS(
            COS(RADIANS({$lat})) * COS(RADIANS(addresses.latitude))
            * COS(RADIANS(addresses.longitude) - RADIANS({$lng}))
            + SIN(RADIANS({$lat})) * SIN(RADIANS(addresses.latitude))
        ))";
    }
}
