import type { MaybeFrontendMessagePartial, User } from "@/types";

import { memo } from "react";
import { CircleProgress } from "tvuikit";

import { IconOrAvatar } from "@/components/icon";

export type MessageProps = {
  message: MaybeFrontendMessagePartial & { showHeader: boolean };
  sender: User;
  retrySendMessage?: (id: string) => void;
};

const MessageInner = ({ message, sender, retrySendMessage }: MessageProps) => {
  const { showHeader } = message;

  return (
    <div className={[
        "flex items-start gap-2 px-4 rounded-md",
        "hover:bg-(--bg-component) duration-100",
        showHeader ? "py-1" : "ml-[3.5em]",
      ].join(" ")}>
      {showHeader && (
        <IconOrAvatar entity={sender} size={48} />
      )}

      <div className="flex flex-col w-full">
        {showHeader && (
          <div className="flex items-center gap-1">
            <span className="font-semibold">{sender.nickname || sender.username}</span>
            <span className="text-mini flex items-center gap-2">
              <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
              {message.pending && <CircleProgress size={20} />}
              {message.failed && retrySendMessage && (
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
        )}
        <span>{message.text}</span>
      </div>
    </div>
  );
};

export const Message = memo(MessageInner, (previous, next) => {
  return (
    previous.message.id === next.message.id &&
    previous.message.text === next.message.text &&
    previous.message.pending === next.message.pending &&
    previous.message.failed === next.message.failed &&
    previous.message.showHeader === next.message.showHeader
  );
});
