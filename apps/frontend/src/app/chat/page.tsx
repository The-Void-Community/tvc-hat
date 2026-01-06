"use client";

import type { Chat, Message, User } from "@/types";

import { getToken } from "@/api/get-token";
import { getMe, getUser } from "@/api/get-user";
import { getChats } from "@/api/get-chats";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

import { Button, Textarea } from "tvuikit";
import { HiPaperAirplane } from "react-icons/hi";
import Image from "next/image";

import { Wrapper } from "@/components/wrapper.component";

const Page = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [choosedChat, setChoosedChat] = useState<Chat | null>(null);
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const gettedToken = await getToken();
      const gettedUser = await getMe();

      if (!gettedUser) {
        return;
      }

      const gettedChats = await getChats(gettedUser.chats);

      setUser(gettedUser);
      setToken(gettedToken);
      setChats(gettedChats || []);
      setUsers((previous) => ({ ...previous, [gettedUser.id]: gettedUser }));

      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const websocket = io("http://localhost:8080/chat", {
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
    });

    websocket.on("receive_message", async (message) => {
      const messageUser = await getUser(message.user.id);
      if (!messageUser) {
        return;
      }

      setUsers((previous) => ({ ...previous, [messageUser.id]: messageUser }));
      setMessages((previous) => [
        ...previous,
        {
          chatId: message.chatId,
          text: message.text,
          senderId: message.user.id,
        } as Message,
      ]);
    });

    (() => {
      setSocket(websocket);
    })();

    return () => {
      websocket.emit("rooms_disconnect", chats.map(chat => chat.id));

      websocket.removeListener("receive_message");
      websocket.disconnect();
      websocket.close();
    };
  }, [chats, token]);

  const sendMessage = useCallback(() => {
    if (!textareaRef.current || !socket || !user || !choosedChat) {
      return;
    }

    const message = text.trim();
    if (message === "") {
      return;
    }

    socket.emit("send_message", {
      user: user,
      chatId: choosedChat.id,
      text: message,
    });

    textareaRef.current.value = ""
  }, [socket, user, choosedChat, text]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage();
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.emit("rooms_connect", chats.map(chat => chat.id));
  }, [chats, socket]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "enter") {
        if (event.ctrlKey || event.shiftKey) {
          return;
        }

        event.preventDefault();
        sendMessage();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [sendMessage]);

  if (!user || !socket || !loaded) {
    return <div>loading...</div>;
  }

  return (
    <Wrapper className="gap-4">
      <nav
        className={[
          "bg-(--bg-card) rounded-lg main-full overflow-y-auto overflow-x-hidden w-100",
          "flex flex-col",
        ].join(" ")}
      >
        {chats.map((chat, i) => (
          <div
            key={i}
            onClick={() => {
              setChoosedChat(chat);
            }}
            className={[
              "w-full p-2 flex flex-row gap-2 cursor-pointer duration-200",
              "hover:bg-(--bg-component)",
            ].join(" ")}
          >
            <Image
              height={48}
              width={48}
              src={chat.icon || "/hat.png"}
              alt="icon"
              className="rounded-[100%]"
            />

            <div className="w-full flex flex-col">
              <span>
                <strong>{chat.name}</strong>
              </span>
              <span className="max-w-50 truncate">
                {chat.messages[chat.messages.length - 1]}
              </span>
            </div>
          </div>
        ))}
      </nav>

      <div
        className={[
          "bg-(--bg-card) rounded-lg main-full w-full",
          "flex flex-col",
        ].join(" ")}
      >
        {choosedChat && (
          <>
            <div className="bg-(--bg-smooth) rounded-b-lg py-2 px-4">
              <div className="flex flex-col">
                <h5>{choosedChat.name}</h5>
                <span className="text-mini">{choosedChat.members.length} members</span>
              </div>
            </div>

            <div className="flex flex-col justify-end gap-2 h-full p-2">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={[
                    "bg-(--bg-component) w-fit py-1 px-4 rounded-lg",
                    "flex flex-col",
                  ].join(" ")}
                >
                  <span className="text-red-300">
                    {users[message.senderId].nickname}
                  </span>
                  <span>{message.text}</span>
                </div>
              ))}
            </div>
            <form
              id="send-message"
              className="send-message-form bg-(--bg-card) flex flex-row rounded-t-lg"
              onSubmit={handleSubmit}
            >
              <Textarea
                ref={textareaRef}
                onChange={(e) => setText(e.currentTarget.value)}
                placeholder="Ваше сообщение..."
                className="send-message-form w-full max-w-none resize-none bg-[00000000] rounded-t-lg"
              />
              <Button
                type="submit"
                className="send-message-form cursor-pointer"
                overwriteClassName
              >
                <HiPaperAirplane size={48} className="rotate-90" />
              </Button>
            </form>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default Page;
