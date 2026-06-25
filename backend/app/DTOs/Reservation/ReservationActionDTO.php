<?php

namespace App\DTOs\Reservation;

use App\Enums\ReservationStatus;

final readonly class ReservationActionDTO
{
    public function __construct(public ReservationStatus $status) {}

    public static function from(array $data): self
    {
        return new self(status: ReservationStatus::from($data['status']));
    }
}
