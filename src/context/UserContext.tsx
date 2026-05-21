import type { AuthUser } from "@/types/authTypes";
import { createContext, useState } from "react";

const UserContext = createContext<LoginProps>({ setUser: () => {} });

interface UserProps {
  user: AuthUser;
  token: string;
}

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<UserProps | undefined>>;
  user?: UserProps;
}

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProps>();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
