import type { MessagesMap } from "@/types";
import type { RefObject, UIEvent } from "react";

import { createContext } from "@/utils/create-context.utils"

type MessagesContextType = {
  messages: MessagesMap;
  pendingMessages: RefObject<Map<string, boolean>>;

  messagesRef: RefObject<HTMLDivElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;

  onTextareaSubmit: (text: string) => void;
  onMessagesScroll: (event: UIEvent<HTMLDivElement>) => void;

  sendMessages: (text: string, chatId: string) => void;
  retrySendMessage: (id: string) => void;

  loadOldMessages: () => Promise<boolean>;

  oldMessagesAvailble: boolean;
  oldMessagesLoading: boolean;
}

export const [ MessagesContext, useMessages ] = createContext<MessagesContextType>();