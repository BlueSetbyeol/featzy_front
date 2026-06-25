import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { queryKeys } from "@/lib/queryKeys";
import type {
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "@/types/authTypes";

/**
 * Utilisateur authentifié courant (bootstrap de session Sanctum).
 *
 * `me()` renvoie un 401 silencieux (skipAuthRedirect) si aucune session :
 * la query passe alors en erreur et on considère l'utilisateur déconnecté.
 */
export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authApi.me,
    retry: false,
    staleTime: 5 * 60_000,
    meta: { silent: true },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (user) => {
      queryClient.setQueryData<AuthUser | null>(queryKeys.auth.me(), user);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData<AuthUser | null>(queryKeys.auth.me(), null);
      // Purge l'ensemble du cache utilisateur (favoris, réservations, commandes…)
      queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authApi.forgotPassword(payload),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authApi.resetPassword(payload),
  });
}

export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendVerificationEmail(email),
  });
}
