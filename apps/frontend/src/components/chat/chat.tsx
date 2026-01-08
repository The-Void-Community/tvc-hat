import type {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
} from "react";
import type { Chat } from "@/types";

import { IconOrAvatar } from "./icon";

type ChatNavigationProps = {
  chat: Chat;
  choosedChat: Chat | null;
  setChoosedChat: Dispatch<SetStateAction<Chat | null>>;
  full?: boolean
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const ChatNavigation = ({
  chat,
  choosedChat,
  setChoosedChat,
  className,
  full = false
}: ChatNavigationProps) => {
  return (
    <div
      className={[
        "w-full px-3 py-2 flex-center gap-3 cursor-pointer rounded-lg transition-colors",
        "hover:bg-(--bg-component)",
        className,
      ].join(" ")}
      onClick={() => {
        if (choosedChat?.id === chat.id) {
          return;
        }

        setChoosedChat(chat);
      }}
    >
      <IconOrAvatar entity={chat} />
      {full && (
        <span className="w-24 truncate">{chat.name}</span>
      )}
    </div>
  );
};

type ChatsNaviationProps = {
  chats: Chat[];
  choosedChat: Chat | null;
  setChoosedChat: Dispatch<SetStateAction<Chat | null>>;
  full?: boolean
};

export const ChatsNavigation = ({
  chats,
  choosedChat,
  setChoosedChat,
  full
}: ChatsNaviationProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      {chats.map((chat) => (
        <ChatNavigation
          choosedChat={choosedChat}
          setChoosedChat={setChoosedChat}
          chat={chat}
          key={chat.id}
          full={full}
        />
      ))}
    </div>
  );
};
