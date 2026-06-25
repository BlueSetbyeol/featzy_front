<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ReservationParticipantResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'user'                     => UserResource::make($this->whenLoaded('user')),
            'guest_name'               => $this->guest_name,
            'invitation_status'        => $this->invitation_status->value,
            'invitation_status_label'  => $this->invitation_status->label(),
        ];
    }
}
