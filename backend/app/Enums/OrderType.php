<?php

namespace App\Enums;

enum OrderType: string
{
    case PreOrder = 'pre_order';
    case OnSite   = 'on_site';

    public function label(): string
    {
        return match($this) {
            self::PreOrder => 'Pré-commande',
            self::OnSite   => 'Sur place',
        };
    }
}
