import type { FilteredChats } from "@/hooks/use-filtered-chats.hook";
import type { Chat } from "@/types";
import type { Store } from "../hooks/use-normalized-store.hook";

import { createContext } from "@/utils/create-context.utils";

type ChatContextType = {
  currentChat: Chat | null;
  chats: Store<Chat>;
  filteredChats: FilteredChats;

  setCurrentChat: (chat: Chat) => void;
  onChangeChat: (chat: Chat) => void;
};

export const [ChatContext, useChat] = createContext<ChatContextType>();
