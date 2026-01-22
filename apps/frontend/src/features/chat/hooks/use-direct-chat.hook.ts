import type { Chat, User } from "@/types";

import { useEffect, useState } from "react";

import { ChatType } from "@/enums";
import { getUser } from "@/api/get-user";
import { useUsers } from "@/features/users/users.context";

export type UseDirectChatProps = {
  chat: Chat;
  myId: string;
};

export const useDirectChat = ({
  chat,
  myId,
}: UseDirectChatProps): User | null => {
  const { users, addUser } = useUsers();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      if (chat.type !== ChatType.direct) return null;

      const [id1, id2] = chat.name.split(":");
      const otherUserId = id1 === myId ? id2 : id1;

      const user = users.entities[otherUserId] ?? null;
      if (user) {
        setUser(user);
        return user;
      }

      const gettedUser = await getUser(otherUserId);
      setUser(gettedUser);
      if (gettedUser) {
        addUser(gettedUser);
      }
    })();
  }, [addUser, chat.name, chat.type, myId, users.entities]);

  return user;
};

export const useDirectChatName = ({
  chat,
  myId,
}: UseDirectChatProps): string => {
  const user = useDirectChat({ chat, myId });

  if (chat.type !== ChatType.direct) return chat.name;
  if (!user) return "Loading...";

  return user.nickname || user.username;
};

export const useDirectChatAvatar = ({
  chat,
  myId,
}: UseDirectChatProps): User | Chat => {
  const user = useDirectChat({ chat, myId });

  if (chat.type !== ChatType.direct || !user) {
    return chat;
  }

  return user;
};
