<?php

namespace App\Listeners\Reservation;

use App\Events\Reservation\ReservationCreated;
use App\Notifications\ReservationCreatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class NotifyRestaurantOwnerOfNewReservation implements ShouldQueue
{
    public function handle(ReservationCreated $event): void
    {
        $owner = $event->reservation->restaurant->owner;

        if ($owner) {
            $owner->notify(new ReservationCreatedNotification($event->reservation));
        }
    }
}
