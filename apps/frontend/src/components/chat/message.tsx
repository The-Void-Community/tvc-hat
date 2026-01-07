import type { Message as MessageType, User } from "@/types";
import { IconOrAvatar } from "./icon";

type MessageProps = {
  message: MessageType;
  users: Record<string, User>;
};

export const Message = ({ message, users }: MessageProps) => {
  const sender = users[message.senderId];
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={[
      "flex items-start gap-2 px-4 py-2 rounded-md duration-100",
      "hover:bg-(--bg-component)"
    ].join(" ")}>
      <IconOrAvatar entity={sender} size={48} />

      <div className="flex flex-col w-full">
        <div className="flex items-center gap-1">
          <span className="font-semibold">{sender.nickname}</span>
          <span className="text-mini">{time}</span>
        </div>

        <div className="rounded-lg w-full">
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
