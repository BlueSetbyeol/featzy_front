<?php

namespace App\DTOs\Restaurant;

use App\Enums\DayOfWeek;

final readonly class OpeningHoursDTO
{
    public function __construct(
        public DayOfWeek $day_of_week,
        public string $opening_time,
        public string $closing_time,
        public ?string $service_label = null,
        public bool $is_closed = false,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            day_of_week:   DayOfWeek::from((int) $data['day_of_week']),
            opening_time:  $data['opening_time'] ?? $data['open_time'] ?? '00:00',
            closing_time:  $data['closing_time'] ?? $data['close_time'] ?? '00:00',
            service_label: $data['service_label'] ?? null,
            is_closed:     (bool) ($data['is_closed'] ?? false),
        );
    }

    public function toArray(): array
    {
        return [
            'day_of_week'   => $this->day_of_week->value,
            'opening_time'  => $this->opening_time,
            'closing_time'  => $this->closing_time,
            'service_label' => $this->service_label,
            'is_closed'     => $this->is_closed,
        ];
    }
}
