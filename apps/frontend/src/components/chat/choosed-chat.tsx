import type { Chat, Message, User } from "@/types"
import type { FormEventHandler, RefObject, SetStateAction } from "react"

import { Messages } from "./message";
import { MessageTextarea } from "./message-textarea";

type ChoosedChatProps = {
  chat: Chat,
  messages: Message[],
  onSubmit: FormEventHandler<HTMLFormElement>,
  users: Record<string, User>;
  setText: (text: SetStateAction<string>) => void,
  textareaRef: RefObject<HTMLTextAreaElement|null>;
  messagesRef: RefObject<HTMLDivElement | null>;
}

export const ChoosedChat = ({
  chat,
  messages,
  users,
  onSubmit,
  setText,
  textareaRef,
  messagesRef
}: ChoosedChatProps) => {
  return (
    <>
      <div className="bg-(--bg-smooth) rounded-b-lg py-2 px-4">
        <div className="flex flex-col">
          <h5>{chat.name}</h5>
          <span className="text-mini">
            {chat.members.length} members
          </span>
        </div>
      </div>
    
      <div
        className="grid auto-rows-max gap-2 h-full overflow-y-auto p-2"
        ref={messagesRef}
      >
        <Messages messages={messages} users={users} />
      </div>
      <MessageTextarea
        textareaRef={textareaRef}
        onSubmit={onSubmit}
        setText={setText}
      />
    </>
  )
}