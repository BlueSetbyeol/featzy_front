<?php

namespace App\Repositories;

use App\DTOs\Restaurant\OpeningHoursDTO;
use App\Models\RestaurantOpeningHours;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class OpeningHoursRepository extends BaseRepository
{
    public function __construct(RestaurantOpeningHours $model)
    {
        parent::__construct($model);
    }

    public function findByRestaurant(int $restaurantId): Collection
    {
        return $this->model->newQuery()
            ->where('restaurant_id', $restaurantId)
            ->orderBy('day_of_week')
            ->orderBy('opening_time')
            ->get();
    }

    public function isOpenAt(int $restaurantId, Carbon $datetime): bool
    {
        $dayOfWeek = (int) $datetime->dayOfWeek; // 0=Sun, 6=Sat
        $time      = $datetime->format('H:i:s');

        return $this->model->newQuery()
            ->where('restaurant_id', $restaurantId)
            ->where('day_of_week', $dayOfWeek)
            ->where('is_closed', false)
            ->where('opening_time', '<=', $time)
            ->where('closing_time', '>=', $time)
            ->exists();
    }

    public function upsertForRestaurant(int $restaurantId, array $openingHoursDTOs): void
    {
        foreach ($openingHoursDTOs as $dto) {
            /** @var OpeningHoursDTO $dto */
            $this->model->newQuery()->updateOrCreate(
                [
                    'restaurant_id' => $restaurantId,
                    'day_of_week'   => $dto->day_of_week->value,
                    'service_label' => $dto->service_label,
                ],
                [
                    'opening_time' => $dto->opening_time,
                    'closing_time' => $dto->closing_time,
                    'is_closed'    => $dto->is_closed,
                ]
            );
        }
    }
}
