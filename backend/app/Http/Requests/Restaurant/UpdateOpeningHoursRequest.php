<?php

namespace App\Http\Requests\Restaurant;

use App\Enums\DayOfWeek;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateOpeningHoursRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'hours'                     => ['required', 'array'],
            'hours.*.day_of_week'       => ['required', new Enum(DayOfWeek::class)],
            'hours.*.opening_time'      => ['required_unless:hours.*.is_closed,true', 'date_format:H:i'],
            'hours.*.closing_time'      => ['required_unless:hours.*.is_closed,true', 'date_format:H:i', 'after:hours.*.opening_time'],
            'hours.*.service_label'     => ['sometimes', 'nullable', 'string', 'max:50'],
            'hours.*.is_closed'         => ['sometimes', 'boolean'],
        ];
    }
}
