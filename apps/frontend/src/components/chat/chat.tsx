import type { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from "react";
import type { Chat } from "@/types";

import Image from "next/image";

type ChatNavigationProps = {
  chat: Chat;
  setChoosedChat: Dispatch<SetStateAction<Chat | null>>
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const ChatNavigation = ({ chat, setChoosedChat, className }: ChatNavigationProps) => {
  return (
    <div
      className={[
        "w-full px-3 py-2 flex items-center gap-3 cursor-pointer rounded-md transition-colors",
        "hover:bg-(--bg-component)",
        className,
      ].join(" ")}
      onClick={() => setChoosedChat(chat)}
    >
      <Image
        height={40}
        width={40}
        src={chat.icon || "/hat.png"}
        alt="icon"
        className="rounded-full"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <strong className="truncate">{chat.name}</strong>
          <span className="text-mini text-muted">{chat.members?.length || 0}</span>
        </div>
        <div className="text-sm text-muted truncate max-w-full">
          {chat.messages.at(-1)}
        </div>
      </div>
    </div>
  );
};

type ChatsNaviationProps = {
  chats: Chat[];
  setChoosedChat: Dispatch<SetStateAction<Chat | null>>
};

export const ChatsNavigation = ({ chats, setChoosedChat }: ChatsNaviationProps) => {
  return <div className="flex flex-col gap-1">{chats.map((chat) => (
    <ChatNavigation setChoosedChat={setChoosedChat} chat={chat} key={chat.id} />
  ))}</div>;
};
