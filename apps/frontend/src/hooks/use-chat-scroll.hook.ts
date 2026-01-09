import type { RefObject } from "react";
import { useCallback, useRef } from "react";

export type UseChatScrollProps = {
  messagesRef: RefObject<HTMLDivElement | null>;
};

export const useChatScroll = ({ messagesRef }: UseChatScrollProps) => {
  const autoScrollEnabled = useRef<boolean>(false);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "instant") => {
      if (!messagesRef.current) {
        return;
      }

      if (behavior === "instant") {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        return;
      }

      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior,
      });
    },
    [messagesRef],
  );

  const handleScroll = useCallback(() => {
    if (!messagesRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
    autoScrollEnabled.current = scrollHeight - scrollTop - clientHeight < 100;
  }, [messagesRef]);

  return {
    scrollToBottom,
    handleScroll,
    autoScrollEnabled,
  };
};
