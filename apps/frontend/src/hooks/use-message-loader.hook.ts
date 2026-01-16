import type { Message } from "@/types";

import { getMessages } from "@/api/get-messages";
import { useCallback } from "react";

export type LoadMessagesOptions = {
  chatId: string;
  positionMessageId?: string;
  count?: number;
};

export type LoadMessagesResult = {
  messages: Message[];
  hasMore: boolean;
  oldestMessageId?: string;
};

export const useMessageLoader = () => {
  const loadMessages = useCallback(
    async ({
      chatId,
      positionMessageId,
      count = 100,
    }: LoadMessagesOptions): Promise<LoadMessagesResult> => {
      const fetchedMessages = await getMessages({
        chatId,
        positionMessageId,
        count,
        sort: "desc",
      });

      if (!fetchedMessages || fetchedMessages.length === 0) {
        return {
          messages: [],
          hasMore: false,
        };
      }

      const normalizedMessages = fetchedMessages.reverse();
      const oldestMessage = normalizedMessages[0];
      const hasMore = fetchedMessages.length === count;

      return {
        messages: normalizedMessages,
        hasMore,
        oldestMessageId: oldestMessage?.id,
      };
    },
    [],
  );

  const loadInitialMessages = useCallback(
    async ({
      chatId,
      count = 100,
    }: Omit<
      LoadMessagesOptions,
      "positionMessageId"
    >): Promise<LoadMessagesResult> => {
      return loadMessages({ chatId, count });
    },
    [loadMessages],
  );

  return {
    loadMessages,
    loadInitialMessages,
  };
};
