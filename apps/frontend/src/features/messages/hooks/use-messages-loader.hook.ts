import type { Chat, Message } from "@/types";

import { useCallback, useState } from "react";
import { loadMessages } from "@/features/messages/load-messages";

import { useToggleState } from "@/hooks/use-toggle.hook";

export type UseChatMessagesProps = {
  addMessages: (messages: Message[], to?: "start" | "end") => void;
  toggleScrollToBottom: (enabled: boolean) => void;
  toggleMessagesLoading: (loading: boolean) => void;
};

export type LoadMessagesParameters = {
  chatId: string;
  to?: "start" | "end";
  enableScroll?: boolean;
};

export const useMessagesLoader = ({
  addMessages,
  toggleMessagesLoading,
  toggleScrollToBottom,
}: UseChatMessagesProps) => {
  const [moreMessagesAvailable, toggleMoreMessagesAvailable] =
    useToggleState(false);
  const [oldMessageId, setOldMessageId] = useState<string | null>(null);

  const load = useCallback(
    async ({
      chatId,
      enableScroll = false,
      to = "end",
    }: LoadMessagesParameters) => {
      toggleMessagesLoading(true);

      const result = await loadMessages({ chatId });

      addMessages(result.messages, to);
      setOldMessageId(result.oldMessageId || null);
      toggleMoreMessagesAvailable(result.moreMessagesAvailable);

      if (enableScroll) {
        toggleScrollToBottom(true);
      }

      toggleMessagesLoading(false);
    },
    [
      addMessages,
      toggleMessagesLoading,
      toggleMoreMessagesAvailable,
      toggleScrollToBottom,
    ],
  );

  const handleChatChange = useCallback(
    (chat: Chat) => {
      setOldMessageId(null);
      toggleMoreMessagesAvailable(false);
      load({
        chatId: chat.id,
        enableScroll: true,
      });
    },
    [load, toggleMoreMessagesAvailable],
  );

  return {
    oldMessageId,
    moreMessagesAvailable,
    loadMessages: load,
    handleChatChange,
  };
};
