<?php

namespace Database\Factories;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MenuItem>
 */
class MenuItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['entree', 'plat', 'dessert', 'boisson', 'accompagnement'];
        $category = fake()->randomElement($categories);

        $items = [
            'entree' => [
                'Salade César', 'Soupe à l\'oignon', 'Tartare de saumon', 'Carpaccio de bœuf',
                'Foie gras maison', 'Velouté de champignons', 'Bruschetta', 'Œuf cocotte',
            ],
            'plat' => [
                'Filet de bœuf', 'Magret de canard', 'Risotto aux champignons', 'Pavé de saumon',
                'Entrecôte grillée', 'Poulet rôti', 'Blanquette de veau', 'Burger gourmet',
            ],
            'dessert' => [
                'Fondant au chocolat', 'Crème brûlée', 'Tarte Tatin', 'Tiramisu',
                'Mousse au chocolat', 'Panna cotta', 'Profiteroles', 'Île flottante',
            ],
            'boisson' => [
                'Coca-Cola', 'Eau minérale', 'Jus d\'orange frais', 'Café',
                'Thé vert', 'Limonade maison', 'Vin rouge (verre)', 'Bière artisanale',
            ],
            'accompagnement' => [
                'Frites maison', 'Purée de pommes de terre', 'Légumes grillés', 'Riz basmati',
                'Salade verte', 'Haricots verts', 'Gratin dauphinois', 'Ratatouille',
            ],
        ];

        return [
            'menu_id' => Menu::factory(),
            'name' => fake()->randomElement($items[$category]),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 3.50, 45.00),
            'category' => $category,
            'image_url' => fake()->optional(0.6)->imageUrl(400, 300, 'food'),
            'stock_quantity' => fake()->optional(0.7)->numberBetween(1, 100), // NULL = illimité
            'is_available' => fake()->boolean(90),
        ];
    }

    /**
     * Entrée item.
     */
    public function entree(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'entree',
            'price' => fake()->randomFloat(2, 8.00, 18.00),
        ]);
    }

    /**
     * Main course.
     */
    public function plat(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'plat',
            'price' => fake()->randomFloat(2, 15.00, 35.00),
        ]);
    }

    /**
     * Dessert item.
     */
    public function dessert(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'dessert',
            'price' => fake()->randomFloat(2, 6.00, 14.00),
        ]);
    }

    /**
     * Vegetarian item.
     */
    public function vegetarian(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_vegetarian' => true,
        ]);
    }
}
