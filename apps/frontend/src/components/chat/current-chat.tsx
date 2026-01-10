import type { Chat } from "@/types";
import { useChat } from "@/contexts/chat.context";

import { memo } from "react";

import { Messages } from "./messages";
import { MessageTextarea } from "./message-textarea";

type ChatContentProps = {
  chat: Chat;
}

export const ChatHeader = memo(({ chat }: ChatContentProps) => {
  return (
    <div className="bg-(--bg-smooth) rounded-t-lg py-3 px-4 border-(--bg-component)">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg">{chat.name}</h5>
          <span className="text-mini text-muted">
            {chat.members.length} members
          </span>
        </div>
      </div>
    </div>
  );
});
ChatHeader.displayName = "ChatHeader";

const ChatContent = memo(({ chat }: ChatContentProps) => {
  return (
    <>
      <ChatHeader chat={chat} />
      <Messages />
      <MessageTextarea />
    </>
  );
});
ChatContent.displayName = "CurrentChatContent";

export const CurrentChat = () => {
  const { currentChat: chat } = useChat();
  if (!chat) {
    return <></>;
  }

  return <ChatContent chat={chat} />;
};
