<?php

namespace App\DTOs\Menu;

final readonly class StockUpdateDTO
{
    public function __construct(
        public int $delta,
        public string $reason,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            delta:  (int) $data['delta'],
            reason: $data['reason'],
        );
    }
}
