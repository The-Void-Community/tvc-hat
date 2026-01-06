"use client";

import type { Chat, Message, User } from "@/types";

import { getToken } from "@/api/get-token";
import { getMe, getUser } from "@/api/get-user";
import { getChat, getChats } from "@/api/get-chats";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

import { Wrapper } from "@/components/wrapper.component";
import { getMessages } from "@/api/get-messages";
import { ChatsNavigation } from "@/components/chat/chat";
import { ChoosedChat } from "@/components/chat/choosed-chat";

type Props = {
  chatId?: string;
};

const Chat = ({ chatId }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [choosedChat, setChoosedChat] = useState<Chat | null>(null);
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  const addMessages = (messages: Message[], to: "start" | "end" = "start") => {
    return setMessages((previous) => {
      const newMessages = [
        ...(to === "end" ? messages : []),
        ...previous,
        ...(to === "start" ? messages : []),
      ];

      return newMessages;
    });
  };

  useEffect(() => {
    (async () => {
      const gettedToken = await getToken();
      const gettedChat = chatId ? await getChat(chatId) : null;

      const gettedUser = await getMe();
      if (!gettedUser) {
        return;
      }

      const gettedChats = await getChats(gettedUser.chats);

      setUser(gettedUser);
      setToken(gettedToken);
      setChats(gettedChats || []);
      setChoosedChat(gettedChat);
      setUsers((previous) => ({ ...previous, [gettedUser.id]: gettedUser }));

      setLoaded(true);
    })();
  }, [chatId]);

  useEffect(() => {
    if (!choosedChat) {
      return;
    }

    (async () => {
      const gettedMessages = (
        (await getMessages({
          chatId: choosedChat.id,
          sort: "desc",
        })) || []
      ).reverse();

      addMessages(gettedMessages);
    })();
  }, [choosedChat]);

  useEffect(() => {
    if (!messagesRef.current) {
      return;
    }

    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "instant",
    });
  }, [messagesRef]);

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    const websocket = io("http://localhost:8080/chat", {
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
    });

    websocket.on("receive_message", async (message: Message) => {
      if (message.senderId === user.id) {
        return;
      }

      const messageUser = await getUser(message.senderId);
      if (!messageUser) {
        return;
      }

      setUsers((previous) => ({ ...previous, [messageUser.id]: messageUser }));
      addMessages([message]);
    });

    (() => {
      setSocket(websocket);
    })();
  }, [chats, token, user]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.emit(
      "rooms_connect",
      chats.map((chat) => chat.id),
    );

    return () => {
      socket.emit(
        "rooms_disconnect",
        chats.map((chat) => chat.id),
      );

      socket.removeListener("receive_message");
      socket.disconnect();
      socket.close();
    };
  }, [chats, socket]);

  const sendMessage = useCallback(() => {
    if (!textareaRef.current || !socket || !user || !choosedChat) {
      return;
    }

    const message = text.trim();
    if (message === "") {
      return;
    }

    const messageBody = {
      senderId: user.id,
      chatId: choosedChat.id,
      text: message,
    } as Message;

    addMessages([
      {
        ...messageBody,
        createdAt: new Date(),
      },
    ]);
    socket.emit("send_message", messageBody);

    textareaRef.current.value = "";
  }, [socket, user, choosedChat, text]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage();
  };

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

  useEffect(() => {
    if (!messagesRef.current) {
      return;
    }

    messagesRef.current.scroll({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

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
        <ChatsNavigation chats={chats} />
      </nav>

      <div
        className={[
          "bg-(--bg-card) rounded-lg main-full w-full",
          "flex flex-col",
        ].join(" ")}
      >
        {choosedChat && (
          <ChoosedChat
            chat={choosedChat}
            messages={messages}
            onSubmit={onSubmit}
            setText={setText}
            textareaRef={textareaRef}
            messagesRef={messagesRef}
            users={users}
          />
        )}
      </div>
    </Wrapper>
  );
};

export default Chat;
