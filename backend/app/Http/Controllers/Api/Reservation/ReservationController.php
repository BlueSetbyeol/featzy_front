<?php

namespace App\Http\Controllers\Api\Reservation;

use App\DTOs\Reservation\CreateReservationDTO;
use App\DTOs\Reservation\InvitationResponseDTO;
use App\DTOs\Reservation\UpdateReservationDTO;
use App\Exceptions\ForbiddenException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reservation\CreateReservationRequest;
use App\Http\Requests\Reservation\InvitationResponseRequest;
use App\Http\Requests\Reservation\UpdateReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Repositories\ReservationParticipantRepository;
use App\Repositories\ReservationRepository;
use App\Services\Reservation\ReservationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function __construct(
        private readonly ReservationService $service,
        private readonly ReservationRepository $reservations,
        private readonly ReservationParticipantRepository $participants,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $asOrganizer   = $this->reservations->findByOrganizer($userId);
        $asParticipant = $this->reservations->findWhereParticipant($userId);

        $all = $asOrganizer->merge($asParticipant)->unique('id')->sortByDesc('reservation_datetime')->values();

        return $this->success(ReservationResource::collection($all));
    }

    public function store(CreateReservationRequest $request): JsonResponse
    {
        $reservation = $this->service->create(
            $request->user(),
            CreateReservationDTO::from($request->validated())
        );

        return $this->created(
            ReservationResource::make($reservation->load('restaurant.address', 'participants.user')),
            'Réservation créée avec succès.'
        );
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $reservation = $this->reservations->findOrFail($id);
        $reservation->load('restaurant.address', 'organizer', 'participants.user');
        $this->authorize('view', $reservation);

        return $this->success(ReservationResource::make($reservation));
    }

    public function update(UpdateReservationRequest $request, int $id): JsonResponse
    {
        $reservation = $this->reservations->findOrFail($id);
        $this->authorize('update', $reservation);

        $reservation = $this->service->update($reservation, UpdateReservationDTO::from($request->validated()));

        return $this->success(
            ReservationResource::make($reservation->load('restaurant.address', 'participants.user')),
            'Réservation mise à jour.'
        );
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $reservation = $this->reservations->findOrFail($id);
        $this->authorize('cancel', $reservation);

        $reason = $request->input('cancellation_reason', '');
        $this->service->cancel($reservation, $reason);

        return $this->noContent();
    }

    public function respondToInvitation(InvitationResponseRequest $request, int $id): JsonResponse
    {
        $reservation = $this->reservations->findOrFail($id);
        $participant = $this->participants->findByReservationAndUser($id, $request->user()->id);

        if (! $participant) {
            throw new ForbiddenException('Vous n\'êtes pas invité à cette réservation.');
        }

        $participant = $this->service->respondToInvitation(
            $participant,
            InvitationResponseDTO::from($request->validated())
        );

        return $this->success(null, "Invitation {$participant->invitation_status->label()}.");
    }

    // ── Owner actions ─────────────────────────────────────────────────────────

    public function listForRestaurant(Request $request, int $restaurantId): JsonResponse
    {
        $reservations = $this->reservations->findByRestaurant($restaurantId, $request->query());

        return $this->success(ReservationResource::collection($reservations));
    }

    public function confirm(int $id): JsonResponse
    {
        $reservation = $this->reservations->findOrFail($id);
        $this->authorize('confirm', $reservation);

        $reservation = $this->service->confirm($reservation);

        return $this->success(ReservationResource::make($reservation), 'Réservation confirmée.');
    }

    public function decline(int $id): JsonResponse
    {
        $reservation = $this->reservations->findOrFail($id);
        $this->authorize('cancel', $reservation);

        $reservation = $this->service->cancel($reservation, 'Refusée par le restaurant.');

        return $this->success(ReservationResource::make($reservation), 'Réservation refusée.');
    }

    public function complete(int $id): JsonResponse
    {
        $reservation = $this->reservations->findOrFail($id);
        $this->authorize('complete', $reservation);

        $reservation = $this->service->complete($reservation);

        return $this->success(ReservationResource::make($reservation), 'Réservation terminée.');
    }

    public function noShow(int $id): JsonResponse
    {
        $reservation = $this->reservations->findOrFail($id);
        $this->authorize('noShow', $reservation);

        $reservation = $this->service->noShow($reservation);

        return $this->success(ReservationResource::make($reservation), 'No-show enregistré.');
    }
}
