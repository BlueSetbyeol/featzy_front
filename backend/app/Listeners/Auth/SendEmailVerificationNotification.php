<?php

namespace App\Listeners\Auth;

use App\Events\Auth\UserRegistered;
use App\Notifications\EmailVerificationNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendEmailVerificationNotification implements ShouldQueue
{
    public function handle(UserRegistered $event): void
    {
        $event->user->notify(new EmailVerificationNotification(
            $event->user->email_verification_token
        ));
    }
}
