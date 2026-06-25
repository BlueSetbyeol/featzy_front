<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class ApiExceptionHandler
{
    public static function register(Exceptions $exceptions): void
    {
        // Custom API exceptions — single renderer for the whole hierarchy
        $exceptions->render(
            fn (ApiException $e, Request $request) => self::renderApiException($e)
        );

        // Eloquent model not found → 404
        $exceptions->render(
            fn (ModelNotFoundException $e) => self::json(
                'Resource not found.',
                404,
                'NOT_FOUND'
            )
        );

        // Sanctum / session auth failure → 401
        $exceptions->render(
            fn (AuthenticationException $e) => self::json(
                'Unauthenticated.',
                401,
                'UNAUTHENTICATED'
            )
        );

        // Laravel validation (fallback if BaseRequest is not used) → 422
        $exceptions->render(
            fn (ValidationException $e) => self::json(
                'Validation failed.',
                422,
                'VALIDATION_ERROR',
                $e->errors()
            )
        );

        // Generic Symfony HTTP exceptions (404, 405, 419…)
        $exceptions->render(
            fn (HttpException $e, Request $request) => self::json(
                $e->getMessage() ?: 'HTTP error.',
                $e->getStatusCode(),
                'HTTP_ERROR'
            )
        );

        // Catch-all: never leak stack traces in production
        $exceptions->render(function (Throwable $e, Request $request): ?JsonResponse {
            if (app()->environment('production')) {
                return self::json('An unexpected error occurred.', 500, 'SERVER_ERROR');
            }

            return null; // Let Laravel's debug renderer handle it in local/testing
        });
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private static function renderApiException(ApiException $e): JsonResponse
    {
        return self::json($e->getMessage(), $e->statusCode, $e->errorCode, $e->errors ?: null);
    }

    private static function json(
        string $message,
        int $status,
        string $errorCode,
        mixed $errors = null
    ): JsonResponse {
        return response()->json([
            'success'    => false,
            'error_code' => $errorCode,
            'message'    => $message,
            'errors'     => $errors,
        ], $status);
    }
}
