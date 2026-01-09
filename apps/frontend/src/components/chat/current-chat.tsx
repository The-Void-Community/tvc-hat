import { useChat } from "@/contexts/chat.context";

import { Messages } from "./message";
import { MessageTextarea } from "./message-textarea";

export const CurrentChat = () => {
  const { currentChat: chat } = useChat();
  if (!chat) {
    return <></>;
  }

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

      <Messages />

      <div className="px-2 py-1 bg-(--bg-card) rounded-b-lg">
        <MessageTextarea />
      </div>
    </>
  );
};
