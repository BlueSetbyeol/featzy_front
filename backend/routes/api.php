<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\SessionController;
use App\Http\Controllers\Api\Menu\MenuController;
use App\Http\Controllers\Api\Owner\DashboardController;
use App\Http\Controllers\Api\Reservation\ReservationController;
use App\Http\Controllers\Api\Restaurant\FavoriteController;
use App\Http\Controllers\Api\Restaurant\OpeningHoursController;
use App\Http\Controllers\Api\Restaurant\RestaurantController;
use App\Http\Controllers\Api\User\NotificationController;
use App\Http\Controllers\Api\User\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Auth (public)
    Route::prefix('auth')->group(function () {
        Route::post('register',        [AuthController::class, 'register']);
        Route::post('login',           [AuthController::class, 'login']);
        Route::post('email/verify',    [AuthController::class, 'verifyEmail']);
        Route::post('password/forgot', [AuthController::class, 'forgotPassword']);
        Route::post('password/reset',  [AuthController::class, 'resetPassword']);

        // Auth (authenticated)
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout',          [AuthController::class, 'logout']);
            Route::get('me',               [AuthController::class, 'me']);

            Route::get('sessions',         [SessionController::class, 'index']);
            Route::delete('sessions',      [SessionController::class, 'revokeAll']);
            Route::delete('sessions/{id}', [SessionController::class, 'revoke']);
        });
    });

    // Profile
    Route::middleware('auth:sanctum')->group(function () {
        Route::put('profile',    [UserController::class, 'updateProfile']);
        Route::delete('profile', [UserController::class, 'deleteAccount']);

        // Notifications
        Route::prefix('notifications')->group(function () {
            Route::get('/',           [NotificationController::class, 'index']);
            Route::post('read-all',   [NotificationController::class, 'markAllAsRead']);
            Route::patch('{id}/read', [NotificationController::class, 'markAsRead']);
            Route::delete('{id}',     [NotificationController::class, 'destroy']);
        });
    });

    // Restaurants (public)
    Route::prefix('restaurants')->group(function () {
        Route::get('/',                  [RestaurantController::class, 'index']);
        Route::get('{id}',               [RestaurantController::class, 'show']);
        Route::get('{id}/opening-hours', [OpeningHoursController::class, 'index']);
        Route::get('{id}/menus',         [MenuController::class, 'index']);
        Route::middleware('auth:sanctum')
            ->get('{id}/availability',   [RestaurantController::class, 'availability']);
    });

    // Menus (public)
    Route::get('menus/{id}', [MenuController::class, 'show']);

    // Owner routes
    Route::prefix('owner')->middleware('auth:sanctum')->group(function () {
        // Restaurants
        Route::post('restaurants',                       [RestaurantController::class, 'store']);
        Route::put('restaurants/{id}',                   [RestaurantController::class, 'update']);
        Route::delete('restaurants/{id}',                [RestaurantController::class, 'destroy']);
        Route::put('restaurants/{id}/opening-hours',     [OpeningHoursController::class, 'upsert']);
        Route::get('restaurants/{id}/dashboard',         [DashboardController::class, 'index']);
        // Menus
        Route::post('restaurants/{id}/menus',            [MenuController::class, 'store']);
        Route::put('menus/{id}',                         [MenuController::class, 'update']);
        Route::delete('menus/{id}',                      [MenuController::class, 'destroy']);
        // Items
        Route::post('menus/{id}/items',                  [MenuController::class, 'storeItem']);
        Route::put('items/{id}',                         [MenuController::class, 'updateItem']);
        Route::delete('items/{id}',                      [MenuController::class, 'destroyItem']);
        Route::patch('items/{id}/stock',                 [MenuController::class, 'adjustStock']);
    });

    // Favorites
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('favorites',                 [FavoriteController::class, 'index']);
        Route::post('favorites/{restaurantId}', [FavoriteController::class, 'toggle']);
    });

    // Reservations (client)
    Route::middleware('auth:sanctum')->prefix('reservations')->group(function () {
        Route::get('/',                              [ReservationController::class, 'index']);
        Route::post('/',                             [ReservationController::class, 'store']);
        Route::get('{id}',                           [ReservationController::class, 'show']);
        Route::put('{id}',                           [ReservationController::class, 'update']);
        Route::delete('{id}',                        [ReservationController::class, 'destroy']);
        Route::post('{id}/invitation/respond',       [ReservationController::class, 'respondToInvitation']);
    });

    // Reservations (owner)
    Route::middleware('auth:sanctum')->prefix('owner')->group(function () {
        Route::get('restaurants/{id}/reservations',  [ReservationController::class, 'listForRestaurant']);
        Route::post('reservations/{id}/confirm',     [ReservationController::class, 'confirm']);
        Route::post('reservations/{id}/decline',     [ReservationController::class, 'decline']);
        Route::post('reservations/{id}/complete',    [ReservationController::class, 'complete']);
        Route::post('reservations/{id}/no-show',     [ReservationController::class, 'noShow']);
    });
});
