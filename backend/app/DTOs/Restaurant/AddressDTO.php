<?php

namespace App\DTOs\Restaurant;

final readonly class AddressDTO
{
    public function __construct(
        public string $street,
        public string $zipcode,
        public string $city,
        public string $country,
        public ?float $latitude,
        public ?float $longitude,
        public ?string $additional_info = null,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            street:          $data['street'],
            zipcode:         $data['zipcode'],
            city:            $data['city'],
            country:         $data['country'] ?? 'France',
            latitude:        isset($data['latitude']) ? (float) $data['latitude'] : null,
            longitude:       isset($data['longitude']) ? (float) $data['longitude'] : null,
            additional_info: $data['additional_info'] ?? null,
        );
    }
}
