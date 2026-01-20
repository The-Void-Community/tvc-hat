"use client";

import type { JSX } from "react";
import type { ButtonProps } from "tvuikit";

import { ChatsNavigation } from "./chat";
import { ChatType } from "@/enums";

export type ChatSidebarProps = {
  UserFindTrigger: (props: Partial<ButtonProps>) => JSX.Element;
};

export const ChatSidebar = ({ UserFindTrigger }: ChatSidebarProps) => {
  return (
    <nav className="flex flex-col w-48 h-full bg-(--bg-card) rounded-lg overflow-hidden">
      <div className="px-2 py-2">
        <UserFindTrigger className="w-full" />
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto px-2 py-1 gap-1">
        <ChatsNavigation type={ChatType.self} full />
        <hr className="w-[60%] text-(--fg-mini-text)" />
        <ChatsNavigation type={ChatType.direct} full />
      </div>
    </nav>
  );
};
