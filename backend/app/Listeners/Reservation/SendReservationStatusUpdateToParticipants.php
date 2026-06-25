<?php

namespace App\Listeners\Reservation;

use App\Events\Reservation\ReservationStatusChanged;
use App\Notifications\ReservationStatusNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendReservationStatusUpdateToParticipants implements ShouldQueue
{
    public function handle(ReservationStatusChanged $event): void
    {
        $reservation = $event->reservation->load('participants.user');

        foreach ($reservation->participants as $participant) {
            if ($participant->user) {
                $participant->user->notify(new ReservationStatusNotification($reservation));
            }
        }
    }
}
