<?php

namespace Database\Factories;

use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Menu>
 */
class MenuFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $menuNames = [
            'Menu du Midi', 'Menu du Soir', 'Menu Dégustation', 'Menu Découverte',
            'Menu Gastronomique', 'Menu Végétarien', 'Menu Enfant', 'Carte Printemps 2026',
        ];

        $validFrom = fake()->dateTimeBetween('-3 months', 'now');
        $validTo = fake()->dateTimeBetween($validFrom, '+6 months');

        return [
            'restaurant_id' => Restaurant::factory(),
            'name' => fake()->randomElement($menuNames),
            'description' => fake()->optional(0.8)->sentence(),
            'is_active' => true,
            'valid_from' => $validFrom,
            'valid_to' => $validTo,
        ];
    }

    /**
     * Inactive menu.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
