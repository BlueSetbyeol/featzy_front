<?php

namespace App\Exceptions;

class UnprocessableException extends ApiException
{
    public function __construct(string $message, array $errors = [])
    {
        parent::__construct($message, 422, 'UNPROCESSABLE', $errors);
    }
}
