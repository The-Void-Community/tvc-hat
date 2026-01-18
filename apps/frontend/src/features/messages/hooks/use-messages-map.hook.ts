import type {
  FrontendMessageProperties,
  MaybeFrontendMessage,
  Message,
} from "@/types";

import { useMap } from "@/hooks/use-map.hook";

export const useMessagesMap = () => {
  const { map: messages, addMany, setMap } = useMap<Message>();

  const addMessages = (messages: Message[], to: "start" | "end" = "end") => {
    return addMany(messages, "id", to);
  }

  const updateOne = (message: MaybeFrontendMessage) => {
    return setMap((previous) => {
      const map = new Map(previous);
      return map.set(message.id, message);
    });
  }

  const setOne = (message: MaybeFrontendMessage, options?: FrontendMessageProperties) => {
    return updateOne({
      ...message,
      ...(options || {}),
    });
  };

  const markAsFailed = (message: MaybeFrontendMessage) => {
    return setOne(message, { failed: true, pending: true });
  }

  return {
    messages,
    addMessages,
    setMessages: setMap,
    updateOneMessage: updateOne,
    setOneMessage: setOne,
    markMessageAsFailed: markAsFailed,
  };
};
