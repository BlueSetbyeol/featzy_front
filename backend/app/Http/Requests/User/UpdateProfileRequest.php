<?php

namespace App\Http\Requests\User;

use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Password;

class UpdateProfileRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'firstname'           => ['sometimes', 'string', 'max:100'],
            'lastname'            => ['sometimes', 'string', 'max:100'],
            'phone_number'        => ['sometimes', 'string', 'max:20'],
            'profile_picture_url' => ['sometimes', 'url', 'max:500'],
            // Password change
            'current_password'    => ['required_with:new_password', 'string'],
            'new_password'        => ['sometimes', 'confirmed', 'min:8', Password::defaults()],
            // Address (optional)
            'address.street'      => ['sometimes', 'string', 'max:255'],
            'address.zipcode'     => ['sometimes', 'string', 'max:20'],
            'address.city'        => ['sometimes', 'string', 'max:100'],
            'address.country'     => ['sometimes', 'string', 'max:100'],
            'address.latitude'    => ['sometimes', 'numeric', 'between:-90,90'],
            'address.longitude'   => ['sometimes', 'numeric', 'between:-180,180'],
            'address.additional_info' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
