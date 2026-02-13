"use client"

import type { FormEvent } from "react";
import { Button, Input } from "tvuikit";

import { register } from "@/api/register";

import { useRouter } from "next/navigation";
import { useNotifications } from "tvuikit";

const Page = () => {
  const router = useRouter();
  const { NotificationComponent, notificate } = useNotifications({
    duration: 3000
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { nickname, username, password } = Object.fromEntries(new FormData(event.currentTarget).entries());

    register({
      password: password.toString()
    }, {
      nickname: nickname ? nickname.toString() : undefined,
      username: username.toString(),
    }).then(data => {
      if (data.type === "error") {
        return notificate("Ошибка! " + data.message);
      }

      if (data.type === "successed") {
        router.push("/chat");
        return;
      }
    });
  }

  return (
    <div className="main-full flex-center">
      <div className="h-full py-4 px-8">
        <form
          className={[
            "h-full bg-(--bg-smooth) rounded-xl py-2 px-4",
            "flex flex-col gap-4 items-center justify-evenly"
          ].join(" ")}
          onSubmit={handleSubmit}
        >
          <Input name="nickname" id="nickname" placeholder="Ваш никнейм" />
          <Input name="username" id="username" required placeholder="Ваше имя пользователя" />
          <Input name="password" id="password" required placeholder="Ваш пароль" />

          <Button type="submit">
            Зарегистрироваться
          </Button>

          {NotificationComponent}
        </form>
      </div>
    </div>
  )
}

export default Page;
