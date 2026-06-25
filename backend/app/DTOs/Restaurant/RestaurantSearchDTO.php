<?php

namespace App\DTOs\Restaurant;

use App\Enums\PriceRange;

final readonly class RestaurantSearchDTO
{
    public function __construct(
        public ?string $query = null,
        public ?float $lat = null,
        public ?float $lng = null,
        public float $radius_km = 10,
        public ?PriceRange $price_range = null,
        public ?string $cuisine_type = null,
        public int $per_page = 15,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            query:       $data['query'] ?? null,
            lat:         isset($data['lat']) ? (float) $data['lat'] : null,
            lng:         isset($data['lng']) ? (float) $data['lng'] : null,
            radius_km:   isset($data['radius_km']) ? (float) $data['radius_km'] : 10,
            price_range: isset($data['price_range']) ? PriceRange::from($data['price_range']) : null,
            cuisine_type: $data['cuisine_type'] ?? null,
            per_page:    isset($data['per_page']) ? (int) $data['per_page'] : 15,
        );
    }

    public function hasGeoFilter(): bool
    {
        return $this->lat !== null && $this->lng !== null;
    }
}
