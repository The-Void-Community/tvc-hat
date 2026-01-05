"use client";

import type { Chat, User } from "@/types";

import { getToken } from "@/api/get-token";
import { getUser } from "@/api/get-user";
import { useEffect, useRef, useState } from "react";

import { Button, Input, Textarea } from "tvuikit";

import { io, Socket } from "socket.io-client";
import { Wrapper } from "@/components/wrapper.component";
import Image from "next/image";

const Page = () => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const gettedToken = await getToken();
      const gettedUser = await getUser();

      setUser(gettedUser);
      setToken(gettedToken);

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

    websocket.on("receive_message", (message) => {
      console.log("receive", message);
    });

    (() => {
      setSocket(websocket);
    })();

    return () => {
      websocket.removeListener("receive_message");
      websocket.disconnect();
      websocket.close();
    };
  }, [token]);

  const sendMessage = () => {
    if (!ref.current || !inputRef.current || !socket || !user) {
      return;
    }

    socket.emit("send_message", {
      user: user,
      chat: inputRef.current.value,
      text: ref.current.value.trim(),
    });
  };

  const chooseRoom = () => {
    if (!inputRef.current || !socket || !user) {
      return;
    }

    socket.emit("room_connect", inputRef.current.value);
  };

  if (!user || !socket || !loaded) {
    return <div>loading...</div>;
  }

  const chats: {
    icon: string;
    name: string;
    messages: string[];
  }[] = [
    {
      icon: "/hat.png",
      name: "Hat",
      messages: ["Hello!"],
    },
    {
      icon: "/AVATAR--fockusty-2--style-meow.png",
      name: "FOCKUSTY",
      messages: ["I'm fockusty, are you?"],
    },
    {
      icon: "/TheVoidAvatarSite.png",
      name: "The Void Community",
      messages: ["It's beutiful day for create a lot of projects!"],
    },
  ];

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
            className={[
              "w-full p-2 flex flex-row gap-2 cursor-pointer duration-200",
              "hover:bg-(--bg-component)",
            ].join(" ")}
          >
            <Image
              height={48}
              width={48}
              src={chat.icon}
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

      <div className="bg-(--bg-card) rounded-lg main-full w-full"></div>
    </Wrapper>
  );
};

export default Page;
