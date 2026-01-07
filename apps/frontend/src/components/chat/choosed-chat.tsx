import type { Chat, Message, User } from "@/types";
import type { Dispatch, FormEvent, RefObject, SetStateAction } from "react";

import { Messages } from "./message";
import { MessageTextarea } from "./message-textarea";

type ChoosedChatProps = {
  chat: Chat;
  messages: Map<string, Message>;
  onSubmit: (event: FormEvent | KeyboardEvent) => void;
  users: Record<string, User>;
  setText: Dispatch<SetStateAction<string>>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  messagesRef: RefObject<HTMLDivElement | null>;
};

export const ChoosedChat = ({
  chat,
  messages,
  users,
  onSubmit,
  setText,
  textareaRef,
  messagesRef,
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

      <div ref={messagesRef} className="flex-1 overflow-auto py-2">
        <Messages messages={messages} users={users} />
      </div>

      <div className="px-2 py-1 bg-(--bg-card) rounded-b-lg">
        <MessageTextarea
          textareaRef={textareaRef}
          onSubmit={onSubmit}
          setText={setText}
        />
      </div>
    </>
  );
};
