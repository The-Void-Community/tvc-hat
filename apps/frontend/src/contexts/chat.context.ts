import type { FilteredChats } from "@/hooks/use-filtered-chats.hook";
import type { Chat, Message, User } from "@/types";

import type { RefObject, UIEvent } from "react";
import { createContext, useContext } from "react";

type ChatContextType = {
  messages: Map<string, Message>;
  users: Map<string, User>;
  me: User;
  currentChat: Chat | null;

  messagesRef: RefObject<HTMLDivElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  pendingMessages: RefObject<Map<string, boolean>>;
  messagesLoading: RefObject<boolean>;
  autoScrollEnabled: RefObject<boolean>;

  createModalShowed: boolean;
  toggleCreateModal: (state: boolean) => unknown;

  sidebarShowed: boolean;
  toggleSidebar: (state: boolean) => unknown;

  filteredChats: FilteredChats;

  setCurrentChat: (chat: Chat) => unknown;
  onChangeChat: (chat: Chat | null) => unknown;

  retrySendMessage: (id: string) => unknown;
  sendMessage: (text: string, chatId: string) => unknown;
  onSubmit: (text: string) => unknown;
  onScroll: (event: UIEvent<HTMLDivElement>) => unknown;
  loadOlderMessages?: () => Promise<boolean>;
  hasMoreMessages?: boolean;
  loadingOlderMessages?: boolean;
};

export const ChatContext = createContext<ChatContextType | null>(null);
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }

  return context;
};
