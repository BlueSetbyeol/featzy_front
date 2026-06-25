<?php

namespace App\Models;

use App\Enums\BillSplitType;
use App\Enums\ReservationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'organizer_id',
        'restaurant_id',
        'reservation_datetime',
        'number_of_guests',
        'status',
        'table_number',
        'special_requests',
        'cancellation_reason',
        'cancelled_at',
        'confirmed_at',
        'bill_split_type',
    ];

    protected function casts(): array
    {
        return [
            'reservation_datetime' => 'datetime',
            'number_of_guests' => 'integer',
            'status' => ReservationStatus::class,
            'bill_split_type' => BillSplitType::class,
            'cancelled_at' => 'datetime',
            'confirmed_at' => 'datetime',
        ];
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function participants(): HasMany
    {
        return $this->hasMany(ReservationParticipant::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
