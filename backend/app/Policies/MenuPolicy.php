<?php

namespace App\Policies;

use App\Models\Menu;
use App\Models\User;

class MenuPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Menu $menu): bool
    {
        return true;
    }

    public function create(User $user, \App\Models\Restaurant $restaurant): bool
    {
        return $user->id === $restaurant->owner_id || $user->hasRole('admin');
    }

    public function update(User $user, Menu $menu): bool
    {
        return $user->id === $menu->restaurant->owner_id || $user->hasRole('admin');
    }

    public function delete(User $user, Menu $menu): bool
    {
        return $user->id === $menu->restaurant->owner_id || $user->hasRole('admin');
    }
}
