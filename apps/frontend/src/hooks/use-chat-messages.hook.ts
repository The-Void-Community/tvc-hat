import type { Chat, Message, MessagesMap } from "@/types";

import { useCallback, useState } from "react";
import { useMessageLoader } from "./use-message-loader.hook";

export type UseChatMessagesProps = {
  setMessages: (messages: MessagesMap) => void;
  toggleScrollToBottom: (enabled: boolean) => void;
  toggleMessagesLoading: (loading: boolean) => void;
};

export const useChatMessages = ({
  setMessages,
  toggleScrollToBottom,
  toggleMessagesLoading,
}: UseChatMessagesProps) => {
  const { loadInitialMessages } = useMessageLoader();
  const [oldestMessageId, setOldestMessageId] = useState<string | undefined>(
    undefined,
  );
  const [hasMore, setHasMore] = useState<boolean>(false);

  const loadStartMessages = useCallback(
    async (chatId: string) => {
      setMessages(new Map());
      toggleMessagesLoading(true);

      const result = await loadInitialMessages({ chatId });
      if (result.messages.length > 0) {
        setMessages(
          new Map(result.messages.map((m) => [m.id, m] as [string, Message])),
        );
        setOldestMessageId(result.oldestMessageId);
        setHasMore(result.hasMore);
      } else {
        setMessages(new Map());
        setOldestMessageId(undefined);
        setHasMore(false);
      }

      toggleMessagesLoading(false);
      toggleScrollToBottom(true);
    },
    [setMessages, toggleMessagesLoading, loadInitialMessages, toggleScrollToBottom],
  );

  const handleChatChange = useCallback((chat: Chat) => {
    setOldestMessageId(undefined);
    setHasMore(false);
    loadStartMessages(chat.id);
  }, [loadStartMessages]);

  return {
    loadStartMessages,
    oldestMessageId,
    hasMore,
    handleChatChange
  };
};
