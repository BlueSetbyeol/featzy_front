<?php

namespace App\Policies;

use App\Models\MenuItem;
use App\Models\User;

class MenuItemPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, MenuItem $item): bool
    {
        return true;
    }

    public function create(User $user, \App\Models\Menu $menu): bool
    {
        return $user->id === $menu->restaurant->owner_id || $user->hasRole('admin');
    }

    public function update(User $user, MenuItem $item): bool
    {
        return $user->id === $item->menu->restaurant->owner_id || $user->hasRole('admin');
    }

    public function delete(User $user, MenuItem $item): bool
    {
        return $user->id === $item->menu->restaurant->owner_id || $user->hasRole('admin');
    }

    public function updateStock(User $user, MenuItem $item): bool
    {
        return $user->id === $item->menu->restaurant->owner_id || $user->hasRole('admin');
    }
}
