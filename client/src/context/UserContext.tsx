import { useQueryClient } from "@tanstack/react-query";
import { useLogout, useMe } from "@/hooks/useAuth";
import { queryKeys } from "@/lib/queryKeys";
import type { AuthUser } from "@/types/authTypes";
import { createContext, useCallback } from "react";

type UserContextValue = {
  user: AuthUser | null;
  /** true tant que la session Sanctum n'a pas été vérifiée au montage */
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
});

/**
 * Adapte la query `useMe` (source de vérité dans le cache TanStack Query) à
 * l'API historique du contexte, afin que les composants existants continuent
 * de lire `user`/`loading` et d'appeler `setUser`/`logout` sans changement.
 */
export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useMe();
  const logoutMutation = useLogout();

  const setUser = useCallback(
    (user: AuthUser | null) => {
      queryClient.setQueryData<AuthUser | null>(queryKeys.auth.me(), user);
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      queryClient.setQueryData<AuthUser | null>(queryKeys.auth.me(), null);
    }
  }, [logoutMutation, queryClient]);

  return (
    <UserContext.Provider
      value={{ user: data ?? null, loading: isLoading, setUser, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
