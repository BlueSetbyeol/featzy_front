<?php

namespace App\Http\Controllers\Api\Auth;

use App\DTOs\Auth\LoginDTO;
use App\DTOs\Auth\RegisterDTO;
use App\DTOs\Auth\ResetPasswordDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\VerifyEmailRequest;
use App\Http\Resources\UserResource;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = $this->authService->register(RegisterDTO::from($request->validated()));

        Auth::login($user);
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->created(
            [
                'user'  => UserResource::make($user->load('roles')),
                'token' => $token,
            ],
            'Compte créé avec succès.'
        );
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = $this->authService->login(LoginDTO::from($request->validated()));

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->success(
            [
                'user'  => UserResource::make($user->load('roles')),
                'token' => $token,
            ],
            'Connexion réussie.'
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request);

        return $this->noContent();
    }

    public function me(Request $request): JsonResponse
    {
        return $this->success(
            UserResource::make($request->user()->load('address', 'roles'))
        );
    }

    public function verifyEmail(VerifyEmailRequest $request): JsonResponse
    {
        $this->authService->verifyEmail($request->validated('token'));

        return $this->success(null, 'Email vérifié avec succès.');
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $this->authService->sendPasswordResetEmail($request->validated('email'));

        return $this->success(null, 'Si cet email existe, un lien de réinitialisation a été envoyé.');
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $this->authService->resetPassword(ResetPasswordDTO::from($request->validated()));

        return $this->success(null, 'Mot de passe réinitialisé avec succès.');
    }
}
