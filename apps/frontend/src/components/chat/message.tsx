import type { Message as MessageType, User } from "@/types";
import Image from "next/image";

type MessageProps = {
  message: MessageType;
  users: Record<string, User>;
};

export const Message = ({ message, users }: MessageProps) => {
  const sender = users[message.senderId];
  const time = message?.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <div className="flex items-start gap-3">
      <Image
        src={sender?.avatar || "/hat.png"}
        alt={sender?.nickname || "avatar"}
        height={24}
        width={24}
        className="rounded-full"
      />

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{sender?.nickname}</span>
          <span className="text-mini text-muted">{time}</span>
        </div>

        <div className="mt-1 bg-(--bg-component) px-3 py-2 rounded-lg max-w-prose">
          <span>{message.text}</span>
        </div>
      </div>
    </div>
  );
};

type MessagesProps = {
  messages: MessageType[];
  users: Record<string, User>;
};

export const Messages = ({ messages, users }: MessagesProps) => {
  return <>{messages.map((message, i) => (
    <Message key={message?.id || i} message={message} users={users} />
  ))}</>;
};
