"use client";

import type { UIEvent } from "react";
import { useChat } from "@/contexts/chat.context";

import { useMemo, useEffect } from "react";
import { CircleProgress } from "tvuikit";

import { Message } from "./message";
import { useDateFormatters } from "@/hooks/use-date-formatters.hook";
import { useGroupedMessages } from "@/hooks/use-grouped-messages.hook";

export const Messages = () => {
  const {
    messages,
    messagesRef,
    autoScrollEnabled,
    users,
    messagesLoading,
    onScroll,
  } = useChat();

  const messagesArray = useMemo(
    () => Array.from(messages.values()),
    [messages]
  );

  const { formatFullDate } = useDateFormatters();
  const groupsWithDates = useGroupedMessages(messagesArray, formatFullDate);

  useEffect(() => {
    if (!autoScrollEnabled || !messagesRef.current) {
      return;
    }

    messagesRef.current.scrollIntoView({ block: "end" });
  }, [groupsWithDates, autoScrollEnabled, messagesRef]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    onScroll?.(e);
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
      className="flex flex-col flex-1 overflow-y-auto py-2"
      onScroll={handleScroll}
    >
      {groupsWithDates.map((group) => (
        <div key={group.dateString}>
          <div className="px-4 py-2 my-2 text-center text-mini sticky top-0 z-10">
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

            return <Message key={message.id} message={message} sender={sender} />;
          })}
        </div>
      ))}
    </div>
  );
};