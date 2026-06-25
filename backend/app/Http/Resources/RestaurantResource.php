<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class RestaurantResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'name'            => $this->name,
            'description'     => $this->description,
            'email'           => $this->email,
            'phone_number'    => $this->phone_number,
            'cuisine_type'    => $this->cuisine_type,
            'price_range'     => $this->price_range->value,
            'price_range_label' => $this->price_range->label(),
            'capacity'        => $this->capacity,
            'allow_pre_order' => $this->allow_pre_order,
            'average_rating'  => $this->average_rating,
            'total_reviews'   => $this->total_reviews,
            'is_active'       => $this->is_active,
            'logo_url'        => $this->logo_url,
            'cover_image_url' => $this->cover_image_url,
            'address'         => AddressResource::make($this->whenLoaded('address')),
            'opening_hours'   => OpeningHoursResource::collection($this->whenLoaded('openingHours')),
            'distance_km'     => $this->whenNotNull($this->resource->distance_km ?? null),
            'created_at'      => $this->created_at,
        ];
    }
}
