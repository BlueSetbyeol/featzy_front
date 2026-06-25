<?php

namespace App\Http\Requests\Menu;

use App\Http\Requests\BaseRequest;

class CreateMenuRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'is_active'   => ['sometimes', 'boolean'],
        ];
    }
}
