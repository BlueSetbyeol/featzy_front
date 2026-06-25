<?php

namespace App\Policies;

use App\Enums\InvitationStatus;
use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\User;

class ReservationPolicy
{
    public function view(User $user, Reservation $reservation): bool
    {
        if ($user->id === $reservation->organizer_id) {
            return true;
        }

        if ($reservation->restaurant->owner_id === $user->id) {
            return true;
        }

        return $reservation->participants
            ->where('user_id', $user->id)
            ->where('invitation_status', InvitationStatus::Accepted)
            ->isNotEmpty();
    }

    public function create(User $user): bool
    {
        return true; // tout user authentifié
    }

    public function update(User $user, Reservation $reservation): bool
    {
        return $user->id === $reservation->organizer_id
            && $reservation->status === ReservationStatus::Pending;
    }

    public function cancel(User $user, Reservation $reservation): bool
    {
        return $user->id === $reservation->organizer_id
            || $user->id === $reservation->restaurant->owner_id;
    }

    public function confirm(User $user, Reservation $reservation): bool
    {
        return $user->id === $reservation->restaurant->owner_id;
    }

    public function complete(User $user, Reservation $reservation): bool
    {
        return $user->id === $reservation->restaurant->owner_id;
    }

    public function noShow(User $user, Reservation $reservation): bool
    {
        return $user->id === $reservation->restaurant->owner_id;
    }
}
