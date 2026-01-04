"use client";

import { getUser } from "@/api/get-user";
import { use, useEffect, useState } from "react";

import { Button } from "tvuikit";

type Props = {
  query: Promise<{ token?: string }>;
};

export default function Home({ query }: Props) {
  const [user, setUser] = useState<{ username: string } | null>(null);

  const { token } = use(query);

  useEffect(() => {
    (async () => {
      const u = await getUser(token ? token : null);
      setUser(u);
    })();
  }, [token]);

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
          <Button onClick={() => (window.location.href = "/chat")}>
            Перейти к чату, {user.username}
          </Button>
        </div>
      )}
    </div>
  );
}
