<?php

namespace App\DTOs\Auth;

final readonly class RegisterDTO
{
    public function __construct(
        public string $firstname,
        public string $lastname,
        public string $email,
        public string $password,
        public string $phone_number,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            firstname:    $data['firstname'],
            lastname:     $data['lastname'],
            email:        $data['email'],
            password:     $data['password'],
            phone_number: $data['phone_number'],
        );
    }
}
