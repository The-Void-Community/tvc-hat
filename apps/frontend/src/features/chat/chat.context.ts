import type { FilteredChats } from "@/features/chat/hooks/use-filtered-chats.hook";
import type { Store } from "@/hooks/use-store.hook";
import type { Chat } from "@/types";

import { createContext } from "@/utils/create-context.utils";

export type ChatContextType = {
  store: Store<Chat>;

  currentChat: Chat | null;
  filteredChats: FilteredChats;

  setCurrentChat: (chat: Chat) => void;
  onChangeChat: (chat: Chat) => void;

  sidebarShowed: boolean;
  toggleSidebar: (state: boolean) => unknown;

  createModalShowed: boolean;
  toggleCreateModal: (state: boolean) => unknown;
};

export const [ChatContext, useChat] = createContext<ChatContextType>("ChatContext");
