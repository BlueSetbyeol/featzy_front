<?php

namespace App\Enums;

enum BillSplitType: string
{
    case Individual  = 'individual';
    case EqualSplit  = 'equal_split';
    case Custom      = 'custom';

    public function label(): string
    {
        return match($this) {
            self::Individual => 'Paiement individuel',
            self::EqualSplit => 'Partage égal',
            self::Custom     => 'Partage personnalisé',
        };
    }
}
