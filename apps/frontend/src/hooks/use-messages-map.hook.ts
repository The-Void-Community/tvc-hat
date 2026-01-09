import type { FrontendMessageProperties, MaybeFrontendMessage, Message, MessagesMap } from "@/types";
import { useCallback, useState } from "react";

export const useMessagesMap = () => {
  const [messages, setMessages] = useState<MessagesMap>(new Map());

  const addMessages = useCallback((messages: Message [], to: "start" | "end" = "end") => {
    return setMessages((previous) => {
      const newMessages = messages.map((message) => [message.id, message] as [string, Message]);
      const oldMessages = Array.from(previous.entries());

      if (to === "start") {
        return new Map([
          ...newMessages,
          ...oldMessages,
        ])
      };

      return new Map([
        ...oldMessages,
        ...newMessages,
      ]);
    });
  }, []);

  const updateOne = useCallback((id: string, message: MaybeFrontendMessage) => {
    return setMessages((previous) => {
      const map = new Map(previous);
      return map.set(id, message);
    })
  }, []);

  const setOne = useCallback((message: MaybeFrontendMessage, options?: FrontendMessageProperties) => {
    return updateOne(message.id, {
      ...message,
      ...options || {}
    });
  }, [updateOne]);

  const markAsFailed = useCallback((message: MaybeFrontendMessage) => {
    return setOne(message, { failed: true, pending: true });
  }, [setOne]);

  return {
    messages,
    addMessages,
    updateOneMessage: updateOne,
    setOneMessage: setOne,
    markMessageAsFailed: markAsFailed
  }
}