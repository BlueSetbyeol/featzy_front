<?php

namespace App\Enums;

enum MenuItemCategory: string
{
    case Entree        = 'entree';
    case Plat          = 'plat';
    case Dessert       = 'dessert';
    case Boisson       = 'boisson';
    case Accompagnement = 'accompagnement';
    case Autre         = 'autre';

    public function label(): string
    {
        return match($this) {
            self::Entree         => 'Entrée',
            self::Plat           => 'Plat principal',
            self::Dessert        => 'Dessert',
            self::Boisson        => 'Boisson',
            self::Accompagnement => 'Accompagnement',
            self::Autre          => 'Autre',
        };
    }
}
