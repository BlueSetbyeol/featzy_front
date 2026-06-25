<?php

namespace App\DTOs\Restaurant;

use App\Enums\PriceRange;

final readonly class RestaurantDTO
{
    public function __construct(
        public string $name,
        public ?string $email,
        public ?string $phone_number,
        public ?string $description,
        public PriceRange $price_range,
        public int $capacity,
        public bool $allow_pre_order = false,
        public ?string $cuisine_type = null,
        public ?string $logo_url = null,
        public ?string $cover_image_url = null,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            name:            $data['name'],
            email:           $data['email'] ?? null,
            phone_number:    $data['phone_number'] ?? null,
            description:     $data['description'] ?? null,
            price_range:     PriceRange::from($data['price_range']),
            capacity:        (int) $data['capacity'],
            allow_pre_order: (bool) ($data['allow_pre_order'] ?? false),
            cuisine_type:    $data['cuisine_type'] ?? null,
            logo_url:        $data['logo_url'] ?? null,
            cover_image_url: $data['cover_image_url'] ?? null,
        );
    }
}
