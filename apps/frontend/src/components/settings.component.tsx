"use client"

import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import type { User } from "@/types";
import { useRef, useState } from "react";

import { Button, CircleProgress, Input } from "tvuikit";
import { HiUser, HiPencilAlt, HiX, HiCheck } from "react-icons/hi"

import { IconOrAvatar } from "./chat/icon";

import { useChat } from "@/contexts/chat.context";
import { patchMe } from "@/api/patch-user";

type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
type NonNullable<T extends object> = {
  [P in keyof T]: Exclude<T[P], null>;
}

type OnlyStringProperties<T extends object> = {
  [P in keyof T]: T[P] extends string ? P : never
}[keyof T];

type EditableUserSettingsPropetryItemProps = Omit<DivProps, "property"> & {
  label: ReactNode,
  property: OnlyStringProperties<Required<NonNullable<User>>>;
  children: string
}

const EditableUserSettingsPropetryItem = ({
  children,
  label,
  property,
  ...props
}: EditableUserSettingsPropetryItemProps) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { setUser, addUser } = useChat();

  const handleSubmit = async () => {
    if (!inputRef.current) {
      return;
    }

    const { value } = inputRef.current;
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }

    setPending(true);
    const newUser = await patchMe({ [property]: value })
    if (!newUser) {
      return setPending(false);
    }

    setUser(newUser);
    addUser(newUser.id, newUser);

    setPending(false);
  }

  const whenNotPending = !pending && (
    <>
      {!editing && <HiPencilAlt className="cursor-pointer" size={24} onClick={() => setEditing(true)}/>}
      {editing && <HiCheck className="cursor-pointer" size={24} onClick={() => {
        setEditing(false);
        handleSubmit();
      }} />}
      {editing && <HiX className="cursor-pointer" size={24} onClick={() => setEditing(false)} />}
    </>
  );

  const whenPending = pending && (
    <CircleProgress size={24} />
  )

  return (
    <div {...props}>
      <span>{label}:</span>
      <div className="flex gap-2 items-center">
        <div className="bg-(--bg-smooth-ce) w-fit h-fit py-1 px-2 rounded-md">
          {
            editing
              ? <Input
                  ref={inputRef}
                  defaultValue={children}
                  className="bg-[0]"
                />
              : children
          }
        </div>
        {whenPending}
        {whenNotPending}
      </div>
    </div>
  )
}

type UserSettingsPropetryItemProps = DivProps & {
  label: ReactNode;
}

const UserSettingsPropetryItem = ({ children, label, ...props }: UserSettingsPropetryItemProps) => {
  return (
    <div {...props}>
      <span>{label}:</span>
      <div className="bg-(--bg-smooth-ce) w-fit h-fit py-1 px-2 rounded-md">
        {children}
      </div>
    </div>
  )
}

const UserSettings = () => {
  const Navigation = () => {
    return (
      <>
        <HiUser size={24} />
        <span>Аккаунт</span>
      </>
    )
  }
  
  const Component = () => {
    const { me } = useChat();

    return (
      <div>
        <div className="flex gap-2 items-center">
          <IconOrAvatar entity={me} />
          <span>{me.nickname}</span>
        </div>

        <div className="flex flex-col gap-2">
          <EditableUserSettingsPropetryItem
            label="Отображаемое имя"
            property="nickname"
          >
            {me.nickname}
          </EditableUserSettingsPropetryItem>
          <EditableUserSettingsPropetryItem
            label="Имя пользователя"
            property="username"
          >
            {me.username}
          </EditableUserSettingsPropetryItem>
          <EditableUserSettingsPropetryItem
            label="URL аватара"
            property="avatar"
          >
            {me.avatar || "Аватара нет"}
          </EditableUserSettingsPropetryItem>
          <EditableUserSettingsPropetryItem label="Описание" property="bio">
            {me.bio || "Описания нет"}
          </EditableUserSettingsPropetryItem>

          <UserSettingsPropetryItem label="ID">
            {me.id}
          </UserSettingsPropetryItem>
          <UserSettingsPropetryItem label="Создан">
            {new Date(me.createdAt).toLocaleString()}
          </UserSettingsPropetryItem>
        </div>
      </div>
    );
  };

  return {
    Navigation,
    Component
  }
}

const SETTINGS_TYPES = {
  "USER": UserSettings()
} as const;

type SettingsKeys = keyof typeof SETTINGS_TYPES;

export const Settings = () => {
  const [ choosedSettings, setChoosedSettings ] = useState<SettingsKeys>("USER");

  return (
    <div className="bg-(--bg-card) h-full w-full rounded-2xl flex">
      <nav className="bg-(--bg-smooth-light) w-60 rounded-2xl py-4 px-2 flex flex-col gap-2">
        {Object.keys(SETTINGS_TYPES).map((key, index) => (
          <Button
            key={index}
            className="flex gap-2 w-full hover:transform-[scale(1.02)] active:transform-[scale(0.95)]"
            onClick={() => setChoosedSettings(key as SettingsKeys)}
          >
            {SETTINGS_TYPES[key as SettingsKeys].Navigation()}
          </Button>
        ))}
      </nav>
      
      <section className="flex-1 py-2 px-4">
        {SETTINGS_TYPES[choosedSettings].Component()}
      </section>
    </div>
  )
}