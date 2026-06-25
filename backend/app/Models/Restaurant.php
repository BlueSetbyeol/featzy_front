<?php

namespace App\Models;

use App\Enums\PriceRange;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Restaurant extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'name',
        'email',
        'phone_number',
        'description',
        'address_id',
        'logo_url',
        'cover_image_url',
        'cuisine_type',
        'price_range',
        'capacity',
        'average_rating',
        'total_reviews',
        'is_active',
        'allow_pre_order',
    ];

    protected function casts(): array
    {
        return [
            'price_range' => PriceRange::class,
            'capacity' => 'integer',
            'average_rating' => 'decimal:2',
            'total_reviews' => 'integer',
            'is_active' => 'boolean',
            'allow_pre_order' => 'boolean',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    public function openingHours(): HasMany
    {
        return $this->hasMany(RestaurantOpeningHours::class);
    }

    public function menus(): HasMany
    {
        return $this->hasMany(Menu::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }
}
