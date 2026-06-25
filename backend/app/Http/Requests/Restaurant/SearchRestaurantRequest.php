<?php

namespace App\Http\Requests\Restaurant;

use App\Enums\PriceRange;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class SearchRestaurantRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'query'       => ['sometimes', 'nullable', 'string', 'max:255'],
            'lat'         => ['sometimes', 'nullable', 'numeric', 'between:-90,90', 'required_with:lng'],
            'lng'         => ['sometimes', 'nullable', 'numeric', 'between:-180,180', 'required_with:lat'],
            'radius_km'   => ['sometimes', 'numeric', 'min:1', 'max:100'],
            'price_range' => ['sometimes', 'nullable', new Enum(PriceRange::class)],
            'cuisine_type'=> ['sometimes', 'nullable', 'string', 'max:100'],
            'per_page'    => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
