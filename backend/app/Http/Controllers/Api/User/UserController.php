<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\Address;
use App\Repositories\UserRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Exceptions\UnprocessableException;

class UserController extends Controller
{
    public function __construct(private readonly UserRepository $users) {}

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        // Password change
        if (isset($data['new_password'])) {
            if (! Hash::check($data['current_password'], $user->password)) {
                throw new UnprocessableException('Mot de passe actuel incorrect.');
            }
            $data['password'] = $data['new_password'];
        }

        // Address upsert
        if (isset($data['address'])) {
            $addressData = $data['address'];
            if ($user->address_id) {
                $user->address->update($addressData);
            } else {
                $address = Address::create($addressData);
                $data['address_id'] = $address->id;
            }
        }

        unset($data['current_password'], $data['new_password'], $data['new_password_confirmation'], $data['address']);

        $this->users->update($user, $data);

        return $this->success(
            UserResource::make($user->fresh()->load('address', 'roles')),
            'Profil mis à jour.'
        );
    }

    public function deleteAccount(Request $request): JsonResponse
    {
        $user = $request->user();

        // RGPD anonymisation
        $this->users->update($user, [
            'email'      => 'deleted_' . $user->id . '@deleted.local',
            'firstname'  => 'Deleted',
            'lastname'   => 'User',
            'phone_number' => null,
            'profile_picture_url' => null,
            'is_active'  => false,
        ]);

        $user->tokens()->delete();

        $request->session()->invalidate();

        return $this->noContent();
    }
}
