import api from "@/lib/axios";
import type {
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ResetPasswordPayload,
} from "@/types/authTypes";

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthUser> => {
    const response = await api.post<LoginResponse>("/login", payload);
    const { token, data: user } = response.data;
    localStorage.setItem("auth_token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return user;
  },

  /** Crée le compte mais ne connecte pas l'utilisateur (le back n'ouvre pas de session) */
  register: async (payload: RegisterPayload): Promise<AuthUser> => {
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
    await api.post("/forgot-password", payload);
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
    await api.post("/reset-password", payload);
  },

  resendVerificationEmail: async (email: string): Promise<void> => {
    await api.post("/email/verification-notification", { email });
  },
};
