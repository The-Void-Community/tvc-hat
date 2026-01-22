import type { Chat } from "@/types";
import { memo } from "react";

import { useChat } from "@/features/chat/chat.context";

import { useUsers } from "@/features/users/users.context";
import { Messages } from "@/features/messages/components/messages.component";
import { MessageTextarea } from "@/features/messages/components/message-textarea.component";

import { useDirectChatName } from "@/features/chat/hooks/use-direct-chat.hook";

type ChatContentProps = {
  chat: Chat;
};

export const ChatHeader = memo(({ chat }: ChatContentProps) => {
  const { me } = useUsers();

  const chatName = useDirectChatName({
    myId: me.id,
    chat,
  });

  return (
    <div className="bg-(--bg-smooth) rounded-t-lg py-3 px-4 border-(--bg-component)">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg">{chatName}</h5>
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
  const { currentChat } = useChat();

  if (!currentChat) return null;

  return <ChatContent chat={currentChat} />;
};
