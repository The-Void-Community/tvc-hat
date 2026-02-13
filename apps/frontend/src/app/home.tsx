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
    })();
  }, [router, token]);

  if (!loaded) {
    return <>Loading...</>;
  }

  return (
    <div className="main-full flex-center">
      <div className="bg-(--bg-card) w-fit flex flex-col gap-4 justify-center items-center py-2 px-4 rounded-lg">
        <span>Добро пожаловать в Hat! — приложения для чаттинга</span>

        <Button
          tabIndex={2}
          className="bg-(--bg-smooth)"
          onClick={() => {
            window.location.href = API_AUTH_URL.href;
          }}
        >
          Войти с помощью Google
        </Button>
        <span
          tabIndex={1}
          className="py-1 px-2 cursor-pointer"
          onClick={() => {
            router.push("/register");
          }}
        >
          Зарегистрироваться
        </span>
      </div>
    </div>
  );
};

export default Home;
