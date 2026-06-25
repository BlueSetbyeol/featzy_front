<?php

namespace App\Listeners\Reservation;

use App\Events\Reservation\ReservationCreated;
use App\Notifications\ReservationInvitationNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendInvitationsToParticipants implements ShouldQueue
{
    public function handle(ReservationCreated $event): void
    {
        $reservation = $event->reservation->load('participants.user');

        foreach ($reservation->participants as $participant) {
            if ($participant->user) {
                $participant->user->notify(new ReservationInvitationNotification($reservation));
            }
        }
    }
}
