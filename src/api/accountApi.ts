import api, { initCsrf } from "@/lib/axios";
import type {
  AuthUser,
  ChangePasswordPayload,
  NotificationPreferences,
  UpdateProfilePayload,
} from "@/types/authTypes";

export const accountApi = {
  /** first_name / last_name / phone uniquement — l'email n'est pas modifiable */
  updateProfile: async (payload: UpdateProfilePayload): Promise<AuthUser> => {
    const { data } = await api.patch<{ data: AuthUser }>("/me", payload);
    return data.data;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    await initCsrf();
    await api.put("/me/password", payload);
  },

  deleteAccount: async (password: string): Promise<void> => {
    await initCsrf();
    await api.delete("/me", { data: { password } });
  },

  uploadAvatar: async (file: File): Promise<AuthUser> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post<{ data: AuthUser }>("/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  deleteAvatar: async (): Promise<void> => {
    await api.delete("/me/avatar");
  },

  updateDietaryPreferences: async (
    dietaryPreferences: string[],
  ): Promise<AuthUser> => {
    const { data } = await api.put<{ data: AuthUser }>(
      "/me/dietary-preferences",
      { dietary_preferences: dietaryPreferences },
    );
    return data.data;
  },

  updateNotificationPreferences: async (
    preferences: Partial<NotificationPreferences>,
  ): Promise<AuthUser> => {
    const { data } = await api.put<{ data: AuthUser }>(
      "/me/notification-preferences",
      preferences,
    );
    return data.data;
  },
};
