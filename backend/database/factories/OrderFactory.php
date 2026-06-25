<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['draft', 'submitted', 'confirmed', 'preparing', 'served', 'cancelled']);

        return [
            'reservation_id' => Reservation::factory(),
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['pre_order', 'on_site']),
            'status' => $status,
            'total_amount' => fake()->randomFloat(2, 15.00, 200.00),
            'notes' => fake()->optional(0.2)->sentence(),
            'submitted_at' => in_array($status, ['submitted', 'confirmed', 'preparing', 'served']) ? fake()->dateTimeBetween('-1 month', 'now') : null,
            'served_at' => $status === 'served' ? fake()->dateTimeBetween('-1 month', 'now') : null,
        ];
    }

    /**
     * Draft order.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'submitted_at' => null,
            'served_at' => null,
        ]);
    }

    /**
     * Submitted order.
     */
    public function submitted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);
    }

    /**
     * Served order.
     */
    public function served(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'served',
            'submitted_at' => fake()->dateTimeBetween('-2 hours', '-1 hour'),
            'served_at' => now(),
        ]);
    }
}
