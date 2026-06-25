<?php

namespace App\Enums;

enum PriceRange: string
{
    case Budget     = '€';
    case Moderate   = '€€';
    case Expensive  = '€€€';
    case Luxury     = '€€€€';

    public function label(): string
    {
        return match($this) {
            self::Budget    => 'Économique',
            self::Moderate  => 'Modéré',
            self::Expensive => 'Cher',
            self::Luxury    => 'Luxe',
        };
    }
}
