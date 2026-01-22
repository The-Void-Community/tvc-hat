import type {
  FrontendMessage,
  MaybeFrontendMessage,
  MessageBody,
} from "@/types";
import type { EmitMessageFunction } from "@/features/client/use-websocket.hook";

import { useCallback } from "react";
import { v4 as uuid } from "uuid";

import { changeFrontendMessageToMessageBody } from "@/utils/delete-properties-from.utils";
import { revalidateMessages } from "@/api/get-messages";

import { usePendingMessages } from "./use-pending-messages.hook";
import { useMessagesState } from "./use-messages-state.hook";

export type UseMessageSenderProps = {
  emitMessage: EmitMessageFunction;
  myId: string | null;
  state: ReturnType<typeof useMessagesState>;
};

export const useMessageSender = ({
  emitMessage,
  myId,
  state,
}: UseMessageSenderProps) => {
  const {
    store: {
      markMessageAsFailed: markAsFailed,
      addMessages,
      entities,
      updateOneMessage,
    },
  } = state;

  const { createPending, clearPending, pendingRef: pendingMessages } = usePendingMessages({
    onTimeout: markAsFailed,
  });

  const trySendMessage = useCallback(
    (message: MaybeFrontendMessage) => {
      const messageBody = changeFrontendMessageToMessageBody(message);
      createPending(message.id, [message]);

      try {
        return emitMessage(messageBody, async (serverMessage) => {
          clearPending(message.id);

          if (!serverMessage) {
            markAsFailed(message);
            return;
          }

          updateOneMessage(serverMessage);
          await revalidateMessages(messageBody.chatId);
        });
      } catch (error) {
        console.error(error);
        clearPending(message.id);
        markAsFailed(message);
      }
    },
    [createPending, emitMessage, clearPending, updateOneMessage, markAsFailed],
  );

  const retrySendMessage = useCallback(
    (id: string) => {
      const message = entities[id];
      if (!message) return;

      return trySendMessage(message);
    },
    [entities, trySendMessage],
  );

  const sendMessage = useCallback(
    (text: string, chatId: string) => {
      if (!myId) return;

      const trimmedText = text.trim();
      if (!trimmedText) return;

      const frontendMessageId = uuid();
      const messageBody: MessageBody = { chatId, text: trimmedText };
      const frontendMessage: FrontendMessage = {
        ...messageBody,
        id: frontendMessageId,
        senderId: myId,
        createdAt: new Date(),
        updatedAt: new Date(),
        pending: true,
        failed: false,
      };

      addMessages([frontendMessage]);
      trySendMessage(frontendMessage);
    },
    [addMessages, myId, trySendMessage],
  );

  const onSubmit = useCallback((chatId: string|null, toggleScrollToBottom: (newState?: boolean | undefined) => void) => {
    return (text: string) => {
      if (!chatId) {
        return;
      }

      sendMessage(text, chatId);
      toggleScrollToBottom(true);
    }
  }, [sendMessage])

  return {
    sendMessage,
    retrySendMessage,
    onSubmit,
    pendingMessages
  };
};
