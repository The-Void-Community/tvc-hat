import { useRef } from "react";
import { useMessagesStore } from "./use-messages-store.hook";

export const useMessagesState = () => {
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const store = useMessagesStore();

  return {
    messagesRef,
    textareaRef,
    store,
  };
};
