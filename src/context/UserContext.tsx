import type { User } from "@/types/userTypes";
import { createContext, useState } from "react";

const UserContext = createContext<UserProps>({ setUser: () => {} });

interface UserProps {
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  user?: User;
}

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | undefined>();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
