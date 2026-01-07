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
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const ChatNavigation = ({
  chat,
  choosedChat,
  setChoosedChat,
  className,
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
    </div>
  );
};

type ChatsNaviationProps = {
  chats: Chat[];
  choosedChat: Chat | null;
  setChoosedChat: Dispatch<SetStateAction<Chat | null>>;
};

export const ChatsNavigation = ({
  chats,
  choosedChat,
  setChoosedChat,
}: ChatsNaviationProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={[
          "px-3 py-2 flex-center cursor-pointer",
          "hover:bg-(--bg-component)",
        ].join(" ")}
      >
        <IconOrAvatar />
      </div>
      <hr className="w-[60%] text-(--fg-mini-text)" />
      {chats.map((chat) => (
        <ChatNavigation
          choosedChat={choosedChat}
          setChoosedChat={setChoosedChat}
          chat={chat}
          key={chat.id}
        />
      ))}
    </div>
  );
};
