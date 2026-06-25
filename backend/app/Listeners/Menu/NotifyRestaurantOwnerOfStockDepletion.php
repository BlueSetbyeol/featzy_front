<?php

namespace App\Listeners\Menu;

use App\Events\Menu\MenuItemStockDepleted;
use App\Notifications\StockDepletionNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class NotifyRestaurantOwnerOfStockDepletion implements ShouldQueue
{
    public function handle(MenuItemStockDepleted $event): void
    {
        $item  = $event->item;
        $owner = $item->menu->restaurant->owner;

        if ($owner) {
            $owner->notify(new StockDepletionNotification($item));
        }
    }
}
