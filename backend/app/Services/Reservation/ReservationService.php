<?php

namespace App\Services\Reservation;

use App\DTOs\Reservation\CreateReservationDTO;
use App\DTOs\Reservation\InvitationResponseDTO;
use App\DTOs\Reservation\UpdateReservationDTO;
use App\Events\Reservation\InvitationResponded;
use App\Exceptions\InvalidStatusTransitionException;
use App\Exceptions\NoAvailabilityException;
use App\Exceptions\RestaurantClosedException;
use App\Models\Reservation;
use App\Models\ReservationParticipant;
use App\Models\User;
use App\Repositories\OpeningHoursRepository;
use App\Repositories\ReservationParticipantRepository;
use App\Repositories\ReservationRepository;
use App\Repositories\RestaurantRepository;
use Illuminate\Support\Facades\DB;

class ReservationService
{
    public function __construct(
        private readonly ReservationRepository $reservations,
        private readonly ReservationParticipantRepository $participants,
        private readonly RestaurantRepository $restaurants,
        private readonly OpeningHoursRepository $openingHours,
    ) {}

    public function create(User $organizer, CreateReservationDTO $dto): Reservation
    {
        return DB::transaction(function () use ($organizer, $dto) {
            // Lock restaurant row to prevent race conditions
            $restaurant = $this->restaurants->model->newQuery()
                ->lockForUpdate()
                ->findOrFail($dto->restaurant_id);

            // 1. Vérification horaires
            if (! $this->openingHours->isOpenAt($dto->restaurant_id, $dto->reservation_datetime)) {
                throw new RestaurantClosedException();
            }

            // 2. Vérification capacité
            $slotEnd   = (clone $dto->reservation_datetime)->addMinutes(120);
            $confirmed = $this->reservations->countConfirmedGuestsForSlot(
                $dto->restaurant_id,
                $dto->reservation_datetime,
                $slotEnd
            );
            $remaining = $restaurant->capacity - $confirmed;

            if ($remaining < $dto->number_of_guests) {
                throw new NoAvailabilityException($remaining);
            }

            // 3. Création réservation
            $reservation = $this->reservations->create([
                'organizer_id'         => $organizer->id,
                'restaurant_id'        => $dto->restaurant_id,
                'reservation_datetime' => $dto->reservation_datetime,
                'number_of_guests'     => $dto->number_of_guests,
                'bill_split_type'      => $dto->bill_split_type->value,
                'special_requests'     => $dto->special_requests,
                'status'               => 'pending',
            ]);

            // 4. Invitations groupe d'amis
            if ($dto->friend_group_id) {
                $members = \App\Models\FriendGroup::findOrFail($dto->friend_group_id)
                    ->members()
                    ->where('user_id', '!=', $organizer->id)
                    ->get();

                foreach ($members as $member) {
                    $this->participants->create([
                        'reservation_id'    => $reservation->id,
                        'user_id'           => $member->id,
                        'invitation_status' => 'pending',
                        'invitation_sent_at'=> now(),
                        'added_at'          => now(),
                    ]);
                }
            }

            return $reservation->load('restaurant', 'participants');
        });
    }

    public function update(Reservation $reservation, UpdateReservationDTO $dto): Reservation
    {
        return $this->reservations->update($reservation, $dto->toArray());
    }

    public function cancel(Reservation $reservation, string $reason = ''): Reservation
    {
        $this->assertTransition($reservation, \App\Enums\ReservationStatus::Cancelled);

        return $this->reservations->update($reservation, [
            'status'              => 'cancelled',
            'cancellation_reason' => $reason ?: null,
            'cancelled_at'        => now(),
        ]);
    }

    public function confirm(Reservation $reservation): Reservation
    {
        $this->assertTransition($reservation, \App\Enums\ReservationStatus::Confirmed);

        return $this->reservations->update($reservation, [
            'status'       => 'confirmed',
            'confirmed_at' => now(),
        ]);
    }

    public function complete(Reservation $reservation): Reservation
    {
        $this->assertTransition($reservation, \App\Enums\ReservationStatus::Completed);

        return $this->reservations->update($reservation, ['status' => 'completed']);
    }

    public function noShow(Reservation $reservation): Reservation
    {
        $this->assertTransition($reservation, \App\Enums\ReservationStatus::NoShow);

        return $this->reservations->update($reservation, ['status' => 'no_show']);
    }

    public function respondToInvitation(ReservationParticipant $participant, InvitationResponseDTO $dto): ReservationParticipant
    {
        $this->participants->update($participant, [
            'invitation_status' => $dto->status->value,
            'response_at'       => now(),
        ]);

        event(new InvitationResponded($participant->fresh()->load('reservation.organizer')));

        return $participant->fresh();
    }

    private function assertTransition(Reservation $reservation, \App\Enums\ReservationStatus $newStatus): void
    {
        if (! $reservation->status->canTransitionTo($newStatus)) {
            throw new InvalidStatusTransitionException(
                $reservation->status->value,
                $newStatus->value
            );
        }
    }
}
