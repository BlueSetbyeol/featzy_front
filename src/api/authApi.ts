import api, { initCsrf } from "@/lib/axios";
import type {
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "@/types/authTypes";

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthUser> => {
    await initCsrf();
    const { data } = await api.post<{ data: AuthUser }>("/login", payload);
    return data.data;
  },

  /** Crée le compte mais ne connecte pas l'utilisateur (le back n'ouvre pas de session) */
  register: async (payload: RegisterPayload): Promise<AuthUser> => {
    await initCsrf();
    const { data } = await api.post<{ data: AuthUser }>("/register", payload);
    return data.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/logout");
  },

  /** Utilisateur courant — 401 silencieux si pas de session (bootstrap) */
  me: async (): Promise<AuthUser> => {
    const { data } = await api.get<{ data: AuthUser }>("/user", {
      skipAuthRedirect: true,
    });
    return data.data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<void> => {
    await initCsrf();
    await api.post("/forgot-password", payload);
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
    await initCsrf();
    await api.post("/reset-password", payload);
  },

  resendVerificationEmail: async (email: string): Promise<void> => {
    await api.post("/email/verification-notification", { email });
  },
};
