<?php

namespace App\Exceptions;

use RuntimeException;
use Throwable;

class ApiException extends RuntimeException
{
    public function __construct(
        string $message,
        public readonly int $statusCode = 400,
        public readonly string $errorCode = 'API_ERROR',
        public readonly array $errors = [],
        ?Throwable $previous = null,
    ) {
        parent::__construct($message, 0, $previous);
    }

    // ── Named constructors ───────────────────────────────────────────────────

    public static function notFound(string $resource = 'Resource'): static
    {
        return new NotFoundException("{$resource} not found.");
    }

    public static function unauthorized(string $message = 'Unauthorized.'): static
    {
        return new UnauthorizedException($message);
    }

    public static function forbidden(string $message = 'Forbidden.'): static
    {
        return new ForbiddenException($message);
    }

    public static function conflict(string $message): static
    {
        return new ConflictException($message);
    }

    public static function unprocessable(string $message, array $errors = []): static
    {
        return new UnprocessableException($message, $errors);
    }
}
