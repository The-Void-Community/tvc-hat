import type { ReactNode } from "react";

import type { ChatContextType } from "./chat/chat.context";
import type { MessagesContextType } from "./messages/messages.context";
import type { UsersContextType } from "./users/users.context";

import { ChatContext } from "./chat/chat.context";
import { MessagesContext } from "./messages/messages.context";
import { UsersContext } from "./users/users.context";

export type AppProvidersProps = {
  chat: ChatContextType;
  messages: MessagesContextType;
  users: UsersContextType;
  children: ReactNode;
};

export const AppProviders = ({ children, ...props }: AppProvidersProps) => {
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
