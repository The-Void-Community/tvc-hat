import type { RefObject } from "react";

import { useCallback, useEffect } from "react";
import { useToggleRef, useToggleState } from "./use-toggle.hook";

export type UseChatScrollProps = {
  messagesRef: RefObject<HTMLDivElement | null>;
};

export const useChatScroll = ({ messagesRef }: UseChatScrollProps) => {
  const [autoScrollEnabled, toggleAutoScroll] = useToggleRef();
  const [scrollToBottomEnabled, toggleScrollToBottom] = useToggleState(false);

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

    toggleAutoScroll(scrollHeight - scrollTop - clientHeight < 100);
  }, [messagesRef, toggleAutoScroll]);

  useEffect(() => {
    if (!scrollToBottomEnabled || !messagesRef.current) {
      return;
    }

    scrollToBottom("instant");
    toggleScrollToBottom(false);
  }, [
    scrollToBottomEnabled,
    scrollToBottom,
    messagesRef,
    toggleScrollToBottom,
  ]);

  return {
    scrollToBottom,
    handleScroll,
    autoScrollEnabled,
    toggleAutoScroll,
    toggleScrollToBottom,
  };
};
