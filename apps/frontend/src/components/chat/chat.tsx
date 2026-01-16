"use client";

import type { Chat } from "@/types";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

import { useMemo } from "react";

import { ChatType } from "@/enums";
import { useChat } from "@/contexts/chat.context";
import { IconOrAvatar } from "./icon";
import {
  useDirectChatAvatar,
  useDirectChatName,
} from "@/hooks/use-direct-chat.hook";

type ChatNavigationProps = {
  chat: Chat;
  full?: boolean;
  type: ChatType;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const ChatNavigation = ({
  chat,
  className,
  full = false,
  type,
}: ChatNavigationProps) => {
  const { currentChat, setCurrentChat, onChangeChat, me, users } = useChat();
  const chatName = useDirectChatName({
    type,
    myId: me.id,
    name: chat.name,
    users,
  });
  const entity = useDirectChatAvatar({
    myId: me.id,
    users,
    chat: chat,
  });

  return (
    <div
      className={[
        "w-full px-3 py-2 flex-center gap-3 cursor-pointer rounded-lg transition-colors",
        "hover:bg-(--bg-component)",
        className,
      ].join(" ")}
      onClick={() => {
        if (currentChat?.id === chat.id) {
          return;
        }

        setCurrentChat(chat);
        onChangeChat(chat);
      }}
    >
      <IconOrAvatar entity={entity} />
      {full && <span className="w-24 truncate">{chatName}</span>}
    </div>
  );
};

type ChatsNaviationProps = {
  type: ChatType;
  full?: boolean;
};

export const ChatsNavigation = ({ type, full }: ChatsNaviationProps) => {
  const { filteredChats } = useChat();

  const chats = useMemo(
    () => Array.from(filteredChats[type].values()),
    [filteredChats, type],
  );

  return (
    <div className="flex flex-col items-center gap-1">
      {chats.map((chat) => (
        <ChatNavigation key={chat.id} chat={chat} full={full} type={type} />
      ))}
    </div>
  );
};
