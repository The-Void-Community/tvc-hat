import type { ReactNode } from "react";

import type { ChatContextType } from "../features/chat/chat.context";
import type { MessagesContextType } from "../features/messages/messages.context";
import type { UsersContextType } from "../features/users/users.context";

import { ChatContext } from "../features/chat/chat.context";
import { MessagesContext } from "../features/messages/messages.context";
import { UsersContext } from "../features/users/users.context";

export type ChatProvidersProps = {
  chat: ChatContextType;
  messages: MessagesContextType;
  users: UsersContextType;
  children: ReactNode;
};

export const ChatProviders = ({ children, ...props }: ChatProvidersProps) => {
  return (
    <ChatContext.Provider value={props.chat}>
      <MessagesContext.Provider value={props.messages}>
        <UsersContext.Provider value={props.users}>
          {children}
        </UsersContext.Provider>
      </MessagesContext.Provider>
    </ChatContext.Provider>
  );
};
