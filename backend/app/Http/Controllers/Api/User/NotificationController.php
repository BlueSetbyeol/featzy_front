<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Exceptions\NotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->orderByRaw('read_at IS NOT NULL, created_at DESC')
            ->paginate(20);

        return $this->success($notifications);
    }

    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->find($id);

        if (! $notification) {
            throw new NotFoundException('Notification');
        }

        $notification->markAsRead();

        return $this->success(null, 'Notification marquée comme lue.');
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return $this->success(null, 'Toutes les notifications marquées comme lues.');
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->find($id);

        if (! $notification) {
            throw new NotFoundException('Notification');
        }

        $notification->delete();

        return $this->noContent();
    }
}
