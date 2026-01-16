"use client";

import { ChatsNavigation } from "./chat";
import { ChatType } from "@/enums";
import { useUserFind } from "@/hooks/use-user-find";

export const ChatSidebar = () => {
  const { Trigger: UserFindTrigger } = useUserFind();

  return (
    <nav className="flex flex-col items-center gap-1 bg-(--bg-card) rounded-lg w-48">
      <UserFindTrigger className="mt-2" />

      <ChatsNavigation type={ChatType.self} full />
      <hr className="w-[60%] text-(--fg-mini-text)" />
      <ChatsNavigation type={ChatType.direct} full />
    </nav>
  );
};
