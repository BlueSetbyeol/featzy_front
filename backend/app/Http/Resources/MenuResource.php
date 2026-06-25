<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class MenuResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $this->description,
            'is_active'   => $this->is_active,
            'items'       => MenuItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
