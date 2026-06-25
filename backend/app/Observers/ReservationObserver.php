<?php

namespace App\Observers;

use App\Enums\ReservationStatus;
use App\Events\Reservation\ReservationCreated;
use App\Events\Reservation\ReservationStatusChanged;
use App\Models\Reservation;

class ReservationObserver
{
    public function created(Reservation $reservation): void
    {
        event(new ReservationCreated($reservation));
    }

    public function updated(Reservation $reservation): void
    {
        if ($reservation->wasChanged('status')) {
            $oldStatus = ReservationStatus::from($reservation->getOriginal('status'));
            event(new ReservationStatusChanged($reservation, $oldStatus));
        }
    }
}
