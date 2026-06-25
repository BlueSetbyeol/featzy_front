import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountApi } from "@/api/accountApi";
import { queryKeys } from "@/lib/queryKeys";
import type {
  AuthUser,
  ChangePasswordPayload,
  NotificationPreferences,
  UpdateProfilePayload,
} from "@/types/authTypes";

/** Met à jour le cache de l'utilisateur courant après une mutation de compte */
function useSetMe() {
  const queryClient = useQueryClient();
  return (user: AuthUser) =>
    queryClient.setQueryData<AuthUser | null>(queryKeys.auth.me(), user);
}

export function useUpdateProfile() {
  const setMe = useSetMe();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      accountApi.updateProfile(payload),
    onSuccess: setMe,
  });
}

export function useUploadAvatar() {
  const setMe = useSetMe();
  return useMutation({
    mutationFn: (file: File) => accountApi.uploadAvatar(file),
    onSuccess: setMe,
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => accountApi.deleteAvatar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}

export function useUpdateDietaryPreferences() {
  const setMe = useSetMe();
  return useMutation({
    mutationFn: (dietaryPreferences: string[]) =>
      accountApi.updateDietaryPreferences(dietaryPreferences),
    onSuccess: setMe,
  });
}

export function useUpdateNotificationPreferences() {
  const setMe = useSetMe();
  return useMutation({
    mutationFn: (preferences: Partial<NotificationPreferences>) =>
      accountApi.updateNotificationPreferences(preferences),
    onSuccess: setMe,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      accountApi.changePassword(payload),
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (password: string) => accountApi.deleteAccount(password),
    onSuccess: () => {
      queryClient.setQueryData<AuthUser | null>(queryKeys.auth.me(), null);
      queryClient.clear();
    },
  });
}
