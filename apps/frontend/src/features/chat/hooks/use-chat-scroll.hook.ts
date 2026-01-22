import { useToggleState } from "@/hooks/use-toggle.hook";
import type { RefObject, UIEvent } from "react";
import { useCallback, useEffect, useRef } from "react";

export type UseChatScrollProps = {
  messagesRef: RefObject<HTMLDivElement | null>;
};

export const useChatScroll = ({ messagesRef }: UseChatScrollProps) => {
  const autoScrollEnabled = useRef<boolean>(true);
  const [scrollToBottomEnabled, toggleScrollToBottom] = useToggleState(false);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "auto") => {
      const el = messagesRef.current;
      if (!el) return;

      el.scrollTo({
        top: el.scrollHeight,
        behavior,
      });
    },
    [messagesRef],
  );

  const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;

    const distanceFromBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight;

    autoScrollEnabled.current = distanceFromBottom < 100;
  }, []);

  const maybeScrollToBottom = useCallback(
    (behavior: ScrollBehavior = "instant") => {
      if (!autoScrollEnabled.current) {
        return;
      }

      scrollToBottom(behavior);
    },
    [scrollToBottom],
  );

  const handleMessagesLoad = useCallback(() => {
    maybeScrollToBottom();
    toggleScrollToBottom(false);
  }, [maybeScrollToBottom, toggleScrollToBottom]);

  useEffect(() => {
    handleMessagesLoad();
  }, [messagesRef, handleMessagesLoad]);

  return {
    messagesRef,
    handleScroll,
    scrollToBottom,
    maybeScrollToBottom,
    autoScrollEnabled,
    scrollToBottomEnabled,
    toggleScrollToBottom,
    handleMessagesLoad,
  };
};
