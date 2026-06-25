<?php

namespace App\Enums;

enum ReservationStatus: string
{
    case Pending   = 'pending';
    case Confirmed = 'confirmed';
    case Cancelled = 'cancelled';
    case Completed = 'completed';
    case NoShow    = 'no_show';

    public function label(): string
    {
        return match($this) {
            self::Pending   => 'En attente',
            self::Confirmed => 'Confirmée',
            self::Cancelled => 'Annulée',
            self::Completed => 'Terminée',
            self::NoShow    => 'No-show',
        };
    }

    /**
     * Retourne les statuts vers lesquels cette transition est autorisée.
     *
     * @return ReservationStatus[]
     */
    public function allowedTransitions(): array
    {
        return match($this) {
            self::Pending   => [self::Confirmed, self::Cancelled],
            self::Confirmed => [self::Completed, self::Cancelled, self::NoShow],
            self::Completed,
            self::Cancelled,
            self::NoShow    => [],
        };
    }

    public function canTransitionTo(self $new): bool
    {
        return in_array($new, $this->allowedTransitions(), true);
    }
}
