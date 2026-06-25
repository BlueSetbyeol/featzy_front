<?php

namespace App\Http\Requests\Menu;

use App\Enums\MenuItemCategory;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateMenuItemRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'name'           => ['sometimes', 'string', 'max:200'],
            'description'    => ['sometimes', 'nullable', 'string'],
            'price'          => ['sometimes', 'numeric', 'min:0'],
            'category'       => ['sometimes', new Enum(MenuItemCategory::class)],
            'stock_quantity' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'is_available'   => ['sometimes', 'boolean'],
            'image_url'      => ['sometimes', 'nullable', 'url', 'max:500'],
        ];
    }
}
