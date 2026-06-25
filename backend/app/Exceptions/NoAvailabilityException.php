<?php

namespace App\Exceptions;

class NoAvailabilityException extends ApiException
{
    public function __construct(int $remaining)
    {
        parent::__construct(
            "Capacité insuffisante. Places restantes : {$remaining}.",
            409,
            'NO_AVAILABILITY'
        );
    }
}
