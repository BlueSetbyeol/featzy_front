<?php

namespace App\Observers;

use App\Events\Menu\MenuItemStockDepleted;
use App\Models\MenuItem;

class MenuItemObserver
{
    public function updated(MenuItem $item): void
    {
        if (! $item->wasChanged('stock_quantity')) {
            return;
        }

        if ($item->stock_quantity === 0) {
            $item->updateQuietly(['is_available' => false]);
            event(new MenuItemStockDepleted($item));
        } elseif ($item->stock_quantity > 0 && ! $item->is_available) {
            $item->updateQuietly(['is_available' => true]);
        }
    }
}
