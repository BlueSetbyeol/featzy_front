<?php

namespace App\Events\Reservation;

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReservationStatusChanged
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Reservation $reservation,
        public readonly ReservationStatus $oldStatus,
    ) {}
}
