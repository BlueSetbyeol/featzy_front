<?php

namespace App\Repositories;

use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReservationRepository extends BaseRepository
{
    public function __construct(Reservation $model)
    {
        parent::__construct($model);
    }

    public function findByOrganizer(int $userId): Collection
    {
        return $this->model->newQuery()
            ->where('organizer_id', $userId)
            ->with('restaurant.address', 'participants.user')
            ->orderByDesc('reservation_datetime')
            ->get();
    }

    public function findByRestaurant(int $restaurantId, array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->newQuery()
            ->where('restaurant_id', $restaurantId)
            ->with('organizer', 'participants.user')
            ->orderByDesc('reservation_datetime');

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['date'])) {
            $query->whereDate('reservation_datetime', $filters['date']);
        }

        return $query->paginate($filters['per_page'] ?? 20);
    }

    public function countConfirmedGuestsForSlot(int $restaurantId, Carbon $start, Carbon $end): int
    {
        return (int) DB::table('reservations')
            ->where('restaurant_id', $restaurantId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('reservation_datetime', '<', $end)
            ->where('reservation_datetime', '>=', $start)
            ->sum('number_of_guests');
    }

    public function findWhereParticipant(int $userId): Collection
    {
        return $this->model->newQuery()
            ->whereHas('participants', fn ($q) => $q->where('user_id', $userId))
            ->with('restaurant.address', 'organizer', 'participants.user')
            ->orderByDesc('reservation_datetime')
            ->get();
    }
}
