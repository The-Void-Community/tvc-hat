import type { MessagesContextType } from "../messages.context";
import type { UIEvent, RefObject } from "react";
import { useRef, useCallback } from "react";

type Params = {
  messagesRef: RefObject<HTMLDivElement | null>;
  store: MessagesContextType["store"];
  currentChatId: string;
  autoScrollEnabled: RefObject<boolean>;
  oldMessagesAvailable: boolean;
  oldMessagesLoading: MessagesContextType["oldMessagesLoading"];
  loadMessages: MessagesContextType["loadMessages"];
  onMessagesScroll?: (event: UIEvent<HTMLDivElement>) => void;
};

export const useMessagesScroll = ({
  messagesRef,
  currentChatId,
  oldMessagesAvailable,
  oldMessagesLoading,
  loadMessages,
  onMessagesScroll,
  store
}: Params) => {
  const scrollRef = useRef({ previousScrollHeight: 0, previousScrollTop: 0 });

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      onMessagesScroll?.(event);
      if (!messagesRef.current) return;

      const { scrollTop, scrollHeight } = messagesRef.current;
      if (scrollTop < 200 && oldMessagesAvailable && !oldMessagesLoading) {
        scrollRef.current.previousScrollHeight = scrollHeight;
        scrollRef.current.previousScrollTop = scrollTop;

        loadMessages({
          chatId: currentChatId,
          enableScroll: false,
          to: "start",
          isOldMessages: true,
          positionMessageId: store.order.at(0),
        }).finally(() => {
          if (messagesRef.current) {
            const delta =
              messagesRef.current.scrollHeight -
              scrollRef.current.previousScrollHeight;
            messagesRef.current.scrollTop =
              scrollRef.current.previousScrollTop + delta;
          }
        });
      }
    },
    [onMessagesScroll, messagesRef, oldMessagesAvailable, oldMessagesLoading, loadMessages, currentChatId, store.order],
  );

  return { handleScroll };
};
