<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Card          = 'card';
    case Cash          = 'cash';
    case MobilePayment = 'mobile_payment';
    case Other         = 'other';

    public function label(): string
    {
        return match($this) {
            self::Card          => 'Carte bancaire',
            self::Cash          => 'Espèces',
            self::MobilePayment => 'Paiement mobile',
            self::Other         => 'Autre',
        };
    }
}
