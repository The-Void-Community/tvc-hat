import type { Chat, Message, User } from "@/types";
import type { Dispatch, FormEventHandler, RefObject, SetStateAction } from "react";

import { Messages } from "./message";
import { MessageTextarea } from "./message-textarea";

type ChoosedChatProps = {
  chat: Chat;
  messages: Message[];
  onSubmit: FormEventHandler<HTMLFormElement>;
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
      <div className="bg-(--bg-smooth) rounded-t-lg py-3 px-4 border-b border-(--bg-component)">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-lg">{chat.name}</h5>
            <span className="text-mini text-muted">{chat.members.length} members</span>
          </div>
        </div>
      </div>

      <div
        ref={messagesRef}
        className="flex-1 overflow-auto px-4 py-6 space-y-3 bg-(--bg-main)"
      >
        <Messages messages={messages} users={users} />
      </div>

      <div className="px-4 py-3 bg-(--bg-card) rounded-b-lg border-t border-(--bg-component)">
        <MessageTextarea
          textareaRef={textareaRef}
          onSubmit={onSubmit}
          setText={setText}
        />
      </div>
    </>
  );
};
