<?php

namespace App\Listeners\Reservation;

use App\Events\Reservation\InvitationResponded;
use App\Notifications\InvitationResponseNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class NotifyOrganizerOfInvitationResponse implements ShouldQueue
{
    public function handle(InvitationResponded $event): void
    {
        $organizer = $event->participant->reservation->organizer;
        $organizer->notify(new InvitationResponseNotification($event->participant));
    }
}
