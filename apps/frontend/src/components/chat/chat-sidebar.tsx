"use client";

import type { JSX } from "react";
import type { ButtonProps } from "tvuikit";

import { ChatsNavigation } from "./chat";
import { ChatType } from "@/enums";

export type ChatSidebarProps = {
  UserFindTrigger: ({
    children,
    onClick,
    ...props
  }: Partial<ButtonProps>) => JSX.Element;
};

export const ChatSidebar = ({ UserFindTrigger }: ChatSidebarProps) => {
  return (
    <nav className="flex flex-col items-center gap-1 bg-(--bg-card) rounded-lg w-48">
      <UserFindTrigger className="mt-2" />

      <ChatsNavigation type={ChatType.self} full />
      <hr className="w-[60%] text-(--fg-mini-text)" />
      <ChatsNavigation type={ChatType.direct} full />
    </nav>
  );
};
