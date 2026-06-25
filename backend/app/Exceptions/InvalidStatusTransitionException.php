<?php

namespace App\Exceptions;

class InvalidStatusTransitionException extends ApiException
{
    public function __construct(string $from, string $to)
    {
        parent::__construct(
            "Transition de statut invalide : {$from} → {$to}.",
            422,
            'INVALID_STATUS_TRANSITION'
        );
    }
}
