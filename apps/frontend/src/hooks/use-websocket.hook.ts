"use client";

/**
 * этот файл работает не правильно
 */

import type { Chat, Message } from "@/types";
import type { Socket } from "socket.io-client";

import { getToken } from "@/api/get-token";

import { io } from "socket.io-client";
import { useCallback, useEffect, useRef, useState } from "react";

import { Gateways } from "@/enums";
import { WEBSCOKET_URL } from "@/constants/url";

export type EmitMessageFunction = (
  message: {
    chatId: string;
    text: string;
  },
  callback: (message: Message | null) => void,
) => void;

export type EmitMessageParameters = Parameters<EmitMessageFunction>;

export type UseWebsocketProps = {
  onRecieveMessage: (message: Message) => unknown;
  chats: Map<string, Chat>;
};

export const useWebsocket = ({
  onRecieveMessage,
  chats,
}: UseWebsocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const previousChatsRef = useRef<string[]>([]);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        return;
      }

      const websocket = io(WEBSCOKET_URL.href, {
        extraHeaders: {
          authorization: `Bearer ${token}`,
        },
      });

      setSocket(websocket);
    })();
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(Gateways.receiveMessage, onRecieveMessage);

    return () => {
      socket.removeListener(Gateways.receiveMessage, onRecieveMessage);
    };
  }, [onRecieveMessage, socket]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const chatIds = Array.from(chats.keys());
    const chatIdsString = JSON.stringify(chatIds.sort());
    const previousString = JSON.stringify(previousChatsRef.current.sort());

    if (chatIdsString !== previousString) {
      previousChatsRef.current = chatIds;

      if (previousChatsRef.current.length === 0) {
        socket.emit(Gateways.disconnectAll);
      } else {
        socket.emit(Gateways.connectMany, chatIds);
      }
    }
  }, [socket, chats]);

  const emitMessage = useCallback(
    (...[message, callback]: EmitMessageParameters) => {
      if (!socket) {
        return;
      }

      return socket.emit(Gateways.sendMessage, message, callback);
    },
    [socket],
  );

  return {
    socket,
    emitMessage,
  };
};
