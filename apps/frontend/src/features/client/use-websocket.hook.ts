"use client";

import type { Message } from "@/types";
import type { Socket } from "socket.io-client";

import { getToken } from "@/api/get-token";

import { io } from "socket.io-client";
import { useState } from "react";

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
};

export const useWebsocket = ({ onRecieveMessage }: UseWebsocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const initialize = async () => {
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

    websocket.on(Gateways.receiveMessage, onRecieveMessage);
    return () => {
      websocket.removeListener(Gateways.receiveMessage, onRecieveMessage);
    };
  };

  const handleChatConnection = (
    chatId: string,
    type: "disconnect" | "connect",
  ) => {
    if (!socket) {
      return;
    }

    if (type === "connect") {
      socket.emit(Gateways.connect, chatId);
    } else {
      socket.emit(Gateways.disconnect, chatId);
    }
  };

  const connectToChat = (chatId: string) =>
    handleChatConnection(chatId, "connect");
  const disconnectFromChat = (chatId: string) =>
    handleChatConnection(chatId, "disconnect");

  const emitMessage = (...[message, callback]: EmitMessageParameters) => {
    if (!socket) {
      return;
    }

    return socket.emit(Gateways.sendMessage, message, callback);
  };

  return {
    socket,
    initializeWebsocket: initialize,
    emitMessage,
    connectToChat,
    disconnectFromChat,
  };
};
