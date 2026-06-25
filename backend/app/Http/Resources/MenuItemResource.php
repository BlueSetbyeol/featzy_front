<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class MenuItemResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'description'    => $this->description,
            'price'          => $this->price,
            'category'       => $this->category->value,
            'category_label' => $this->category->label(),
            'image_url'      => $this->image_url,
            'stock_quantity' => $this->stock_quantity, // null = illimité
            'is_available'   => $this->is_available,
        ];
    }
}
