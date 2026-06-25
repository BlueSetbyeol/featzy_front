<?php

namespace Database\Factories;

use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['pending', 'confirmed', 'cancelled', 'completed', 'no_show']);

        return [
            'organizer_id' => User::factory(),
            'restaurant_id' => Restaurant::factory(),
            'reservation_datetime' => fake()->dateTimeBetween('+1 day', '+2 months'),
            'number_of_guests' => fake()->numberBetween(1, 10),
            'status' => $status,
            'table_number' => fake()->optional(0.7)->numerify('T##'),
            'special_requests' => fake()->optional(0.3)->sentence(),
            'bill_split_type' => fake()->randomElement(['individual', 'equal_split', 'custom']),
            'cancellation_reason' => $status === 'cancelled' ? fake()->sentence() : null,
            'cancelled_at' => $status === 'cancelled' ? fake()->dateTimeBetween('-1 month', 'now') : null,
            'confirmed_at' => in_array($status, ['confirmed', 'completed']) ? fake()->dateTimeBetween('-1 month', 'now') : null,
        ];
    }

    /**
     * Pending reservation.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'confirmed_at' => null,
            'cancelled_at' => null,
            'cancellation_reason' => null,
        ]);
    }

    /**
     * Confirmed reservation.
     */
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
            'confirmed_at' => now(),
            'cancelled_at' => null,
            'cancellation_reason' => null,
        ]);
    }

    /**
     * Completed reservation (in the past).
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'reservation_datetime' => fake()->dateTimeBetween('-2 months', '-1 day'),
            'confirmed_at' => fake()->dateTimeBetween('-3 months', '-2 months'),
        ]);
    }

    /**
     * Cancelled reservation.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => fake()->sentence(),
        ]);
    }
}
