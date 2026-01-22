"use client";

import type { Chat } from "@/types";
import { useMemo, type DetailedHTMLProps, type HTMLAttributes } from "react";

import { ChatType } from "@/enums";
import { IconOrAvatar } from "@/components/icon";

import {
  useDirectChatAvatar,
  useDirectChatName,
} from "@/features/chat/hooks/use-direct-chat.hook";

import { useUsers } from "@/features/users/users.context";
import { useChat } from "@/features/chat/chat.context";

type ChatNavigationProps = {
  chat: Chat;
  full?: boolean;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const ChatNavigation = ({
  chat,
  className,
  full = false,
}: ChatNavigationProps) => {
  const { currentChat, setCurrentChat, onChangeChat } = useChat();
  const { me } = useUsers();

  const chatName = useDirectChatName({
    myId: me.id,
    chat,
  });

  const entity = useDirectChatAvatar({
    chat,
    myId: me.id,
  });

  const handleClick = () => {
    if (currentChat?.id !== chat.id) {
      setCurrentChat(chat);
      onChangeChat(chat);
    }
  };

  const actived = currentChat?.id === chat.id;

  return (
    <div
      className={[
        "w-full px-3 py-2 flex-center gap-3 cursor-pointer rounded-lg transition-colors",
        actived ? "bg-(--bg-smooth-light)" : "hover:bg-(--bg-component)",
        className,
      ].join(" ")}
      onClick={handleClick}
    >
      <IconOrAvatar entity={entity} />
      {full && <span className="w-24 truncate">{chatName}</span>}
    </div>
  );
};

type ChatsNavigationProps = {
  type: ChatType;
  full?: boolean;
};

export const ChatsNavigation = ({ type, full }: ChatsNavigationProps) => {
  const { filteredChats } = useChat();

  const chats = useMemo(
    () => Array.from(filteredChats[type].values()),
    [filteredChats, type],
  );

  return (
    <div className="flex flex-col items-center gap-1">
      {chats.map((chat) => (
        <ChatNavigation key={chat.id} chat={chat} full={full} />
      ))}
    </div>
  );
};
