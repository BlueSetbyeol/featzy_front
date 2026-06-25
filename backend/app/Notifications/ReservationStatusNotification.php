<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Reservation $reservation) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $r = $this->reservation;
        return (new MailMessage)
            ->subject("Réservation #{$r->id} — {$r->status->label()}")
            ->greeting("Bonjour {$notifiable->firstname},")
            ->line("Votre réservation au **{$r->restaurant->name}** est maintenant : **{$r->status->label()}**.")
            ->line("Date : " . $r->reservation_datetime->format('d/m/Y à H:i'))
            ->action('Voir ma réservation', env('FRONTEND_URL', 'http://localhost:3000') . "/reservations/{$r->id}");
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'           => 'reservation_status_changed',
            'reservation_id' => $this->reservation->id,
            'status'         => $this->reservation->status->value,
        ];
    }
}
