<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['pending', 'processing', 'completed', 'failed', 'refunded']);
        $paymentMethod = fake()->randomElement(['card', 'cash', 'mobile_payment', 'other']);

        return [
            'order_id' => Order::factory(),
            'user_id' => User::factory(),
            'amount' => fake()->randomFloat(2, 10.00, 200.00),
            'payment_method' => $paymentMethod,
            'status' => $status,
            'transaction_id' => $paymentMethod !== 'cash' ? 'txn_' . Str::random(24) : null,
            'payment_gateway' => $paymentMethod === 'card' ? fake()->randomElement(['Stripe', 'PayPal']) : null,
            'error_message' => $status === 'failed' ? fake()->sentence() : null,
            'refund_amount' => $status === 'refunded' ? fake()->randomFloat(2, 5.00, 100.00) : null,
            'refunded_at' => $status === 'refunded' ? fake()->dateTimeBetween('-1 month', 'now') : null,
            'paid_at' => $status === 'completed' ? fake()->dateTimeBetween('-1 month', 'now') : null,
        ];
    }

    /**
     * Completed payment.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'paid_at' => now(),
            'error_message' => null,
        ]);
    }

    /**
     * Failed payment.
     */
    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
            'error_message' => 'Card declined',
            'paid_at' => null,
        ]);
    }

    /**
     * Refunded payment.
     */
    public function refunded(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'refunded',
            'refund_amount' => $attributes['amount'] ?? fake()->randomFloat(2, 10.00, 100.00),
            'refunded_at' => now(),
        ]);
    }
}
