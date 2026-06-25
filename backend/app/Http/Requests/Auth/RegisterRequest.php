<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'firstname'             => ['required', 'string', 'max:100'],
            'lastname'              => ['required', 'string', 'max:100'],
            'email'                 => ['required', 'email', 'unique:users,email'],
            'password'              => ['required', 'confirmed', 'min:8', Password::defaults()],
            'phone_number'          => ['required', 'string', 'max:20'],
        ];
    }
}
