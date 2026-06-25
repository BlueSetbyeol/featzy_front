<?php

namespace App\Providers;

use App\Events\Auth\EmailVerified;
use App\Events\Auth\UserRegistered;
use App\Events\Menu\MenuItemStockDepleted;
use App\Events\Reservation\InvitationResponded;
use App\Events\Reservation\ReservationCreated;
use App\Events\Reservation\ReservationStatusChanged;
use App\Listeners\Auth\SendEmailVerificationNotification;
use App\Listeners\Auth\SendWelcomeNotification;
use App\Listeners\Menu\NotifyRestaurantOwnerOfStockDepletion;
use App\Listeners\Reservation\NotifyOrganizerOfInvitationResponse;
use App\Listeners\Reservation\NotifyRestaurantOwnerOfNewReservation;
use App\Listeners\Reservation\SendInvitationsToParticipants;
use App\Listeners\Reservation\SendReservationConfirmationToOrganizer;
use App\Listeners\Reservation\SendReservationStatusUpdateToOrganizer;
use App\Listeners\Reservation\SendReservationStatusUpdateToParticipants;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Reservation;
use App\Models\Restaurant;
use App\Observers\MenuItemObserver;
use App\Observers\ReservationObserver;
use App\Policies\MenuItemPolicy;
use App\Policies\MenuPolicy;
use App\Policies\ReservationPolicy;
use App\Policies\RestaurantPolicy;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // Super-admin bypass all gates
        Gate::before(function ($user, $ability) {
            return $user->hasRole('super-admin') ? true : null;
        });

        // Policies
        Gate::policy(Restaurant::class, RestaurantPolicy::class);
        Gate::policy(Menu::class, MenuPolicy::class);
        Gate::policy(MenuItem::class, MenuItemPolicy::class);
        Gate::policy(Reservation::class, ReservationPolicy::class);

        // Observers
        MenuItem::observe(MenuItemObserver::class);
        Reservation::observe(ReservationObserver::class);

        // Auth events
        Event::listen(UserRegistered::class, SendEmailVerificationNotification::class);
        Event::listen(EmailVerified::class, SendWelcomeNotification::class);

        // Menu events
        Event::listen(MenuItemStockDepleted::class, NotifyRestaurantOwnerOfStockDepletion::class);

        // Reservation events
        Event::listen(ReservationCreated::class, SendReservationConfirmationToOrganizer::class);
        Event::listen(ReservationCreated::class, SendInvitationsToParticipants::class);
        Event::listen(ReservationCreated::class, NotifyRestaurantOwnerOfNewReservation::class);
        Event::listen(ReservationStatusChanged::class, SendReservationStatusUpdateToOrganizer::class);
        Event::listen(ReservationStatusChanged::class, SendReservationStatusUpdateToParticipants::class);
        Event::listen(InvitationResponded::class, NotifyOrganizerOfInvitationResponse::class);
    }
}
