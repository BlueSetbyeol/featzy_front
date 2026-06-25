<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ReservationResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                   => $this->id,
            'restaurant'           => RestaurantResource::make($this->whenLoaded('restaurant')),
            'organizer'            => UserResource::make($this->whenLoaded('organizer')),
            'reservation_datetime' => $this->reservation_datetime,
            'number_of_guests'     => $this->number_of_guests,
            'status'               => $this->status->value,
            'status_label'         => $this->status->label(),
            'bill_split_type'      => $this->bill_split_type->value,
            'bill_split_type_label'=> $this->bill_split_type->label(),
            'table_number'         => $this->table_number,
            'special_requests'     => $this->special_requests,
            'cancellation_reason'  => $this->cancellation_reason,
            'confirmed_at'         => $this->confirmed_at,
            'cancelled_at'         => $this->cancelled_at,
            'participants'         => ReservationParticipantResource::collection($this->whenLoaded('participants')),
            'created_at'           => $this->created_at,
        ];
    }
}
