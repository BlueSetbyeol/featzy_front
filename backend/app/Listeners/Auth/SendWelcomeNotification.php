<?php

namespace App\Listeners\Auth;

use App\Events\Auth\EmailVerified;
use App\Notifications\WelcomeNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendWelcomeNotification implements ShouldQueue
{
    public function handle(EmailVerified $event): void
    {
        $event->user->notify(new WelcomeNotification());
    }
}
