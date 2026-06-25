<?php

namespace App\DTOs\Menu;

final readonly class MenuDTO
{
    public function __construct(
        public string $name,
        public ?string $description = null,
        public bool $is_active = true,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            name:        $data['name'],
            description: $data['description'] ?? null,
            is_active:   isset($data['is_active']) ? (bool) $data['is_active'] : true,
        );
    }
}
