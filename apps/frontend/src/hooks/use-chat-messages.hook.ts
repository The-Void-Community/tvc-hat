import type { Chat, Message } from "@/types";
import { getMessages } from "@/api/get-messages";
import { useCallback, useEffect } from "react";
import { useToggleRef } from "./use-toggle.hook";
import type { MessagesMap } from "@/types";

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
  const loadMessages = useCallback(
    async (chatId: string) => {
      setMessages(new Map());
      toggleScrollToBottom(true);
      toggleMessagesLoading(true);

      const fetchedMessages = await getMessages({
        chatId,
        sort: "desc",
      });

      if (fetchedMessages && fetchedMessages.length > 0) {
        const reversedMessages = fetchedMessages.reverse();
        setMessages(
          new Map(reversedMessages.map((m) => [m.id, m] as [string, Message])),
        );
      } else {
        setMessages(new Map());
      }

      toggleMessagesLoading(false);
    },
    [setMessages, toggleScrollToBottom, toggleMessagesLoading],
  );

  useEffect(() => {
    if (!currentChat) {
      return;
    }

    void loadMessages(currentChat.id);
  }, [currentChat, loadMessages]);

  return {
    loadMessages,
  };
};
