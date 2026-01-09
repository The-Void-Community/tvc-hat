import type { ChatType } from "@/enums";
import type { Chat } from "@/types";
import { useCallback, useEffect, useState } from "react";

export type FilteredChats = Record<ChatType, Map<string, Chat>>;

export type UseFilteredChatsProps = {
  chats: Map<string, Chat>;
};

export const useFilteredChats = ({ chats }: UseFilteredChatsProps) => {
  const [filteredChats, setFilteredChats] = useState<FilteredChats>({
    DIRECT: new Map(),
    GROUP: new Map(),
    SELF: new Map(),
  });

  const filterChats = useCallback(() => {
    return setFilteredChats((previous) => {
      const filtered = Object.groupBy(chats.values(), (chat) => chat.type);
      const data = Object.fromEntries(
        Object.keys(previous).map((k) => {
          const key = k as ChatType;
          const value = filtered[key];
          if (!value) {
            return [key, previous[key]];
          }

          return [key, new Map(value.map((chat) => [chat.id, chat]))] as [
            ChatType,
            Map<string, Chat>,
          ];
        }),
      ) as FilteredChats;

      return data;
    });
  }, [chats]);

  useEffect(() => {
    (() => {
      filterChats();
    })();
  }, [filterChats, chats]);

  return {
    filterChats,
    filteredChats,
    setFilteredChats,
  };
};
