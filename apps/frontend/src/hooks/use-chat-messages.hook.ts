import type { Chat, Message, MessagesMap } from "@/types";

import { useCallback, useEffect, useState } from "react";
import { useMessageLoader } from "./use-message-loader.hook";

export type UseChatMessagesProps = {
  currentChat: Chat | null;
  setMessages: (messages: MessagesMap) => void;
  toggleScrollToBottom: (enabled: boolean) => void;
  toggleMessagesLoading: (loading: boolean) => void;
};

export const useChatMessages = ({
  currentChat,
  setMessages,
  toggleScrollToBottom,
  toggleMessagesLoading,
}: UseChatMessagesProps) => {
  const { loadInitialMessages } = useMessageLoader();
  const [oldestMessageId, setOldestMessageId] = useState<string | undefined>(
    undefined,
  );
  const [hasMore, setHasMore] = useState<boolean>(false);

  const loadMessages = useCallback(
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
    [
      setMessages,
      toggleScrollToBottom,
      toggleMessagesLoading,
      loadInitialMessages,
    ],
  );

  useEffect(() => {
    if (!currentChat) {
      return;
    }

    (() => {
      setOldestMessageId(undefined);
      setHasMore(false);
      loadMessages(currentChat.id);
    })();
  }, [currentChat, loadMessages]);

  return {
    loadMessages,
    oldestMessageId,
    hasMore,
  };
};
