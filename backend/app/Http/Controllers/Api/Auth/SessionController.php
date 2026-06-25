<?php

namespace App\Http\Controllers\Api\Auth;

use App\Exceptions\ForbiddenException;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SessionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $sessions = DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('last_activity')
            ->get()
            ->map(fn ($s) => [
                'id'            => $s->id,
                'ip_address'    => $s->ip_address,
                'user_agent'    => $s->user_agent,
                'last_activity' => $s->last_activity,
                'is_current'    => $s->id === $request->session()->getId(),
            ]);

        return $this->success($sessions);
    }

    public function revoke(Request $request, string $id): JsonResponse
    {
        $session = DB::table('sessions')
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $session) {
            throw new ForbiddenException('Session introuvable.');
        }

        if ($session->id === $request->session()->getId()) {
            throw new ForbiddenException('Impossible de révoquer la session courante.');
        }

        DB::table('sessions')->where('id', $id)->delete();

        return $this->noContent();
    }

    public function revokeAll(Request $request): JsonResponse
    {
        $currentId = $request->session()->getId();

        DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->where('id', '!=', $currentId)
            ->delete();

        return $this->noContent();
    }
}
