import type { Message } from "@/types";

import { useCallback, useRef, useEffect } from "react";
import { useMessageLoader } from "./use-message-loader.hook";

export type UseMessagePaginationProps = {
  chatId: string;
  addMessages: (messages: Message[], to: "start" | "end") => void;
  toggleMessagesLoading: (loading: boolean) => void;
  oldestMessageId?: string;
  hasMore?: boolean;
};

export const useMessagePagination = ({
  chatId,
  addMessages,
  toggleMessagesLoading,
  oldestMessageId: initialOldestMessageId,
  hasMore: initialHasMore,
}: UseMessagePaginationProps) => {
  const { loadMessages } = useMessageLoader();
  const loaded = useRef(false);
  const oldestMessageIdRef = useRef<string | undefined>(initialOldestMessageId);
  const hasMoreRef = useRef<boolean>(initialHasMore ?? false);

  useEffect(() => {
    if (initialOldestMessageId !== undefined) {
      oldestMessageIdRef.current = initialOldestMessageId;
    }
  }, [initialOldestMessageId]);

  useEffect(() => {
    if (initialHasMore !== undefined) {
      hasMoreRef.current = initialHasMore;
    }
  }, [initialHasMore]);

  const loadOlderMessages = useCallback(async () => {
    const currentOldestId = initialOldestMessageId ?? oldestMessageIdRef.current;
    const currentHasMore = initialHasMore ?? hasMoreRef.current;

    if (!currentOldestId || !currentHasMore || loaded.current || !chatId) {
      return false;
    }

    loaded.current = true;
    toggleMessagesLoading(true);

    try {
      const result = await loadMessages({
        chatId,
        positionMessageId: currentOldestId,
        count: 100,
      });

      if (result.messages.length > 0) {
        addMessages(result.messages, "start");
        oldestMessageIdRef.current = result.oldestMessageId;
        hasMoreRef.current = result.hasMore;
        return true;
      } else {
        hasMoreRef.current = false;
        return false;
      }
    } finally {
      loaded.current = false;
      toggleMessagesLoading(false);
    }
  }, [
    chatId,
    loadMessages,
    addMessages,
    toggleMessagesLoading,
    initialOldestMessageId,
    initialHasMore,
  ]);

  return {
    loadOlderMessages,
    hasMore: initialHasMore ?? hasMoreRef.current,
    loading: loaded.current,
  };
};
