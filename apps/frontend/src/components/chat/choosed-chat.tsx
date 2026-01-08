import type { Chat, Message, User } from "@/types";
import type { RefObject } from "react";

import { Messages } from "./message";
import { MessageTextarea } from "./message-textarea";

type ChoosedChatProps = {
  chat: Chat;
  messages: Map<string, Message>;
  onSubmit: (text: string) => void;
  users: Record<string, User>;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  messagesRef: RefObject<HTMLDivElement | null>;
  onScroll?: () => void;
  onRetry?: (id: string) => void;
  loading?: boolean;
};

export const ChoosedChat = ({
  chat,
  messages,
  users,
  onSubmit,
  textareaRef,
  messagesRef,
  onScroll,
  onRetry,
  loading = false,
}: ChoosedChatProps) => {
  return (
    <>
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

      <Messages
        messages={messages}
        users={users}
        onRetry={onRetry}
        messagesRef={messagesRef}
        onScroll={onScroll}
        loading={loading}
      />

      <div className="px-2 py-1 bg-(--bg-card) rounded-b-lg">
        <MessageTextarea textareaRef={textareaRef} onSubmit={onSubmit} />
      </div>
    </>
  );
};
