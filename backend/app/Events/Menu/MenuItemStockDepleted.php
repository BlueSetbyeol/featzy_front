<?php

namespace App\Events\Menu;

use App\Models\MenuItem;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MenuItemStockDepleted
{
    use Dispatchable, SerializesModels;

    public function __construct(public readonly MenuItem $item) {}
}
