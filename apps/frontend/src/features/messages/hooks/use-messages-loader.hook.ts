import type { Chat, MaybeFrontendMessage } from "@/types";

import { useCallback, useState } from "react";
import { loadMessages } from "@/features/messages/load-messages";
import { useToggleState } from "@/hooks/use-toggle.hook";

export type UseChatMessagesProps = {
  addMessages: (messages: MaybeFrontendMessage[], to?: "start" | "end") => void;
  toggleScrollToBottom: (enabled: boolean) => void;
};

export type LoadMessagesParameters = {
  chatId: string;
  to?: "start" | "end";
  enableScroll?: boolean;
  isOldMessages?: boolean;
  positionMessageId?: string;
  count?: number;
  sort?: "asc" | "desc";
};

export const useMessagesLoader = ({
  addMessages,
  toggleScrollToBottom,
}: UseChatMessagesProps) => {
  const [oldMessagesAvailable, toggleOldMessagesAvailable] =
    useToggleState(false);
  const [oldMessageId, setOldMessageId] = useState<string | null>(null);
  const [messagesLoading, toggleMessagesLoading] = useToggleState(false);
  const [oldMessagesLoading, toggleOldMessagesLoading] = useToggleState(false);

  const load = useCallback(
    async ({
      chatId,
      enableScroll = false,
      to = "end",
      isOldMessages = false,
      positionMessageId,
      count = 100,
      sort = "desc",
    }: LoadMessagesParameters) => {
      if (isOldMessages) {
        toggleOldMessagesLoading(true);
      } else {
        toggleMessagesLoading(true);
      }

      const result = await loadMessages({
        chatId,
        positionMessageId,
        count,
        sort,
      });

      addMessages(result.messages, to);
      setOldMessageId(result.oldMessageId || null);
      toggleOldMessagesAvailable(result.moreMessagesAvailable);

      if (enableScroll) {
        toggleScrollToBottom(true);
      }

      if (isOldMessages) {
        toggleOldMessagesLoading(false);
      } else {
        toggleMessagesLoading(false);
      }
    },
    [
      addMessages,
      toggleMessagesLoading,
      toggleOldMessagesAvailable,
      toggleOldMessagesLoading,
      toggleScrollToBottom,
    ],
  );

  const handleChatChange = useCallback(
    (chat: Chat) => {
      setOldMessageId(null);
      toggleOldMessagesAvailable(false);
      load({
        chatId: chat.id,
        enableScroll: true,
      });
    },
    [load, toggleOldMessagesAvailable],
  );

  return {
    oldMessageId,
    oldMessagesAvailable,
    loadMessages: load,
    handleChatChange,
    oldMessagesLoading,
    messagesLoading,
    toggleOldMessagesAvailable,
    toggleMessagesLoading,
    toggleOldMessagesLoading,
  };
};
