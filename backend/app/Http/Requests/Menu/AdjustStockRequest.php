<?php

namespace App\Http\Requests\Menu;

use App\Http\Requests\BaseRequest;

class AdjustStockRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'delta'  => ['required', 'integer'],
            'reason' => ['required', 'string', 'max:255'],
        ];
    }
}
