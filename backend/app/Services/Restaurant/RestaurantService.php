<?php

namespace App\Services\Restaurant;

use App\DTOs\Restaurant\AddressDTO;
use App\DTOs\Restaurant\OpeningHoursDTO;
use App\DTOs\Restaurant\RestaurantDTO;
use App\DTOs\Restaurant\RestaurantSearchDTO;
use App\Models\Address;
use App\Models\Restaurant;
use App\Models\User;
use App\Repositories\OpeningHoursRepository;
use App\Repositories\RestaurantRepository;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class RestaurantService
{
    public function __construct(
        private readonly RestaurantRepository $restaurants,
        private readonly OpeningHoursRepository $openingHours,
    ) {}

    public function create(RestaurantDTO $dto, AddressDTO $addressDto, User $owner): Restaurant
    {
        return DB::transaction(function () use ($dto, $addressDto, $owner) {
            $address = Address::create([
                'street'          => $addressDto->street,
                'zipcode'         => $addressDto->zipcode,
                'city'            => $addressDto->city,
                'country'         => $addressDto->country,
                'latitude'        => $addressDto->latitude,
                'longitude'       => $addressDto->longitude,
                'additional_info' => $addressDto->additional_info,
            ]);

            $restaurant = $this->restaurants->create([
                'owner_id'        => $owner->id,
                'name'            => $dto->name,
                'email'           => $dto->email,
                'phone_number'    => $dto->phone_number,
                'description'     => $dto->description,
                'price_range'     => $dto->price_range->value,
                'capacity'        => $dto->capacity,
                'allow_pre_order' => $dto->allow_pre_order,
                'cuisine_type'    => $dto->cuisine_type,
                'logo_url'        => $dto->logo_url,
                'cover_image_url' => $dto->cover_image_url,
                'address_id'      => $address->id,
            ]);

            if (! $owner->hasRole('restaurant-owner')) {
                $owner->assignRole('restaurant-owner');
            }

            return $restaurant->load('address');
        });
    }

    public function update(Restaurant $restaurant, RestaurantDTO $dto, ?AddressDTO $addressDto): Restaurant
    {
        return DB::transaction(function () use ($restaurant, $dto, $addressDto) {
            $this->restaurants->update($restaurant, [
                'name'            => $dto->name,
                'email'           => $dto->email,
                'phone_number'    => $dto->phone_number,
                'description'     => $dto->description,
                'price_range'     => $dto->price_range->value,
                'capacity'        => $dto->capacity,
                'allow_pre_order' => $dto->allow_pre_order,
                'cuisine_type'    => $dto->cuisine_type,
                'logo_url'        => $dto->logo_url,
                'cover_image_url' => $dto->cover_image_url,
            ]);

            if ($addressDto) {
                $restaurant->address->update([
                    'street'          => $addressDto->street,
                    'zipcode'         => $addressDto->zipcode,
                    'city'            => $addressDto->city,
                    'country'         => $addressDto->country,
                    'latitude'        => $addressDto->latitude,
                    'longitude'       => $addressDto->longitude,
                    'additional_info' => $addressDto->additional_info,
                ]);
            }

            return $restaurant->fresh()->load('address');
        });
    }

    public function delete(Restaurant $restaurant): void
    {
        $this->restaurants->delete($restaurant);
    }

    public function search(RestaurantSearchDTO $dto): LengthAwarePaginator
    {
        return $this->restaurants->searchWithFilters($dto);
    }

    public function getAvailableCapacity(Restaurant $restaurant, Carbon $datetime): int
    {
        return $this->restaurants->countAvailableSeatsForSlot($restaurant->id, $datetime);
    }

    public function updateOpeningHours(Restaurant $restaurant, array $openingHoursDTOs): void
    {
        $this->openingHours->upsertForRestaurant($restaurant->id, $openingHoursDTOs);
    }
}
