import { User } from "@/types";
import { createContext } from "@/utils/create-context.utils";
import { Store } from "../hooks/use-normalized-store.hook";

export type UsersContextType = {
  me: User;
  users: Store<User>;

  addUser: (user: User) => void;
  setMe: (user: User) => void;
};

export const [UsersContext, useUsers] = createContext<UsersContextType>();
