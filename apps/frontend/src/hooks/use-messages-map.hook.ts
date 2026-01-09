import type { FrontendMessageProperties, MaybeFrontendMessage, Message } from "@/types";
import { useCallback } from "react";
import { useMap } from "./use-map.hook";

export const useMessagesMap = () => {
  const {
    map: messages,
    addMany,
    setMap
  } = useMap<Message>();

  const addMessages = useCallback((messages: Message [], to: "start" | "end" = "end") => {
    return addMany(messages, "id", to);
  }, [addMany]);

  const updateOne = useCallback((id: string, message: MaybeFrontendMessage) => {
    return setMap((previous) => {
      const map = new Map(previous);
      return map.set(id, message);
    })
  }, [setMap]);

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
    setMessages: setMap,
    updateOneMessage: updateOne,
    setOneMessage: setOne,
    markMessageAsFailed: markAsFailed
  }
}