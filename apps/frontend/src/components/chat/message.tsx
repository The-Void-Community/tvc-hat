import type { Message as MessageType, User } from "@/types"

type MessageProps = {
  message: MessageType,
  users: Record<string, User>;
}

export const Message = ({
  message,
  users
}: MessageProps) => {
  return (
    <div
      key={message.id}
      className={[
        "bg-(--bg-component) w-fit h-fit py-1 px-4 rounded-lg",
        "flex flex-col",
      ].join(" ")}
    >
      <span className="text-red-300">
        {users[message.senderId].nickname}
      </span>
      <span>{message.text}</span>
    </div>
  )
}

type MessagesProps = {
  messages: MessageType[];
  users: Record<string, User>
}

export const Messages = ({
  messages,
  users
}: MessagesProps) => {
  return messages.map((message, i) => (
    <Message key={message?.id || i} message={message} users={users} />
  ))
}