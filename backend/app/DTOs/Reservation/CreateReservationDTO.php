<?php

namespace App\DTOs\Reservation;

use App\Enums\BillSplitType;
use Carbon\Carbon;

final readonly class CreateReservationDTO
{
    public function __construct(
        public int $restaurant_id,
        public Carbon $reservation_datetime,
        public int $number_of_guests,
        public BillSplitType $bill_split_type = BillSplitType::Individual,
        public ?int $friend_group_id = null,
        public ?string $special_requests = null,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            restaurant_id:        (int) $data['restaurant_id'],
            reservation_datetime: Carbon::parse($data['reservation_datetime']),
            number_of_guests:     (int) $data['number_of_guests'],
            bill_split_type:      BillSplitType::from($data['bill_split_type'] ?? BillSplitType::Individual->value),
            friend_group_id:      isset($data['friend_group_id']) ? (int) $data['friend_group_id'] : null,
            special_requests:     $data['special_requests'] ?? null,
        );
    }
}
