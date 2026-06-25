<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Draft     = 'draft';
    case Submitted = 'submitted';
    case Confirmed = 'confirmed';
    case Preparing = 'preparing';
    case Served    = 'served';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match($this) {
            self::Draft     => 'Brouillon',
            self::Submitted => 'Soumise',
            self::Confirmed => 'Confirmée',
            self::Preparing => 'En préparation',
            self::Served    => 'Servie',
            self::Cancelled => 'Annulée',
        };
    }

    /**
     * @return OrderStatus[]
     */
    public function allowedTransitions(): array
    {
        return match($this) {
            self::Draft     => [self::Submitted, self::Cancelled],
            self::Submitted => [self::Confirmed, self::Cancelled],
            self::Confirmed => [self::Preparing, self::Cancelled],
            self::Preparing => [self::Served],
            self::Served,
            self::Cancelled => [],
        };
    }

    public function canTransitionTo(self $new): bool
    {
        return in_array($new, $this->allowedTransitions(), true);
    }
}
