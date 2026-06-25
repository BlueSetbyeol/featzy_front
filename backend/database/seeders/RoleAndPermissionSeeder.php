<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions by category
        $permissions = [
            // User management
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',
            'users.manage',

            // Restaurant management
            'restaurants.view',
            'restaurants.create',
            'restaurants.edit',
            'restaurants.delete',
            'restaurants.manage',
            'restaurants.edit-own',

            // Menu management
            'menus.view',
            'menus.create',
            'menus.edit',
            'menus.delete',
            'menus.manage',
            'menus.edit-own',

            // Menu items
            'menu-items.view',
            'menu-items.create',
            'menu-items.edit',
            'menu-items.delete',
            'menu-items.manage',

            // Reservations
            'reservations.view',
            'reservations.create',
            'reservations.edit',
            'reservations.delete',
            'reservations.manage',
            'reservations.view-own',
            'reservations.edit-own',
            'reservations.cancel-own',

            // Orders
            'orders.view',
            'orders.create',
            'orders.edit',
            'orders.delete',
            'orders.manage',
            'orders.view-own',
            'orders.edit-own',

            // Payments
            'payments.view',
            'payments.create',
            'payments.refund',
            'payments.manage',
            'payments.view-own',

            // Friend groups
            'friend-groups.view',
            'friend-groups.create',
            'friend-groups.edit',
            'friend-groups.delete',
            'friend-groups.manage-own',

            // Favorites
            'favorites.view',
            'favorites.create',
            'favorites.delete',
            'favorites.manage-own',

            // Opening hours
            'opening-hours.view',
            'opening-hours.edit',
            'opening-hours.manage',

            // Dashboard & Reports
            'dashboard.view',
            'dashboard.admin',
            'reports.view',
            'reports.export',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        
        // Super Admin - has all permissions via Gate::before in AppServiceProvider
        $superAdmin = Role::firstOrCreate(['name' => 'super-admin']);

        // Admin - manages the platform
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->givePermissionTo([
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',
            'users.manage',
            'restaurants.view',
            'restaurants.create',
            'restaurants.edit',
            'restaurants.delete',
            'restaurants.manage',
            'menus.view',
            'menus.manage',
            'menu-items.view',
            'menu-items.manage',
            'reservations.view',
            'reservations.manage',
            'orders.view',
            'orders.manage',
            'payments.view',
            'payments.manage',
            'payments.refund',
            'dashboard.view',
            'dashboard.admin',
            'reports.view',
            'reports.export',
        ]);

        // Restaurant Owner - manages their own restaurants
        $restaurantOwner = Role::firstOrCreate(['name' => 'restaurant-owner']);
        $restaurantOwner->givePermissionTo([
            'restaurants.view',
            'restaurants.create',
            'restaurants.edit-own',
            'menus.view',
            'menus.create',
            'menus.edit-own',
            'menu-items.view',
            'menu-items.create',
            'menu-items.edit',
            'menu-items.delete',
            'reservations.view',
            'reservations.edit',
            'orders.view',
            'orders.edit',
            'payments.view',
            'opening-hours.view',
            'opening-hours.edit',
            'dashboard.view',
            'reports.view',
        ]);

        // Regular User - customers
        $user = Role::firstOrCreate(['name' => 'user']);
        $user->givePermissionTo([
            'restaurants.view',
            'menus.view',
            'menu-items.view',
            'reservations.view-own',
            'reservations.create',
            'reservations.edit-own',
            'reservations.cancel-own',
            'orders.view-own',
            'orders.create',
            'orders.edit-own',
            'payments.view-own',
            'payments.create',
            'friend-groups.view',
            'friend-groups.create',
            'friend-groups.manage-own',
            'favorites.view',
            'favorites.create',
            'favorites.delete',
            'favorites.manage-own',
            'opening-hours.view',
        ]);
    }
}
