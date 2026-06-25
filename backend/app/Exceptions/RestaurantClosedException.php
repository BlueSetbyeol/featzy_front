<?php

namespace App\Exceptions;

class RestaurantClosedException extends ApiException
{
    public function __construct()
    {
        parent::__construct('Le restaurant est fermé à ce créneau.', 409, 'RESTAURANT_CLOSED');
    }
}
