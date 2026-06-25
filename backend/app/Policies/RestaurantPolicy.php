<?php

namespace App\Policies;

use App\Models\Restaurant;
use App\Models\User;

class RestaurantPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Restaurant $restaurant): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['restaurant-owner', 'admin']);
    }

    public function update(User $user, Restaurant $restaurant): bool
    {
        return $user->id === $restaurant->owner_id || $user->hasRole('admin');
    }

    public function delete(User $user, Restaurant $restaurant): bool
    {
        return $user->id === $restaurant->owner_id || $user->hasRole('admin');
    }

    public function manageOpeningHours(User $user, Restaurant $restaurant): bool
    {
        return $user->id === $restaurant->owner_id || $user->hasRole('admin');
    }

    public function toggleActive(User $user): bool
    {
        return $user->hasRole('admin');
    }
}
