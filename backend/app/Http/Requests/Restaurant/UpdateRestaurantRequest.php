<?php

namespace App\Http\Requests\Restaurant;

use App\Enums\PriceRange;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateRestaurantRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'name'                => ['sometimes', 'string', 'max:200'],
            'email'               => ['sometimes', 'email', 'max:255'],
            'phone_number'        => ['sometimes', 'string', 'max:20'],
            'description'         => ['sometimes', 'nullable', 'string'],
            'price_range'         => ['sometimes', new Enum(PriceRange::class)],
            'capacity'            => ['sometimes', 'integer', 'min:1'],
            'allow_pre_order'     => ['sometimes', 'boolean'],
            'cuisine_type'        => ['sometimes', 'nullable', 'string', 'max:100'],
            'logo_url'            => ['sometimes', 'nullable', 'url', 'max:500'],
            'cover_image_url'     => ['sometimes', 'nullable', 'url', 'max:500'],
            // Address (all optional)
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
