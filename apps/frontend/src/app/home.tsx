"use client";

import { getMe } from "@/api/get-user";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "tvuikit";
import { API_AUTH_URL } from "@/constants/url";

type Props = {
  query: Promise<{ token?: string }>;
};

const Home = ({ query }: Props) => {
  const router = useRouter();

  const [loaded, setLoaded] = useState<boolean>(false);

  const { token } = use(query);

  useEffect(() => {
    (async () => {
      const u = await getMe(token ? token : null);
      if (u) {
        router.push("/chat");
      }

      setLoaded(true);
    })().then(() => {});
  }, [router, token]);

  if (!loaded) {
    return <>Loading...</>;
  }

  return (
    <div className="main-full flex-center">
      <div className="bg-(--bg-card) w-fit flex flex-col gap-4 justify-center items-center py-2 px-4 rounded-lg">
        <span>Добро пожаловать в Hat! — приложения для чаттинга</span>

        <Button
          className="bg-(--bg-smooth)"
          onClick={() => {
            window.location.href = API_AUTH_URL.href;
          }}
        >
          Войти с помощью Google
        </Button>
      </div>
    </div>
  );
};

export default Home;
