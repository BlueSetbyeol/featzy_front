<?php

namespace Database\Factories;

use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RestaurantOpeningHours>
 */
class RestaurantOpeningHoursFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'restaurant_id' => Restaurant::factory(),
            'day_of_week' => fake()->numberBetween(0, 6),
            'opening_time' => '12:00:00',
            'closing_time' => '14:30:00',
            'is_closed' => false,
        ];
    }

    /**
     * Closed day.
     */
    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_closed' => true,
            'opening_time' => '00:00:00',
            'closing_time' => '00:00:00',
        ]);
    }

    /**
     * Dinner service.
     */
    public function dinner(): static
    {
        return $this->state(fn (array $attributes) => [
            'opening_time' => '19:00:00',
            'closing_time' => '23:00:00',
        ]);
    }
}
