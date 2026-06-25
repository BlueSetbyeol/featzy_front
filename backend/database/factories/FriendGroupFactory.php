<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FriendGroup>
 */
class FriendGroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $groupNames = [
            'Collègues', 'Famille', 'Amis du sport', 'Anciens camarades',
            'Voisins', 'Club de lecture', 'Groupe running', 'Les gourmands',
        ];

        return [
            'owner_id' => User::factory(),
            'name' => fake()->randomElement($groupNames) . ' ' . fake()->emoji(),
            'description' => fake()->optional(0.7)->sentence(),
        ];
    }
}
