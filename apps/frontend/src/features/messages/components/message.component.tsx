import type { FrontendMessage, User } from "@/types";

import { useMessagesStore } from "../hooks/use-messages-store.hook";
import { useDateFormatters } from "@/hooks/use-date-formatters.hook";
import { IconOrAvatar } from "@/components/chat/icon";

import { memo } from "react";
import { CircleProgress } from "tvuikit";

export type MessageProps = {
  message: FrontendMessage;
  showHeader?: boolean;
  sender: User;
};

export type MessageInnerWithHeaderProps = MessageProps & {
  time: string;
  retrySendMessage: (id: string) => void;
};

const MessageInnerWithHeader = ({
  message,
  sender,
  time,
  retrySendMessage,
}: MessageInnerWithHeaderProps) => {
  return (
    <>
      <IconOrAvatar entity={sender} size={48} />
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-1">
          <span className="font-semibold">
            {sender.nickname || sender.username}
          </span>
          <span className="text-mini flex items-center gap-2">
            <span>{time}</span>
            {message.pending && <CircleProgress size={20} />}
            {message.failed && (
              <button
                onClick={() => retrySendMessage(message.id)}
                className="text-red-400 text-mini underline"
                aria-label="Retry send"
              >
                Повторить
              </button>
            )}
          </span>
        </div>
        <span>{message.text}</span>
      </div>
    </>
  );
};

export type MessageInnerWithoutHeaderProps = {
  message: FrontendMessage;
};
export const MessageInnerWithoutHeader = ({
  message,
}: MessageInnerWithoutHeaderProps) => {
  return (
    <div className="flex flex-col w-full ml-[3.5em]">
      {message.pending ? (
        <div className="flex flex-row items-center gap-1">
          <span>{message.text}</span>
          <CircleProgress size={12} />
        </div>
      ) : (
        <span>{message.text}</span>
      )}
    </div>
  );
};

export const MessageInner = ({ message, sender, showHeader }: MessageProps) => {
  const { setOneMessage } = useMessagesStore();
  const { formatTime } = useDateFormatters();

  const time = formatTime(new Date(message.createdAt));
  const retrySendMessage = () => {
    setOneMessage(message, { pending: true, failed: false });
  };

  if (showHeader) {
    return (
      <MessageInnerWithHeader
        message={message}
        sender={sender}
        time={time}
        retrySendMessage={retrySendMessage}
      />
    );
  }

  return <MessageInnerWithoutHeader message={message} />;
};

export const Message = memo(MessageInner, (previous, next) => {
  return (
    previous.message.id === next.message.id &&
    previous.message.text === next.message.text &&
    previous.message.pending === next.message.pending &&
    previous.message.failed === next.message.failed &&
    previous.showHeader === next.showHeader &&
    previous.sender.id === next.sender.id &&
    previous.sender.nickname === next.sender.nickname &&
    previous.sender.username === next.sender.username
  );
});
