<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationCreatedNotification extends Notification implements ShouldQueue
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
            ->subject("Réservation #{$r->id} reçue")
            ->greeting("Bonjour {$notifiable->firstname},")
            ->line("Votre réservation au **{$r->restaurant->name}** a bien été enregistrée.")
            ->line("Date : " . $r->reservation_datetime->format('d/m/Y à H:i'))
            ->line("Couverts : {$r->number_of_guests}")
            ->line("Statut : En attente de confirmation.")
            ->action('Voir ma réservation', env('FRONTEND_URL', 'http://localhost:3000') . "/reservations/{$r->id}");
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'           => 'reservation_created',
            'reservation_id' => $this->reservation->id,
            'restaurant'     => $this->reservation->restaurant->name,
        ];
    }
}
