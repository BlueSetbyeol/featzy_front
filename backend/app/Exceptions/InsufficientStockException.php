<?php

namespace App\Exceptions;

class InsufficientStockException extends ApiException
{
    public function __construct(string $itemName, int $requested, int $available)
    {
        parent::__construct(
            "Stock insuffisant pour \"{$itemName}\" : {$requested} demandé(s), {$available} disponible(s).",
            422,
            'INSUFFICIENT_STOCK'
        );
    }
}
