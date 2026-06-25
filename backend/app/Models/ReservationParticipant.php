<?php

namespace App\Models;

use App\Enums\InvitationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReservationParticipant extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'reservation_id',
        'user_id',
        'guest_name',
        'guest_email',
        'invitation_status',
        'invitation_sent_at',
        'response_at',
        'added_at',
    ];

    protected function casts(): array
    {
        return [
            'invitation_status' => InvitationStatus::class,
            'invitation_sent_at' => 'datetime',
            'response_at' => 'datetime',
            'added_at' => 'datetime',
        ];
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
