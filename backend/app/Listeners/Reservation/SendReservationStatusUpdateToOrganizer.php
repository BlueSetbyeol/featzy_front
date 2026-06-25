<?php

namespace App\Listeners\Reservation;

use App\Events\Reservation\ReservationStatusChanged;
use App\Notifications\ReservationStatusNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendReservationStatusUpdateToOrganizer implements ShouldQueue
{
    public function handle(ReservationStatusChanged $event): void
    {
        $event->reservation->organizer->notify(
            new ReservationStatusNotification($event->reservation)
        );
    }
}
