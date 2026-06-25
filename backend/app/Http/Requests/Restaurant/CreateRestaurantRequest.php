<?php

namespace App\Http\Requests\Restaurant;

use App\Enums\PriceRange;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class CreateRestaurantRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'name'                => ['required', 'string', 'max:200'],
            'email'               => ['sometimes', 'email', 'max:255'],
            'phone_number'        => ['sometimes', 'string', 'max:20'],
            'description'         => ['sometimes', 'nullable', 'string'],
            'price_range'         => ['required', new Enum(PriceRange::class)],
            'capacity'            => ['required', 'integer', 'min:1'],
            'allow_pre_order'     => ['sometimes', 'boolean'],
            'cuisine_type'        => ['sometimes', 'nullable', 'string', 'max:100'],
            'logo_url'            => ['sometimes', 'nullable', 'url', 'max:500'],
            'cover_image_url'     => ['sometimes', 'nullable', 'url', 'max:500'],
            // Address
            'address.street'      => ['required', 'string', 'max:255'],
            'address.zipcode'     => ['required', 'string', 'max:20'],
            'address.city'        => ['required', 'string', 'max:100'],
            'address.country'     => ['sometimes', 'string', 'max:100'],
            'address.latitude'    => ['required', 'numeric', 'between:-90,90'],
            'address.longitude'   => ['required', 'numeric', 'between:-180,180'],
            'address.additional_info' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
