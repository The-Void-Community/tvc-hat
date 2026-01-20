import type { FrontendMessage, User } from "@/types";

import { memo } from "react";
import { CircleProgress } from "tvuikit";

import { IconOrAvatar } from "@/components/icon";

export type MessageProps = {
  message: FrontendMessage;
  sender: User;
  showHeader?: boolean;
  retrySendMessage?: (id: string) => void;
};

const MessageInner = ({ message, sender, showHeader, retrySendMessage }: MessageProps) => {
  return (
    <div className={`flex ${showHeader ? "flex-row" : "flex-col ml-[3.5em]"}`}>
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
    previous.showHeader === next.showHeader
  );
});
