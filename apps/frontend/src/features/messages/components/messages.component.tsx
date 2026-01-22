"use client";

import { CircleProgress } from "tvuikit";

import { useGroupedMessages } from "../hooks/use-grouped-messages.hook";
import { useDateFormatters } from "@/hooks/use-date-formatters.hook";
import { useMessagesScroll } from "../hooks/use-messages-scroll.hook";

import { useMessages } from "../messages.context";
import { useUsers } from "@/features/users/users.context";
import { Message } from "./message.component";
import { useChat } from "@/features/chat/chat.context";

export const Messages = () => {
  const { users } = useUsers();
  const { currentChat } = useChat();
  const {
    store,
    messagesRef,
    onMessagesScroll,
    oldMessagesLoading,
    messagesLoading,
    oldMessagesAvailable,
    autoScrollEnabled,
    loadMessages,
    retrySendMessage,
  } = useMessages();

  const { formatFullDate } = useDateFormatters();
  const groupsWithDates = useGroupedMessages(
    store.entities,
    store.order,
    formatFullDate,
  );

  const { handleScroll } = useMessagesScroll({
    currentChatId: currentChat?.id || "",
    messagesRef,
    autoScrollEnabled,
    oldMessagesAvailable,
    oldMessagesLoading,
    loadMessages,
    onMessagesScroll,
    store,
  });

  if (messagesLoading) {
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
      {oldMessagesLoading && oldMessagesAvailable && (
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
            const sender = users.entities[message.senderId];
            if (!sender) {
              return (
                <span key={message.id}>
                  Error: <a href="https://t.me/fockusty">t.me/fockusty</a>
                </span>
              );
            }

            return (
              <Message
                key={message.id}
                message={message}
                sender={sender}
                retrySendMessage={retrySendMessage}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
