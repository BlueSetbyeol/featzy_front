<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class OpeningHoursResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'day_of_week'   => $this->day_of_week->value,
            'day_name'      => $this->day_of_week->label(),
            'opening_time'  => $this->opening_time,
            'closing_time'  => $this->closing_time,
            'service_label' => $this->service_label,
            'is_closed'     => $this->is_closed,
        ];
    }
}
