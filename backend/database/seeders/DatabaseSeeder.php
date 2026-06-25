<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Favorite;
use App\Models\FriendGroup;
use App\Models\FriendGroupMember;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\ReservationParticipant;
use App\Models\Restaurant;
use App\Models\RestaurantOpeningHours;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed roles and permissions first
        $this->call(RoleAndPermissionSeeder::class);

        // Create addresses first
        $addresses = Address::factory(50)->create();

        // Create super admin user
        $superAdmin = User::factory()->create([
            'firstname' => 'Super',
            'lastname' => 'Admin',
            'email' => 'superadmin@example.com',
            'address_id' => $addresses->random()->id,
        ]);
        $superAdmin->assignRole('super-admin');

        // Create admin user
        $admin = User::factory()->create([
            'firstname' => 'Admin',
            'lastname' => 'User',
            'email' => 'admin@example.com',
            'address_id' => $addresses->random()->id,
        ]);
        $admin->assignRole('admin');

        // Create users with existing addresses
        $users = User::factory(30)->create([
            'address_id' => fn () => $addresses->random()->id,
        ]);

        // Assign 'user' role to all regular users
        foreach ($users as $user) {
            $user->assignRole('user');
        }

        // Create a test user
        $testUser = User::factory()->create([
            'firstname' => 'Test',
            'lastname' => 'User',
            'email' => 'test@example.com',
            'address_id' => $addresses->first()->id,
        ]);
        $testUser->assignRole('user');
        $users->push($testUser);

        // Create friend groups with members
        $friendGroups = FriendGroup::factory(10)->create([
            'owner_id' => fn () => $users->random()->id,
        ]);

        foreach ($friendGroups as $group) {
            // Add 2-5 members to each group (excluding owner)
            $members = $users->where('id', '!=', $group->owner_id)->random(rand(2, 5));
            foreach ($members as $member) {
                FriendGroupMember::factory()->create([
                    'group_id' => $group->id,
                    'user_id' => $member->id,
                ]);
            }
        }

        // Create restaurants with owners
        $restaurantOwners = $users->random(10);
        $restaurants = collect();

        foreach ($restaurantOwners as $owner) {
            // Assign restaurant-owner role (they keep user role too)
            if (!$owner->hasRole('restaurant-owner')) {
                $owner->assignRole('restaurant-owner');
            }

            $restaurant = Restaurant::factory()->create([
                'owner_id' => $owner->id,
                'address_id' => Address::factory()->create()->id,
            ]);
            $restaurants->push($restaurant);

            // Create opening hours for each restaurant (all 7 days)
            foreach (range(0, 6) as $day) {
                // Most restaurants closed on Sunday (day 0) or Monday (day 1)
                $isClosed = ($day === 0 || ($day === 1 && fake()->boolean(50)));

                if ($isClosed) {
                    RestaurantOpeningHours::factory()->closed()->create([
                        'restaurant_id' => $restaurant->id,
                        'day_of_week' => $day,
                    ]);
                } else {
                    // Lunch service
                    RestaurantOpeningHours::factory()->create([
                        'restaurant_id' => $restaurant->id,
                        'day_of_week' => $day,
                        'opening_time' => '12:00:00',
                        'closing_time' => '14:30:00',
                    ]);
                    // Dinner service (separate record would need adjusting model, using extended hours instead)
                }
            }
        }

        // Create additional restaurants without specific owners
        $additionalRestaurants = Restaurant::factory(5)->create([
            'owner_id' => fn () => $users->random()->id,
            'address_id' => fn () => Address::factory()->create()->id,
        ]);
        $restaurants = $restaurants->merge($additionalRestaurants);

        // Create menus and menu items for each restaurant
        foreach ($restaurants as $restaurant) {
            $menus = Menu::factory(rand(1, 3))->create([
                'restaurant_id' => $restaurant->id,
            ]);

            foreach ($menus as $menu) {
                // Create items for each category
                MenuItem::factory(rand(2, 4))->entree()->create(['menu_id' => $menu->id]);
                MenuItem::factory(rand(3, 5))->plat()->create(['menu_id' => $menu->id]);
                MenuItem::factory(rand(2, 3))->dessert()->create(['menu_id' => $menu->id]);
                MenuItem::factory(rand(3, 5))->create(['menu_id' => $menu->id, 'category' => 'boisson']);
            }
        }

        // Create reservations
        $reservations = collect();
        foreach (range(1, 50) as $_) {
            $reservation = Reservation::factory()->create([
                'organizer_id' => $users->random()->id,
                'restaurant_id' => $restaurants->random()->id,
            ]);
            $reservations->push($reservation);

            // Add 1-4 participants to each reservation
            $participantCount = rand(1, 4);
            $participants = $users->where('id', '!=', $reservation->organizer_id)->random(min($participantCount, $users->count() - 1));
            foreach ($participants as $participant) {
                ReservationParticipant::factory()->create([
                    'reservation_id' => $reservation->id,
                    'user_id' => $participant->id,
                ]);
            }

            // Some reservations have guest participants (non-registered users)
            if (fake()->boolean(30)) {
                ReservationParticipant::factory()->guest()->create([
                    'reservation_id' => $reservation->id,
                ]);
            }
        }

        // Create orders for confirmed/completed reservations
        $completedReservations = $reservations->filter(fn ($r) => in_array($r->status, ['confirmed', 'completed']));

        foreach ($completedReservations as $reservation) {
            $restaurant = Restaurant::find($reservation->restaurant_id);
            $menuItems = MenuItem::whereIn('menu_id', $restaurant->menus->pluck('id'))->get();

            if ($menuItems->isEmpty()) {
                continue;
            }

            // Create order for organizer
            $order = Order::factory()->create([
                'reservation_id' => $reservation->id,
                'user_id' => $reservation->organizer_id,
                'status' => $reservation->status === 'completed' ? 'served' : 'confirmed',
            ]);

            // Add 2-4 items to each order
            $orderTotal = 0;
            foreach (range(1, rand(2, 4)) as $_) {
                $menuItem = $menuItems->random();
                $quantity = rand(1, 2);
                $subtotal = $menuItem->price * $quantity;
                $orderTotal += $subtotal;

                OrderItem::factory()->create([
                    'order_id' => $order->id,
                    'menu_item_id' => $menuItem->id,
                    'quantity' => $quantity,
                    'unit_price' => $menuItem->price,
                    'subtotal' => $subtotal,
                ]);
            }

            $order->update(['total_amount' => $orderTotal]);

            // Create payment for completed orders
            if ($reservation->status === 'completed') {
                Payment::factory()->completed()->create([
                    'order_id' => $order->id,
                    'user_id' => $reservation->organizer_id,
                    'amount' => $orderTotal,
                ]);
            }
        }

        // Create favorites
        foreach ($users->random(15) as $user) {
            $favoriteRestaurants = $restaurants->random(rand(1, 5));
            foreach ($favoriteRestaurants as $restaurant) {
                Favorite::factory()->create([
                    'user_id' => $user->id,
                    'restaurant_id' => $restaurant->id,
                ]);
            }
        }

        $this->command->info('Database seeded successfully!');
        $this->command->newLine();
        $this->command->info('Test accounts (password: "password"):');
        $this->command->table(
            ['Email', 'Role'],
            [
                ['superadmin@example.com', 'super-admin'],
                ['admin@example.com', 'admin'],
                ['test@example.com', 'user'],
            ]
        );
    }
}
