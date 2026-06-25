<?php

namespace App\DTOs\Reservation;

use Carbon\Carbon;

final readonly class UpdateReservationDTO
{
    public function __construct(
        public ?Carbon $reservation_datetime = null,
        public ?int $number_of_guests = null,
        public ?string $special_requests = null,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            reservation_datetime: isset($data['reservation_datetime']) ? Carbon::parse($data['reservation_datetime']) : null,
            number_of_guests:     isset($data['number_of_guests']) ? (int) $data['number_of_guests'] : null,
            special_requests:     $data['special_requests'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'reservation_datetime' => $this->reservation_datetime?->toDateTimeString(),
            'number_of_guests'     => $this->number_of_guests,
            'special_requests'     => $this->special_requests,
        ], fn ($v) => $v !== null);
    }
}
