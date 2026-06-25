<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationInvitationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Reservation $reservation) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $r       = $this->reservation;
        $baseUrl = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');

        return (new MailMessage)
            ->subject("Invitation — {$r->restaurant->name}")
            ->greeting("Bonjour {$notifiable->firstname},")
            ->line("{$r->organizer->firstname} {$r->organizer->lastname} vous invite à une réservation au **{$r->restaurant->name}**.")
            ->line("Date : " . $r->reservation_datetime->format('d/m/Y à H:i'))
            ->action('Répondre à l\'invitation', "{$baseUrl}/reservations/{$r->id}/invitation");
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'           => 'reservation_invitation',
            'reservation_id' => $this->reservation->id,
            'organizer'      => $this->reservation->organizer->firstname . ' ' . $this->reservation->organizer->lastname,
        ];
    }
}
