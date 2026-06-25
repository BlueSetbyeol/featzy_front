<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class UserResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'firstname'           => $this->firstname,
            'lastname'            => $this->lastname,
            'email'               => $this->email,
            'phone_number'        => $this->phone_number,
            'profile_picture_url' => $this->profile_picture_url,
            'is_active'           => $this->is_active,
            'email_verified_at'   => $this->email_verified_at,
            'last_login_at'       => $this->last_login_at,
            'created_at'          => $this->created_at,
            'address'             => AddressResource::make($this->whenLoaded('address')),
        ];
    }
}
