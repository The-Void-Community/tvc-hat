import type { Message as MessageType, User } from "@/types";
import { useChat } from "@/contexts/chat.context";

import { memo, useMemo } from "react";
import { CircleProgress } from "tvuikit";

import { IconOrAvatar } from "./icon";
import { useDateFormatters } from "@/hooks/use-date-formatters.hook";

export type MessageProps = {
  message: MessageType & {
    showHeader?: boolean;
    pending?: boolean;
    failed?: boolean;
    dateString?: string;
  };
  sender?: User | undefined;
};

const MessageInner = ({ message, sender }: MessageProps) => {
  const { retrySendMessage } = useChat();
  const { formatTime } = useDateFormatters();

  const time = useMemo(() => {
    return formatTime(new Date(message.createdAt));
  }, [message.createdAt, formatTime]);

  const showHeader = !!message.showHeader;

  return (
    <div
      className={[
        "flex items-start gap-2 px-4 rounded-md",
        "hover:bg-(--bg-component) duration-100",
        showHeader ? "py-1 mt-2" : "",
      ].join(" ")}
    >
      {showHeader ? (
        <>
          <IconOrAvatar entity={sender} size={48} />
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-1">
              <span className="font-semibold">
                {sender?.nickname || sender?.username || "—"}
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
      ) : (
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
      )}
    </div>
  );
};

export const Message = memo(MessageInner, (previous, current) => {
  if (previous.message.id !== current.message.id) return false;
  if (previous.message.text !== current.message.text) return false;
  if (previous.message.createdAt !== current.message.createdAt) return false;
  if (!!previous.message.showHeader !== !!current.message.showHeader) return false;

  const prevSender = previous.sender;
  const nextSender = current.sender;
  if (prevSender?.id !== nextSender?.id) return false;
  if (prevSender?.nickname !== nextSender?.nickname) return false;
  if (prevSender?.username !== nextSender?.username) return false;

  return true;
});