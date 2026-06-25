<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class FavoriteResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'restaurant_id' => $this->restaurant_id,
            'restaurant'    => RestaurantResource::make($this->whenLoaded('restaurant')),
            'created_at'    => $this->created_at,
        ];
    }
}
