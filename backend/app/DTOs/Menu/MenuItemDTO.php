<?php

namespace App\DTOs\Menu;

use App\Enums\MenuItemCategory;

final readonly class MenuItemDTO
{
    public function __construct(
        public string $name,
        public ?string $description,
        public float $price,
        public MenuItemCategory $category,
        public ?int $stock_quantity = null,
        public bool $is_available = true,
        public ?string $image_url = null,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            name:           $data['name'],
            description:    $data['description'] ?? null,
            price:          (float) $data['price'],
            category:       MenuItemCategory::from($data['category']),
            stock_quantity: isset($data['stock_quantity']) ? (int) $data['stock_quantity'] : null,
            is_available:   isset($data['is_available']) ? (bool) $data['is_available'] : true,
            image_url:      $data['image_url'] ?? null,
        );
    }
}
