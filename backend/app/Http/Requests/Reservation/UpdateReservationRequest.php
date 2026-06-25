<?php

namespace App\Http\Requests\Reservation;

use App\Http\Requests\BaseRequest;

class UpdateReservationRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'reservation_datetime' => ['sometimes', 'date', 'after:now'],
            'number_of_guests'     => ['sometimes', 'integer', 'min:1', 'max:100'],
            'special_requests'     => ['sometimes', 'nullable', 'string', 'max:1000'],
        ];
    }
}
