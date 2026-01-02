"use client";

import { getUser } from "@/api/get-user";
import { Button } from "@/ui/button.ui";
import { useEffect, useRef, useState } from "react";

import { io, Socket } from "socket.io-client";

const Page = () => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [user, setUser] = useState<{
    username: string;
    nickname: string;
  } | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const websocket = io("http://localhost:8080");

    (async () => {
      const u = await getUser();

      setUser(u);
      setSocket(websocket);

      setLoaded(true);
    })();

    websocket.on("receive_message", (message) => {
      console.log("receive", message);
    });

    return () => {
      websocket.removeListener("receive_message");
      websocket.disconnect();
      websocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (!ref.current || !socket || !user) {
      return;
    }

    socket.emit("send_message", {
      user: user,
      text: ref.current.value.trim(),
    });
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
    </div>
  );
};

export default Page;
