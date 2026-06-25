<?php

namespace App\Listeners\Reservation;

use App\Events\Reservation\ReservationCreated;
use App\Notifications\ReservationCreatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendReservationConfirmationToOrganizer implements ShouldQueue
{
    public function handle(ReservationCreated $event): void
    {
        $event->reservation->organizer->notify(
            new ReservationCreatedNotification($event->reservation)
        );
    }
}
