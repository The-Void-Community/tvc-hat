"use client"

import type { Dispatch, FormEvent, SetStateAction } from "react";

import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import { Active, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal } from "tvuikit";
import { AVAILABLE_CHAT_TYPES_TO_CREATE, ChatType, RUSSIAN_NAMES_OF_CHAT_TYPES } from "@/enums";
import { createChat } from "@/api/post-chat";
import { useRouter } from "next/navigation";

type Props = {
  state: [boolean, Dispatch<SetStateAction<boolean>>];
}

export const CreateChatModal = ({ state }: Props) => {
  const router = useRouter();

  const [chatType, setChatType] = useState<ChatType|null>(null);
  const [showed, setShowed] = state;
  const modalId = uuid();

  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => {
      if (!showed) {
        return
      }
      
      if (!event.key) {
        return;
      }

      if (event.key.toLowerCase() === "escape") {
        setShowed(false);
      }
    };
    
    document.addEventListener("keydown", keydownListener);
    return () => {
      document.removeEventListener("keydown", keydownListener);
    }
  }, [setShowed, showed]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const form = new FormData(event.currentTarget);

    const icon = form.get("url");
    const name = form.get("name");
    const chatname = form.get("chatname");

    if (!name || !chatType) {
      return;
    }

    event.preventDefault();
    
    const created = await createChat({
      type: chatType,
      chatname: chatname ? chatname.toString() : null,
      icon: icon ? icon.toString() : null,
      name: name.toString()
    });

    if (created && created.id) {
      router.push(`/chat/${created.id}`);
    } else {
      router.refresh();
    }

    setShowed(false);
  };

  return (
    <Active actived={showed}>
      <Modal
        id={modalId}
        container={document.body}
        className="bg-(--bg-smooth-ce) h-full flex-center"
        onClick={(e) => {
          if ((e.target as HTMLElement)?.id !== modalId) {
            return;
          };
  
          setShowed(false);
        }}
      >
        <div className="bg-(--bg-card) h-150 w-100 rounded-2xl">
          <form
            id="create-chat"
            name="create-chat"
            className="create-chat flex flex-col gap-4 items-center justify-center h-full"
            onSubmit={onSubmit}
          >
            <Input name="url" className="create-chat" placeholder="URL иконки" />
            <Input name="name" className="create-chat" placeholder="Название чата" />
            <Input name="chatname" className="create-chat" placeholder="Уникальное имя чата" />
            <Dropdown>
              <DropdownTrigger type="button">
                <span>
                  {chatType ? `Тип чата: ${RUSSIAN_NAMES_OF_CHAT_TYPES[chatType]}, выбрать другой?` : "Выбрать тип чата"}
                </span>
              </DropdownTrigger>
              <DropdownMenu>
                {AVAILABLE_CHAT_TYPES_TO_CREATE.map((type, i) => (
                  <DropdownItem
                    key={i}
                    onClick={() => {
                      setChatType(type);
                    }}
                  >
                    <span>
                      {RUSSIAN_NAMES_OF_CHAT_TYPES[type]}
                    </span>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button type="submit" variant="primary">
              Создать
            </Button>
          </form>
        </div>
      </Modal>
    </Active>
  )
}