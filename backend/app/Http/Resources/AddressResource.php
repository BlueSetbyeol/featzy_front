<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class AddressResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'street'          => $this->street,
            'zipcode'         => $this->zipcode,
            'city'            => $this->city,
            'country'         => $this->country,
            'additional_info' => $this->additional_info,
            'latitude'        => $this->latitude,
            'longitude'       => $this->longitude,
        ];
    }
}
