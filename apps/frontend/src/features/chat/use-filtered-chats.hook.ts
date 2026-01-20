import type { ChatType } from "@/enums";
import type { Store } from "@/features/hooks/use-normalized-store.hook";
import type { Chat } from "@/types";

import { useMemo } from "react";

export type FilteredChats = Record<ChatType, Map<string, Chat>>;

export type UseFilteredChatsProps = {
  chats: Store<Chat>;
};

export const useFilteredChats = ({ chats }: UseFilteredChatsProps) => {
  const filteredChats = useMemo(() => {
    const result: FilteredChats = {
      DIRECT: new Map(),
      GROUP: new Map(),
      SELF: new Map()
    };

    Object.values(chats.entities).forEach((chat) => {
      if (chat.type in result) {
        result[chat.type as ChatType].set(chat.id, chat);
      }
    });

    return result;
  }, [chats]);

  return {
    filteredChats,
  };
};
