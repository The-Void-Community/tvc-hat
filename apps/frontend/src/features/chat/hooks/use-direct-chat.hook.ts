import type { Chat, User } from "@/types";

import { useMemo } from "react";

import { ChatType } from "@/enums";
import { getUser } from "@/api/get-user";
import { useUsers } from "@/features/users/users.context";

export type UseDirectChatProps = {
  chat: Chat;
  myId: string;
};

export const useDirectChat = ({ chat, myId }: UseDirectChatProps): User | null => {
  const { users, addUser } = useUsers();

  return useMemo(() => {
    if (chat.type !== ChatType.direct) return null;

    const [id1, id2] = chat.name.split(":");
    const otherUserId = id1 === myId ? id2 : id1;

    const user = users.get(otherUserId) ?? null;
    if (!user) {
      getUser(otherUserId).then((fetchedUser) => fetchedUser && addUser(fetchedUser.id, fetchedUser));
    }

    return user;
  }, [chat, myId, users, addUser]);
};

export const useDirectChatName = ({ chat, myId }: UseDirectChatProps): string => {
  const user = useDirectChat({ chat, myId });

  if (chat.type !== ChatType.direct) return chat.name;
  if (!user) return "Loading...";

  return user.nickname || user.username;
};

export const useDirectChatAvatar = ({ chat, myId }: UseDirectChatProps): User | Chat => {
  const user = useDirectChat({ chat, myId });

  if (chat.type !== ChatType.direct || !user) {
    return chat;
  }

  return user;
};
