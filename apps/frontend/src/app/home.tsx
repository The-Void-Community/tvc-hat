"use client";

import { getUser } from "@/api/get-user";
import { Button } from "@/ui/button.ui";
import { use, useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";

// const socket = io('http://localhost:8080');

type Props = {
  query: Promise<{ token?: string }>
}

export default function Home({ query }: Props) {
  const [user, setUser] = useState<{ username: string } | null>(null);
  // const ref = useRef<HTMLTextAreaElement | null>(null);

  const { token } = use(query);

  useEffect(() => {
    (async () => {
      const u = await getUser(token ? token : null);
      console.log(u);
      setUser(u);
    })();
  }, [token]);

  // const sendMessage = () => {
  //   if (!ref.current || !socket) {
  //     return;
  //   }

  //   socket.send("send_message", JSON.stringify({
  //     user: "",
  //     text: ref.current.value.trim()
  //   }));
  // }

  return (
    <div className="min-h-full flex flex-col gap-4 justify-center content-center flex-wrap">
      <Button
        onClick={() => {
          window.location.href = "http://localhost:8080/api/v1/auth/google";
        }}
      >
        Authenticate by Google
      </Button>

      {user && (
        <div>
          <Button onClick={() => window.location.href = "/chat"}>
            Перейти к чату, {user.username}
          </Button>
        </div>
      )}

      {/* <textarea ref={ref} className="bg-(--bg-card) py-2 px-4 rounded-lg" name="" id="" placeholder="your message..." /> */}
      {/* <Button onClick={sendMessage}>Send</Button> */}
    </div>
  );
}
