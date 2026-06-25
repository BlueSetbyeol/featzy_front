<?php

namespace App\Http\Requests\Reservation;

use App\Http\Requests\BaseRequest;

class InvitationResponseRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'status' => ['required', 'in:accepted,declined'],
        ];
    }
}
