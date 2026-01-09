import type { Message, User } from "@/types";
import type { RefObject } from "react"

import { createContext, useContext } from "react"

type ChatContextType = {
  messages: Map<string, Message>;
  users: Map<string, User>;
  me: User;

  messagesRef: RefObject<HTMLDivElement | null>;
  pendingMessages: RefObject<Map<string, number>>;

  autoScrollEnabled: boolean;
}

export const ChatContext = createContext<ChatContextType | null>(null);
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }

  return context;
}