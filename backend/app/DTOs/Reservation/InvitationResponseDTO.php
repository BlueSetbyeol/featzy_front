<?php

namespace App\DTOs\Reservation;

use App\Enums\InvitationStatus;

final readonly class InvitationResponseDTO
{
    public function __construct(public InvitationStatus $status) {}

    public static function from(array $data): self
    {
        return new self(status: InvitationStatus::from($data['status']));
    }
}
