import type { RefObject, UIEvent } from "react";
import { createContext } from "@/utils/create-context.utils";
import { useMessagesStore } from "./hooks/use-messages-store.hook";
import { LoadMessagesParameters } from "./hooks/use-messages-loader.hook";

export type MessagesContextType = {
  store: ReturnType<typeof useMessagesStore>;

  messagesRef: RefObject<HTMLDivElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;

  pendingMessages: RefObject<Map<string, boolean>>;

  sendMessage: (text: string, chatId: string) => void;
  retrySendMessage: (id: string) => void;
  loadMessages: (parameters: LoadMessagesParameters) => Promise<void>;

  onMessagesScroll: (event: UIEvent<HTMLDivElement>) => void;
  onTextareaSubmit: (text: string) => void;

  messagesLoading: boolean;
  toggleMessagesLoading: (state?: boolean) => void;
  autoScrollEnabled: RefObject<boolean>;

  oldMessagesAvailable: boolean;
  toggleOldMessagesAvailable: (state?: boolean) => void;
  oldMessagesLoading: boolean;
  toggleOldMessagesLoading: (state?: boolean) => void;
};

export const [MessagesContext, useMessages] =
  createContext<MessagesContextType>("MessagesContext");
