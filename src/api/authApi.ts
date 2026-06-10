import api, { initCsrf } from "@/lib/axios";
import type {
  AuthResponse,
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  Session,
  VerifyEmailPayload,
} from "@/types/authTypes";

export const authApi = {
  // ─── Auth ───────────────────────────────────────────────────────────────────

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    await initCsrf();
    const { data } = await api.post<{ data: AuthResponse }>(
      "/auth/login",
      payload,
    );
    return data.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    await initCsrf();
    const { data } = await api.post<{ data: AuthResponse }>(
      "/auth/register",
      payload,
    );
    return data.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await api.get<{ data: AuthUser }>("/auth/me");
    return data.data;
  },

  // ─── Email verification ──────────────────────────────────────────────────────

  verifyEmail: async (payload: VerifyEmailPayload): Promise<void> => {
    await api.post("/auth/email/verify", payload);
  },

  // ─── Password reset ──────────────────────────────────────────────────────────

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<void> => {
    await initCsrf();
    await api.post("/auth/password/forgot", payload);
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
    await initCsrf();
    await api.post("/auth/password/reset", payload);
  },

  // ─── Sessions ────────────────────────────────────────────────────────────────

  getSessions: async (): Promise<Session[]> => {
    const { data } = await api.get<{ data: Session[] }>("/auth/sessions");
    return data.data;
  },

  revokeSession: async (id: string): Promise<void> => {
    await api.delete(`/auth/sessions/${id}`);
  },

  revokeAllSessions: async (): Promise<void> => {
    await api.delete("/auth/sessions");
  },
};
