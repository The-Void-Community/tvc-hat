import { useChat } from "@/contexts/chat.context";

import { HiPlusCircle } from "react-icons/hi";
import { IconOrAvatar } from "./icon";
import { ChatsNavigation } from "./chat";

import { ChatType } from "@/enums";

export const MainNavigation = () => {
  const { sidebarShowed, toggleSidebar, toggleCreateModal } = useChat();

  return (
    <nav
      className={[
        "flex flex-col items-center gap-1 bg-(--bg-card) rounded-lg",
        "overflow-y-auto",
        sidebarShowed ? "w-16" : "w-48",
      ].join(" ")}
    >
      <div className="flex flex-col items-center gap-1">
        <div
          className={[
            "px-3 py-2 flex-center cursor-pointer",
            "hover:bg-(--bg-component)",
          ].join(" ")}
          onClick={() => {
            if (sidebarShowed) {
              return;
            }

            toggleSidebar(true);
          }}
        >
          <IconOrAvatar />
        </div>

        <hr className="w-[60%] text-(--fg-mini-text)" />
        <ChatsNavigation type={ChatType.group} full={!sidebarShowed} />

        <div
          className={[
            "w-full text-(--fg-mini-text) px-3 py-2 flex-center gap-3 cursor-pointer rounded-lg transition-colors",
            "hover:bg-(--bg-component)",
          ].join(" ")}
          onClick={() => {
            toggleCreateModal(true);
          }}
        >
          <HiPlusCircle size={40} />
        </div>
      </div>
    </nav>
  );
};
