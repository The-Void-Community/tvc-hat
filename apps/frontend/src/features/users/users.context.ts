import { User } from "@/types";
import { createContext } from "@/utils/create-context.utils";

type UsersContextType = {
  me: User;
  users: Map<string, User>;

  addUser: (key: string, user: User) => void;
  setMe: (user: User) => void;
};

export const [UsersContext, useUsers] = createContext<UsersContextType>();
