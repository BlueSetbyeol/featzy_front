<?php

namespace App\Repositories;

use App\Models\ReservationParticipant;
use Illuminate\Support\Collection;

class ReservationParticipantRepository extends BaseRepository
{
    public function __construct(ReservationParticipant $model)
    {
        parent::__construct($model);
    }

    public function findByReservationAndUser(int $reservationId, int $userId): ?ReservationParticipant
    {
        return $this->model->newQuery()
            ->where('reservation_id', $reservationId)
            ->where('user_id', $userId)
            ->first();
    }

    public function findPendingForUser(int $userId): Collection
    {
        return $this->model->newQuery()
            ->where('user_id', $userId)
            ->where('invitation_status', 'pending')
            ->with('reservation.restaurant.address', 'reservation.organizer')
            ->get();
    }
}
