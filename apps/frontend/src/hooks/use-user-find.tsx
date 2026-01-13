import type { User } from "@/types";
import type { ReactNode } from "react";

import { useRef, useState } from "react";

import { getUser } from "@/api/get-user";
import { getDirectChatOrCreate } from "@/api/get-chats";

import { useModal } from "./use-modal.hook";
import { Button, ButtonProps, Input } from "tvuikit";

export const enum FindTypes {
  USER = "пользователя",
  CHAT = "чата"
}

export const useUserFind = () => {

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { opened, toggleOpened, Modal } = useModal();
  const [notification, setNotification] = useState<ReactNode>(<></>);

  const findType = FindTypes.USER;

  const Trigger = ({
    children = "Add friend",
    onClick,
    ...props
  }: Partial<ButtonProps>) => {
    return (
      <Button
        onClick={(event) => {
          onClick?.(event);
          setNotification(<></>);
          toggleOpened(true);
        }}
        {...props}
      >
        {children}
      </Button>
    )
  }

  const handleUserFound = (user: User) => {
    getDirectChatOrCreate(user.id).then((chat) => {
      console.log(chat);
    });
  }

  const handleSubmit = () => {
    if (!inputRef.current) {
      return;
    }

    const username = inputRef.current.value.trim();
    if (!username) {
      return setNotification((
        <span className="text-red-500">Введите <strong>корректное</strong> имя пользователя!</span>
      ));
    }

    getUser(`@${username}`).then((user) => {
      if (!user) {
        return setNotification((
          <span className="text-red-500">Пользователь не был найден {":<"}</span>
        ));
      }
        
      handleUserFound(user); 
      return setNotification((
        <span className="text-green-500">Пользователь был найден {":>"}</span>
      ));
    });
  }

  const Component = () => {
    return (
      <Modal className="bg-(--bg-smooth-ce) h-full flex-center">
        <div className="bg-(--bg-card) h-150 w-100 rounded-2xl flex flex-col gap-2 py-4 px-6 items-center">
          <h4>Поиск {findType}</h4>
          <span>Введите имя пользователя:</span>
          <Input ref={inputRef} />
          <Button onClick={handleSubmit}>
            Отправить запрос
          </Button>
          {notification}
        </div>
      </Modal>
    )
  }

  return {
    opened,
    toggleOpened,
    Modal: Component,
    Trigger
  }
};