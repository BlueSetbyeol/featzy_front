<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('users.view');
    }

    public function view(User $user, User $target): bool
    {
        return $user->id === $target->id || $user->hasPermissionTo('users.view');
    }

    public function update(User $user, User $target): bool
    {
        return $user->id === $target->id || $user->hasPermissionTo('users.edit');
    }

    public function delete(User $user, User $target): bool
    {
        return $user->hasPermissionTo('users.delete');
    }
}
