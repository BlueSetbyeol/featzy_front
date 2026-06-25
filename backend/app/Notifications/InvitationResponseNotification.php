<?php

namespace App\Notifications;

use App\Models\ReservationParticipant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvitationResponseNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly ReservationParticipant $participant) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $p    = $this->participant;
        $name = $p->user ? "{$p->user->firstname} {$p->user->lastname}" : $p->guest_name;

        return (new MailMessage)
            ->subject("Réponse à votre invitation — réservation #{$p->reservation_id}")
            ->greeting("Bonjour {$notifiable->firstname},")
            ->line("**{$name}** a **{$p->invitation_status->label()}** votre invitation.")
            ->action('Voir la réservation', env('FRONTEND_URL', 'http://localhost:3000') . "/reservations/{$p->reservation_id}");
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'              => 'invitation_response',
            'reservation_id'    => $this->participant->reservation_id,
            'invitation_status' => $this->participant->invitation_status->value,
        ];
    }
}
