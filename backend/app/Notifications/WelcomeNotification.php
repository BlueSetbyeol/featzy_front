<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Bienvenue !')
            ->greeting('Bienvenue ' . $notifiable->firstname . ' !')
            ->line('Votre compte a été vérifié avec succès.')
            ->line('Vous pouvez maintenant réserver des tables dans vos restaurants préférés.')
            ->action('Découvrir l\'application', env('FRONTEND_URL', 'http://localhost:3000'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'    => 'welcome',
            'message' => 'Bienvenue ! Votre compte est maintenant actif.',
        ];
    }
}
