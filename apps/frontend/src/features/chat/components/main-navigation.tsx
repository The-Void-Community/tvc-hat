"use client";

import { useChat } from "@/features/chat/chat.context";

import { HiPlusCircle } from "react-icons/hi";
import { IconOrAvatar } from "@/components/icon";
import { ChatType } from "@/enums";

import { ChatsNavigation } from "./chat";

export const MainNavigation = () => {
  const { sidebarShowed, toggleSidebar, toggleCreateModal } = useChat();

  return (
    <nav
      className={[
        "flex flex-col h-full items-center gap-1 bg-(--bg-card) rounded-lg",
        "transition-all duration-200",
        sidebarShowed ? "w-16" : "w-48",
      ].join(" ")}
    >
      <div className="flex flex-col items-center gap-1">
        <div
          className="px-3 py-2 flex-center cursor-pointer rounded-lg transition-colors hover:bg-(--bg-component)"
          onClick={() => {
            if (!sidebarShowed) toggleSidebar(true);
          }}
        >
          <IconOrAvatar />
        </div>

        <hr className="w-[60%] text-(--fg-mini-text)" />
      </div>

      <div className="flex-1 w-full overflow-y-auto flex flex-col items-center gap-1">
        <ChatsNavigation type={ChatType.group} full={!sidebarShowed} />
      </div>

      <div
        className={[
          "w-full px-3 py-2 flex-center gap-3 cursor-pointer rounded-lg transition-colors",
          "hover:bg-(--bg-component)",
        ].join(" ")}
        onClick={() => toggleCreateModal(true)}
      >
        <HiPlusCircle size={sidebarShowed ? 24 : 40} />
      </div>
    </nav>
  );
};
