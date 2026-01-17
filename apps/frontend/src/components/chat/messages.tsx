"use client";

import type { UIEvent } from "react";

import { useMemo, useEffect, useRef } from "react";
import { CircleProgress } from "tvuikit";

import { Message } from "./message";

import { useDateFormatters } from "@/hooks/use-date-formatters.hook";
import { useGroupedMessages } from "@/hooks/use-grouped-messages.hook";

import { useChat } from "@/contexts/chat.context";

export const Messages = () => {
  const {
    messages,
    messagesRef,
    autoScrollEnabled,
    users,
    messagesLoading,
    onScroll,
    loadOlderMessages,
    hasMoreMessages,
    loadingOlderMessages: loadingOlderMessages,
  } = useChat();

  const loadingOlderRef = useRef(false);
  const previousScrollHeightRef = useRef<number>(0);
  const wasLoadingOlderRef = useRef(false);

  const messagesArray = useMemo(
    () => Array.from(messages.values()),
    [messages],
  );

  const { formatFullDate } = useDateFormatters();
  const groupsWithDates = useGroupedMessages(messagesArray, formatFullDate);

  useEffect(() => {
    if (loadingOlderMessages) {
      wasLoadingOlderRef.current = true;
      return;
    }

    if (!messagesRef.current) {
      return;
    }

    if (wasLoadingOlderRef.current) {
      const currentScrollHeight = messagesRef.current.scrollHeight;
      const previousScrollHeight = previousScrollHeightRef.current;

      if (
        previousScrollHeight > 0 &&
        currentScrollHeight > previousScrollHeight
      ) {
        const scrollDifference = currentScrollHeight - previousScrollHeight;
        messagesRef.current.scrollTop += scrollDifference;
      }

      wasLoadingOlderRef.current = false;
      previousScrollHeightRef.current = currentScrollHeight;
      return;
    }

    if (autoScrollEnabled && messagesRef.current) {
      messagesRef.current.scrollIntoView({ block: "end" });
      previousScrollHeightRef.current = messagesRef.current.scrollHeight;
    }
  }, [groupsWithDates, autoScrollEnabled, messagesRef, loadingOlderMessages]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    onScroll?.(e);

    if (!messagesRef.current) {
      return;
    }

    const shouldLoad = loadOlderMessages && hasMoreMessages;
    const loading = loadingOlderMessages || loadingOlderRef.current;
    const canLoad = shouldLoad && !loading;
    if (!canLoad) {
      return;
    }

    const { scrollTop } = messagesRef.current;
    if (scrollTop < 200) {
      previousScrollHeightRef.current = messagesRef.current.scrollHeight;
      loadingOlderRef.current = true;
      loadOlderMessages().finally(() => {
        loadingOlderRef.current = false;
      });
    }
  };

  if (messagesLoading.current) {
    return (
      <div ref={messagesRef} className="flex-center flex-1">
        <CircleProgress />
      </div>
    );
  }

  return (
    <div
      ref={messagesRef}
      className="flex flex-col flex-1 overflow-y-auto py-4"
      onScroll={handleScroll}
    >
      {loadingOlderMessages && hasMoreMessages && (
        <div className="flex justify-center py-2">
          <CircleProgress size={20} />
        </div>
      )}
      {groupsWithDates.map((group) => (
        <div key={group.dateString}>
          <div className="px-4 py-2 my-2 text-center text-mini">
            <span className="bg-(--bg-smooth-light) py-1 px-2 rounded-lg">
              {group.formattedDate}
            </span>
          </div>
          {group.messages.map((message) => {
            const sender = users.get(message.senderId);
            if (!sender) {
              return (
                <span key={message.id}>
                  Error: <a href="https://t.me/fockusty">t.me/fockusty</a>
                </span>
              );
            }

            return (
              <Message key={message.id} message={message} sender={sender} />
            );
          })}
        </div>
      ))}
    </div>
  );
};
