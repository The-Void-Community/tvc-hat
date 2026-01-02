"use client";

import { getToken } from "@/api/get-token";
import { getUser } from "@/api/get-user";
import { Button } from "@/ui/button.ui";
import { useEffect, useRef, useState } from "react";

import { io, Socket } from "socket.io-client";

const Page = () => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [user, setUser] = useState<{
    username: string;
    nickname: string;
  } | null>(null);
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
        authorization: `Bearer ${token}`
      }
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

  return (
    <div className="min-h-full flex flex-col gap-4 justify-center content-center flex-wrap">
      <span>Привет, {user.nickname}!</span>
      <textarea
        ref={ref}
        className="bg-(--bg-card) py-2 px-4 rounded-lg"
        placeholder="your message..."
      />
      <Button onClick={sendMessage}>Отправить</Button>
      <hr />
      <input
        ref={inputRef}
        className="bg-(--bg-card) py-2 px-4 rounded-lg"
        placeholder="your room..."
        type="text"
      />
      <Button onClick={chooseRoom}>Выбрать команту</Button>
    </div>
  );
};

export default Page;
