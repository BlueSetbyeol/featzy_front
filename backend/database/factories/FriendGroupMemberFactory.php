<?php

namespace Database\Factories;

use App\Models\FriendGroup;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FriendGroupMember>
 */
class FriendGroupMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'group_id' => FriendGroup::factory(),
            'added_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
