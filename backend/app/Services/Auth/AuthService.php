<?php

namespace App\Services\Auth;

use App\DTOs\Auth\LoginDTO;
use App\DTOs\Auth\RegisterDTO;
use App\DTOs\Auth\ResetPasswordDTO;
use App\Events\Auth\EmailVerified;
use App\Events\Auth\UserRegistered;
use App\Exceptions\ConflictException;
use App\Exceptions\UnauthorizedException;
use App\Exceptions\UnprocessableException;
use App\Models\User;
use App\Notifications\PasswordResetNotification;
use App\Repositories\UserRepository;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuthService
{
    public function __construct(private readonly UserRepository $users) {}

    public function register(RegisterDTO $dto): User
    {
        $user = $this->users->create([
            'firstname'                  => $dto->firstname,
            'lastname'                   => $dto->lastname,
            'email'                      => $dto->email,
            'password'                   => $dto->password,
            'phone_number'               => $dto->phone_number,
            'email_verified'             => false,
            'email_verification_token'   => Str::random(64),
        ]);

        $user->assignRole('user');

        event(new UserRegistered($user));

        return $user;
    }

    public function login(LoginDTO $dto): User
    {
        if (! Auth::attempt(['email' => $dto->email, 'password' => $dto->password])) {
            throw new UnauthorizedException('Identifiants invalides.');
        }

        /** @var User $user */
        $user = Auth::user();

        if (! $user->is_active) {
            Auth::logout();
            throw new UnauthorizedException('Compte désactivé.');
        }

        $this->users->update($user, ['last_login_at' => now()]);

        return $user->fresh();
    }

    public function logout(Request $request): void
    {
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
    }

    public function verifyEmail(string $token): User
    {
        $user = $this->users->findByVerificationToken($token);

        if (! $user) {
            throw new UnprocessableException('Token de vérification invalide.');
        }

        if ($user->email_verified_at !== null) {
            throw new ConflictException('Email déjà vérifié.');
        }

        $this->users->update($user, [
            'email_verified_at'          => now(),
            'email_verified'             => true,
            'email_verification_token'   => null,
        ]);

        event(new EmailVerified($user->fresh()));

        return $user->fresh();
    }

    public function sendPasswordResetEmail(string $email): void
    {
        $user = $this->users->findByEmail($email);

        if (! $user) {
            return; // Silence — ne pas révéler si l'email existe
        }

        $token = Str::random(64);

        $this->users->update($user, [
            'password_reset_token'   => $token,
            'password_reset_expires' => now()->addMinutes(60),
        ]);

        $user->notify(new PasswordResetNotification($token));
    }

    public function resetPassword(ResetPasswordDTO $dto): void
    {
        $user = $this->users->findByEmail($dto->email);

        if (! $user || $user->password_reset_token !== $dto->token) {
            throw new UnprocessableException('Token invalide.');
        }

        if (! $user->password_reset_expires || now()->isAfter($user->password_reset_expires)) {
            throw new UnprocessableException('Token expiré.');
        }

        $this->users->update($user, [
            'password'               => $dto->password,
            'password_reset_token'   => null,
            'password_reset_expires' => null,
        ]);
    }
}
