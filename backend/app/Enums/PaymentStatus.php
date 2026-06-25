<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case Pending    = 'pending';
    case Processing = 'processing';
    case Completed  = 'completed';
    case Failed     = 'failed';
    case Refunded   = 'refunded';

    public function label(): string
    {
        return match($this) {
            self::Pending    => 'En attente',
            self::Processing => 'En cours',
            self::Completed  => 'Payé',
            self::Failed     => 'Échoué',
            self::Refunded   => 'Remboursé',
        };
    }

    /**
     * @return PaymentStatus[]
     */
    public function allowedTransitions(): array
    {
        return match($this) {
            self::Pending    => [self::Processing, self::Failed],
            self::Processing => [self::Completed, self::Failed],
            self::Completed  => [self::Refunded],
            self::Failed,
            self::Refunded   => [],
        };
    }

    public function canTransitionTo(self $new): bool
    {
        return in_array($new, $this->allowedTransitions(), true);
    }
}
