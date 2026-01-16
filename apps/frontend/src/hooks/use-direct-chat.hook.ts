import type { Chat, User } from "@/types";
import { ChatType } from "@/enums";
import { useEffect, useState } from "react";
import { getUser } from "@/api/get-user";

export type UseChatNameProps = {
  type: ChatType;
  name: string;
  myId: string;
  users: Map<string, User>;
};

const formatDirectChatName = async ({
  name,
  myId,
  users,
}: {
  name: string;
  myId: string;
  users: Map<string, User>;
}): Promise<User | null> => {
  const splitted = name.split(":");
  const index = splitted.indexOf(myId);

  if (index === -1) {
    return null;
  }

  const userId = splitted[index === 0 ? 1 : 0];
  const user = users.get(userId);
  if (user) {
    return user;
  }

  const gettedUser = await getUser(userId);
  if (!gettedUser) {
    return null;
  }

  users.set(gettedUser.id, gettedUser);
  return gettedUser;
};

export const useDirectChat = ({
  type,
  myId,
  name,
  users,
}: UseChatNameProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (type !== ChatType.direct) {
      return;
    }

    (async () => {
      const gettedUser = await formatDirectChatName({ name, myId, users });
      if (!gettedUser) {
        return;
      }

      setUser(gettedUser);
    })();
  }, [myId, name, type, users]);

  return user;
};

export const useDirectChatName = (data: UseChatNameProps) => {
  const user = useDirectChat(data);

  if (data.type !== ChatType.direct) {
    return data.name;
  }

  if (!user) {
    return "Loading...";
  }

  return user.nickname || user.username;
};

type Entity = User | Chat | string;

export const useDirectChatAvatar = (data: {
  chat: Chat;
  myId: string;
  users: Map<string, User>;
}): Entity => {
  const user = useDirectChat({
    myId: data.myId,
    name: data.chat.name,
    type: data.chat.type,
    users: data.users,
  });

  if (data.chat.type !== ChatType.direct || !user) {
    return data.chat;
  }

  return user;
};
