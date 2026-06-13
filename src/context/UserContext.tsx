import { authApi } from "@/api/authApi";
import type { AuthUser } from "@/types/authTypes";
import { createContext, useCallback, useEffect, useState } from "react";

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

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
