<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Restaurant>
 */
class RestaurantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cuisineTypes = [
            'Française', 'Italienne', 'Japonaise', 'Chinoise', 'Indienne',
            'Mexicaine', 'Libanaise', 'Thaïlandaise', 'Américaine', 'Méditerranéenne',
            'Vietnamienne', 'Coréenne', 'Grecque', 'Espagnole', 'Marocaine',
        ];

        $restaurantPrefixes = [
            'Le', 'La', 'Chez', 'Au', 'L\'', 'Aux',
        ];

        $restaurantNames = [
            'Petit Bistrot', 'Belle Époque', 'Jardin Secret', 'Table Ronde',
            'Bon Vivant', 'Saveurs d\'Orient', 'Terrasse du Lac', 'Coin Gourmand',
        ];

        return [
            'owner_id' => User::factory(),
            'name' => fake()->randomElement($restaurantPrefixes) . ' ' . fake()->randomElement($restaurantNames),
            'email' => fake()->unique()->companyEmail(),
            'phone_number' => fake()->phoneNumber(),
            'description' => fake()->paragraphs(2, true),
            'address_id' => Address::factory(),
            'logo_url' => fake()->imageUrl(200, 200, 'food'),
            'cover_image_url' => fake()->imageUrl(1200, 400, 'restaurant'),
            'cuisine_type' => fake()->randomElement($cuisineTypes),
            'price_range' => fake()->randomElement(['€', '€€', '€€€', '€€€€']),
            'capacity' => fake()->numberBetween(20, 150),
            'average_rating' => fake()->randomFloat(2, 3.0, 5.0),
            'total_reviews' => fake()->numberBetween(0, 500),
            'is_active' => true,
            'allow_pre_order' => fake()->boolean(40),
        ];
    }

    /**
     * Mark restaurant as inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Restaurant that doesn't accept reservations.
     */
    public function noReservations(): static
    {
        return $this->state(fn (array $attributes) => [
            'allow_pre_order' => false,
        ]);
    }
}
