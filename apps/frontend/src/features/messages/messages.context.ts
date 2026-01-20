import type { RefObject, UIEvent } from "react";
import { createContext } from "@/utils/create-context.utils";
import { useMessagesStore } from "./hooks/use-messages-store.hook";

type MessagesContextType = {
  store: ReturnType<typeof useMessagesStore>;

  messagesRef: RefObject<HTMLDivElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;

  pendingMessages: RefObject<Map<string, boolean>>;

  sendMessage: (text: string, chatId: string) => void;
  retrySendMessage: (id: string) => void;
  loadOlderMessages: () => Promise<boolean>;

  onMessagesScroll: (event: UIEvent<HTMLDivElement>) => void;
  onTextareaSubmit: (text: string) => void;

  messagesLoading: boolean;
  toggleMessagesAvailable: (state?: boolean) => void;
  autoScrollEnabled: boolean;

  oldMessagesAvailable: boolean;
  toggleOldMessagesAvailable: (state?: boolean) => void;
  oldMessagesLoading: boolean;
  toggleOldMessagesLoading: (state?: boolean) => void;
};

export const [MessagesContext, useMessages] =
  createContext<MessagesContextType>();
