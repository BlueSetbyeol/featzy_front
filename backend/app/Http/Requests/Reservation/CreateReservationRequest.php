<?php

namespace App\Http\Requests\Reservation;

use App\Enums\BillSplitType;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class CreateReservationRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'restaurant_id'        => ['required', 'integer', 'exists:restaurants,id'],
            'reservation_datetime' => ['required', 'date', 'after:now'],
            'number_of_guests'     => ['required', 'integer', 'min:1', 'max:100'],
            'bill_split_type'      => ['sometimes', new Enum(BillSplitType::class)],
            'friend_group_id'      => ['sometimes', 'nullable', 'integer', 'exists:friend_groups,id'],
            'special_requests'     => ['sometimes', 'nullable', 'string', 'max:1000'],
        ];
    }
}
