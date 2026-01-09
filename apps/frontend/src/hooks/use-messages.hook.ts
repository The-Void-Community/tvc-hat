import type { FrontendMessage, MaybeFrontendMessage, MessageBody } from "@/types";
import type { EmitMessageFunction } from "./use-websocket.hook";

import { useCallback, useRef } from "react"
import { v4 as uuid } from "uuid";

import { changeFrontendMessageToMessageBody } from "@/utils/delete-properties-from.utils";
import { useMessagesMap } from "./use-messages-map.hook";
import { useMessagesPending } from "./use-messages-pending.hook";

export type UseMessagesProps = {
  emitMessage: EmitMessageFunction;
  currentChatId: string|null;
  myId: string|null;
}

export const useMessages = ({
  emitMessage,
  currentChatId,
  myId
}: UseMessagesProps) => {
  const messagesRef = useRef<HTMLDivElement | null>(null);
  
  const { messages, addMessages, setOneMessage, updateOneMessage, markMessageAsFailed, setMessages } = useMessagesMap();
  const { pendingRef, createPending, clearPending } = useMessagesPending();

  const trySendMessage = useCallback((message: MaybeFrontendMessage) => {
    const messageBody = changeFrontendMessageToMessageBody(message);
    createPending(message);

    try {
      return emitMessage(messageBody, (serverMessage) => {
        clearPending(message.id);
        
        if (!serverMessage) {
          return markMessageAsFailed(message);
        }
  
        updateOneMessage(message.id, serverMessage);
      });
    } catch (error) {
      console.error(error);
      clearPending(message.id);
      return markMessageAsFailed(message);
    }
  }, [createPending, emitMessage, clearPending, updateOneMessage, markMessageAsFailed]);

  const retrySendMessage = useCallback((id: string) => {
    const message = messages.get(id);
    if (!message) {
      return;
    }

    return trySendMessage(message);
  }, [messages, trySendMessage]);

  const sendMessage = useCallback((text: string) => {
    if (!currentChatId || !myId) {
      return;
    }

    const trimmedText = text.trim();
    if (Boolean(trimmedText)) {
      return;
    }

    const frontendMessageId = uuid();
    const messageBody: MessageBody = {
      chatId: currentChatId,
      text: trimmedText
    };
    const frontendMessage: FrontendMessage = {
      ...messageBody,
      id: frontendMessageId,
      senderId: myId,
      createdAt: new Date(),
      updatedAt: new Date(),
      pending: true,
      failed: false,
    }

    addMessages([frontendMessage]);
    trySendMessage(frontendMessage);
  }, [addMessages, currentChatId, myId, trySendMessage]);

  return {
    addMessages,
    setOneMessage,
    retrySendMessage,
    updateOneMessage,
    markMessageAsFailed,
    clearPendingMessage: clearPending,
    createPendingMessage: createPending,
    setMessages,
    sendMessage,
    messagesRef,
    pendingMessagesRef: pendingRef,
    messages
  }
}