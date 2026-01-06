import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type { Chat } from "@/types";

import Image from "next/image";

type ChatNavigationProps = {
  chat: Chat;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const ChatNavigation = ({ chat, className }: ChatNavigationProps) => {
  return (
    <div
      className={[
        "w-full p-2 flex flex-row gap-2 cursor-pointer duration-200",
        "hover:bg-(--bg-component)",
        className,
      ].join(" ")}
    >
      <Image
        height={48}
        width={48}
        src={chat.icon || "/hat.png"}
        alt="icon"
        className="rounded-[100%]"
      />

      <div className="w-full flex flex-col">
        <span>
          <strong>{chat.name}</strong>
        </span>
        <span className="max-w-50 truncate">
          {chat.messages[chat.messages.length - 1]}
        </span>
      </div>
    </div>
  );
};

type ChatsNaviationProps = {
  chats: Chat[];
};

export const ChatsNavigation = ({ chats }: ChatsNaviationProps) => {
  return chats.map((chat) => <ChatNavigation chat={chat} key={chat.id} />);
};
