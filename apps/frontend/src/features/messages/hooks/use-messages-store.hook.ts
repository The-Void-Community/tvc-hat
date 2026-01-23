import type {
  FrontendMessage,
  FrontendMessageProperties,
  MaybeFrontendMessage,
} from "@/types";

import { useCallback } from "react";
import { useStore } from "@/hooks/use-store.hook";

export const useMessagesStore = () => {
  const {
    entities,
    order,
    store,
    clear,
    append,
    prependMany,
    update,
    replaceId,
    remove,
    getById,
    getAll,
  } = useStore<MaybeFrontendMessage>();

  const addMessages = useCallback(
    (messages: MaybeFrontendMessage[], to: "start" | "end" = "end") => {
      if (to === "end") {
        return messages.forEach((msg) => append(msg));
      }

      prependMany(messages);
    },
    [append, prependMany],
  );

  const updateOneMessage = useCallback(
    (message: MaybeFrontendMessage) => {
      update(message.id, message);
    },
    [update],
  );

  const setOneMessage = useCallback(
    (message: MaybeFrontendMessage, options?: FrontendMessageProperties) => {
      const patch = options ? { ...message, ...options } : message;
      update(patch.id, patch);
    },
    [update],
  );

  const markMessageAsFailed = useCallback(
    (message: MaybeFrontendMessage) => {
      setOneMessage(message, { failed: true, pending: false });
    },
    [setOneMessage],
  );

  const replaceMessageId = useCallback(
    (id: string, message: FrontendMessage) => {
      replaceId(id, message);
    },
    [replaceId],
  );

  return {
    entities: entities,
    order,
    store,
    addMessages,
    updateOneMessage,
    setOneMessage,
    markMessageAsFailed,
    replaceMessageId,
    getById,
    getAll,
    remove,
    clear,
  };
};
