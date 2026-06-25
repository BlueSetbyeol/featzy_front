<?php

namespace App\Exceptions;

class StockNotTrackedException extends ApiException
{
    public function __construct(string $itemName)
    {
        parent::__construct(
            "Le stock de \"{$itemName}\" n'est pas géré (illimité).",
            422,
            'STOCK_NOT_TRACKED'
        );
    }
}
