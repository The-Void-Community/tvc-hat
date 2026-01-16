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

  const handleMessagesLoad = useCallback(() => {
    if (!scrollToBottomEnabled) {
      return;
    }

    scrollToBottom("instant");
    toggleScrollToBottom(false);
  }, [scrollToBottom, scrollToBottomEnabled, toggleScrollToBottom]);

  useEffect(() => {
    handleMessagesLoad();
  }, [messagesRef, handleMessagesLoad]);

  return {
    handleMessagesLoad,
    scrollToBottom,
    handleScroll,
    autoScrollEnabled,
    toggleAutoScroll,
    toggleScrollToBottom,
  };
};
