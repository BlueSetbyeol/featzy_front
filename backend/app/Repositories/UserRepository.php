<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserRepository extends BaseRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->model->newQuery()
            ->where('email', $email)
            ->first();
    }

    public function findByVerificationToken(string $token): ?User
    {
        return $this->model->newQuery()
            ->where('email_verification_token', $token)
            ->first();
    }

    public function findByPasswordResetToken(string $token): ?User
    {
        return $this->model->newQuery()
            ->where('password_reset_token', $token)
            ->first();
    }

    public function paginateWithRoles(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->newQuery()
            ->with('roles')
            ->paginate($perPage);
    }
}
