<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Address>
 */
class AddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'street' => fake()->streetAddress(),
            'zipcode' => fake()->postcode(),
            'city' => fake()->city(),
            'country' => 'France',
            'latitude' => fake()->latitude(42.0, 51.0), // France latitude range
            'longitude' => fake()->longitude(-5.0, 10.0), // France longitude range
            'additional_info' => fake()->optional(0.3)->secondaryAddress(),
        ];
    }

    /**
     * Address in Paris.
     */
    public function paris(): static
    {
        return $this->state(fn (array $attributes) => [
            'city' => 'Paris',
            'zipcode' => '750' . fake()->numberBetween(01, 20),
            'latitude' => fake()->latitude(48.815, 48.902),
            'longitude' => fake()->longitude(2.225, 2.470),
        ]);
    }
}
