export type NotificationPreferences = {
  email: boolean;
  push: boolean;
  important_updates: boolean;
  promotions: boolean;
};

export type LoginResponse = {
  token: string;
  data: AuthUser;
};

export type AuthUser = {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  dietary_preferences: string[];
  notification_preferences: NotificationPreferences;
  email_verified_at: string | null;
  roles?: string[];
  created_at: string;
  updated_at: string;
};

export type LoginPayload = {
  email: string;
  password: string;
  remember?: boolean;
};

export type RegisterPayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  password: string;
  password_confirmation: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type UpdateProfilePayload = {
  first_name?: string;
  last_name?: string;
  phone?: string | null;
};

export type ChangePasswordPayload = {
  current_password: string;
  password: string;
  password_confirmation: string;
};
