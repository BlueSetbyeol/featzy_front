<?php

namespace App\Notifications;

use App\Models\MenuItem;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StockDepletionNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly MenuItem $item) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $restaurantName = $this->item->menu->restaurant->name;
        $backOfficeUrl  = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/') . '/owner/items/' . $this->item->id;

        return (new MailMessage)
            ->subject("Stock épuisé — {$this->item->name}")
            ->greeting('Bonjour ' . $notifiable->firstname . ',')
            ->line("L'article **{$this->item->name}** du restaurant *{$restaurantName}* est en rupture de stock.")
            ->action('Gérer le stock', $backOfficeUrl)
            ->line('Pensez à réapprovisionner ou à désactiver cet article.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'          => 'stock_depletion',
            'item_id'       => $this->item->id,
            'item_name'     => $this->item->name,
            'restaurant_id' => $this->item->menu->restaurant_id,
        ];
    }
}
