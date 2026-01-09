"use client"

import type { Socket } from "socket.io-client";
import type { Chat, Message } from "@/types";

import { io } from "socket.io-client";

import { useCallback, useEffect, useState } from "react"

import { getToken } from "@/api/get-token";
import { Gateways } from "@/enums";

export type EmitMessageFunction = (message: {
  chatId: string;
  text: string;
}, callback: (message: Message | null) => void) => void;

export type EmitMessageParameters = Parameters<EmitMessageFunction>;

export type UseWebsocketProps = {
  onRecieveMessage: (message: Message) => unknown;
  chats: Map<string, Chat>;
}

export const useWebsocket = ({ onRecieveMessage, chats }: UseWebsocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        return;
      }

      const websocket = io("http://localhost:8080/chat", {
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
    }
  }, [onRecieveMessage, socket]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.emit(Gateways.connectMany, Array.from(chats.keys()));

    return () => {
      socket.emit(Gateways.disconnectAll);
      socket.disconnect();
      socket.close();
    };
  }, [socket, chats, onRecieveMessage]);

  const emitMessage = useCallback((...[message, callback]: EmitMessageParameters) => {
    if (!socket) {
      return;
    }

    return socket.emit(Gateways.sendMessage, message, callback);
  }, [socket]);

  return {
    socket,
    emitMessage
  }
}