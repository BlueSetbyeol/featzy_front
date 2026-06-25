<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReservationParticipant>
 */
class ReservationParticipantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $hasUser = fake()->boolean(70);
        $status = fake()->randomElement(['pending', 'accepted', 'declined']);

        return [
            'reservation_id' => Reservation::factory(),
            'user_id' => $hasUser ? User::factory() : null,
            'guest_name' => $hasUser ? null : fake()->name(),
            'guest_email' => $hasUser ? null : fake()->safeEmail(),
            'invitation_status' => $status,
            'invitation_sent_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'response_at' => $status !== 'pending' ? fake()->dateTimeBetween('-1 month', 'now') : null,
            'added_at' => fake()->dateTimeBetween('-2 months', 'now'),
        ];
    }

    /**
     * Guest without app account.
     */
    public function guest(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
            'guest_name' => fake()->name(),
            'guest_email' => fake()->safeEmail(),
        ]);
    }

    /**
     * Accepted invitation.
     */
    public function accepted(): static
    {
        return $this->state(fn (array $attributes) => [
            'invitation_status' => 'accepted',
            'response_at' => now(),
        ]);
    }

    /**
     * Declined invitation.
     */
    public function declined(): static
    {
        return $this->state(fn (array $attributes) => [
            'invitation_status' => 'declined',
            'response_at' => now(),
        ]);
    }
}
