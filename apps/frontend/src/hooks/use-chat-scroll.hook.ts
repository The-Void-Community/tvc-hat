import type { RefObject } from "react";
import { MessagesMap } from "@/types";
import { useCallback, useEffect } from "react";
import { useToggleRef } from "./use-toggle.hook";

export type UseChatScrollProps = {
  messagesRef: RefObject<HTMLDivElement | null>;
  messages: MessagesMap;
};

export const useChatScroll = ({
  messagesRef,
  messages,
}: UseChatScrollProps) => {
  const [autoScrollEnabled, toggleAutoScroll] = useToggleRef();
  const [scrollToBottomEnabled, toggleScrollToBottom] = useToggleRef();

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
    if (!scrollToBottomEnabled) {
      return;
    }

    scrollToBottom("instant");
    toggleScrollToBottom(false);
  }, [messages, scrollToBottomEnabled, scrollToBottom, toggleScrollToBottom]);

  return {
    scrollToBottom,
    handleScroll,
    autoScrollEnabled,
    toggleAutoScroll,
    toggleScrollToBottom,
    scrollToBottomEnabled,
  };
};
