import type { UIEvent, RefObject } from "react";
import { useRef, useCallback } from "react";

type Params = {
  messagesRef: RefObject<HTMLDivElement | null>;
  autoScrollEnabled: boolean;
  oldMessagesAvailable: boolean;
  oldMessagesLoading: boolean;
  loadOlderMessages: () => Promise<boolean>;
  toggleOldMessagesLoading: (state?: boolean) => void;
  onMessagesScroll?: (event: UIEvent<HTMLDivElement>) => void;
};

export const useMessagesScroll = ({
  messagesRef,
  autoScrollEnabled,
  oldMessagesAvailable,
  oldMessagesLoading,
  loadOlderMessages,
  toggleOldMessagesLoading,
  onMessagesScroll,
}: Params) => {
  const scrollRef = useRef({ prevScrollHeight: 0, prevScrollTop: 0 });

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      onMessagesScroll?.(event);
      if (!messagesRef.current) return;

      const { scrollTop, scrollHeight } = messagesRef.current;
      if (scrollTop < 200 && oldMessagesAvailable && !oldMessagesLoading) {
        toggleOldMessagesLoading(true);
        scrollRef.current.prevScrollHeight = scrollHeight;
        scrollRef.current.prevScrollTop = scrollTop;

        loadOlderMessages().finally(() => {
          toggleOldMessagesLoading(false);
          if (messagesRef.current) {
            const delta =
              messagesRef.current.scrollHeight -
              scrollRef.current.prevScrollHeight;
            messagesRef.current.scrollTop =
              scrollRef.current.prevScrollTop + delta;
          }
        });
      }

      if (!autoScrollEnabled) {
        return;
      }

      const atBottom =
        scrollHeight - scrollTop - messagesRef.current.clientHeight < 50;
      if (!atBottom) {
        return;
      }

      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    },
    [
      messagesRef,
      autoScrollEnabled,
      oldMessagesAvailable,
      oldMessagesLoading,
      loadOlderMessages,
      toggleOldMessagesLoading,
      onMessagesScroll,
    ],
  );

  return { handleScroll };
};
