"use client";

import type { Message as MessageType, User } from "@/types";
import type { UIEvent } from "react";

import { memo, useMemo, useEffect } from "react";
import { CircleProgress } from "tvuikit";

import { IconOrAvatar } from "./icon";
import { useChat } from "@/contexts/chat.context";

type MessageProps = {
  message: MessageType & {
    showHeader?: boolean;
    pending?: boolean;
    failed?: boolean;
  };
  sender?: User | undefined;
};

const MessageInner = ({ message, sender }: MessageProps) => {
  const { retrySendMessage } = useChat();

  const time = useMemo(() => {
    return new Date(message.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [message.createdAt]);

  const showHeader = !!message.showHeader;

  return (
    <div
      className={[
        "flex items-start gap-2 px-4 rounded-md",
        "hover:bg-[var(--bg-component)] duration-100",
        showHeader ? "mt-2" : "",
      ].join(" ")}
    >
      {showHeader ? (
        <>
          <IconOrAvatar entity={sender} size={48} />
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-1">
              <span className="font-semibold">
                {sender?.nickname || sender?.username || "—"}
              </span>
              <span className="text-mini flex items-center gap-2">
                <span>{time}</span>
                {message.pending && <CircleProgress size={20} />}
                {message.failed && (
                  <button
                    onClick={() => retrySendMessage(message.id)}
                    className="text-red-400 text-mini underline"
                    aria-label="Retry send"
                  >
                    Повторить
                  </button>
                )}
              </span>
            </div>
            <span>{message.text}</span>
          </div>
        </>
      ) : (
        <div style={{ marginLeft: 54 }} className="flex flex-col w-full">
          {message.pending ? (
            <div className="flex flex-row items-center gap-1">
              <span>{message.text}</span>
              <CircleProgress size={12} />
            </div>
          ) : (
            <span>{message.text}</span>
          )}
        </div>
      )}
    </div>
  );
};

export const Message = memo(MessageInner, (prev, next) => {
  if (prev.message.id !== next.message.id) return false;
  if (prev.message.text !== next.message.text) return false;
  if (prev.message.createdAt !== next.message.createdAt) return false;
  if (!!prev.message.showHeader !== !!next.message.showHeader) return false;

  const prevSender = prev.sender;
  const nextSender = next.sender;
  if (prevSender?.id !== nextSender?.id) return false;
  if (prevSender?.nickname !== nextSender?.nickname) return false;
  if (prevSender?.username !== nextSender?.username) return false;

  return true;
});

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
    [messages],
  );

  const groupedMessages = useMemo(() => {
    const groups: Array<{
      messages: MessageType[];
      startMessage: MessageType;
      startTime: number;
      dateString: string;
    }> = [];

    const TEN_MIN = 10 * 60 * 1000;

    for (let i = 0; i < messagesArray.length; i++) {
      const message = messagesArray[i];
      const messageDate = new Date(message.createdAt);
      const messageTime = messageDate.getTime();
      const messageDateString = messageDate.toDateString();

      if (groups.length === 0) {
        groups.push({
          messages: [message],
          startMessage: message,
          startTime: messageTime,
          dateString: messageDateString,
        });
        continue;
      }

      const prev = messagesArray[i - 1];
      const lastGroup = groups[groups.length - 1];

      const timeDiff = Math.abs(messageTime - lastGroup.startTime);
      const isSameDate = messageDateString === lastGroup.dateString;
      const isWithinTenMin = timeDiff <= TEN_MIN;

      if (
        prev.senderId !== message.senderId ||
        !isSameDate ||
        !isWithinTenMin
      ) {
        groups.push({
          messages: [message],
          startMessage: message,
          startTime: messageTime,
          dateString: messageDateString,
        });
      } else {
        lastGroup.messages.push(message);
      }
    }

    const result: Array<
      MessageType & { showHeader: boolean; dateString: string }
    > = [];

    for (const group of groups) {
      const { dateString } = group;
      group.messages.forEach((message, indexInGroup) => {
        result.push({
          ...message,
          showHeader: indexInGroup === 0,
          dateString,
        });
      });
    }

    return result;
  }, [messagesArray]);

  useEffect(() => {
    if (!autoScrollEnabled || !messagesRef.current) {
      return;
    }

    messagesRef.current.scrollIntoView({ block: "end" });
  }, [groupedMessages, autoScrollEnabled, messagesRef]);

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
      {groupedMessages.map((message, index) => {
        const sender = users.get(message.senderId);
        if (!sender) {
          return (
            <span key={index}>
              Error: <a href="https://t.me/fockusty">t.me/fockusty</a>
            </span>
          );
        }

        const prevMessage = groupedMessages[index - 1];
        const showDateSeparator =
          !prevMessage || message.dateString !== prevMessage.dateString;

        return (
          <div key={message.id}>
            {showDateSeparator && (
              <div className="px-4 py-2 my-2 text-center text-mini">
                {new Date(message.createdAt).toLocaleDateString("ru-RU", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}
            <Message message={message} sender={sender} />
          </div>
        );
      })}
    </div>
  );
};
