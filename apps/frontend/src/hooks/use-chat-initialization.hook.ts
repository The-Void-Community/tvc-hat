import { useCallback, useState } from "react";

import { getMe } from "@/api/get-user";
import { getChat, getChats } from "@/api/get-chats";

export type UseChatInitializationProps = {
  chatId?: string;
  loadStartMessages: (chatId: string) => Promise<void>,
};

export const useChatInitialization = ({
  chatId,
  loadStartMessages
}: UseChatInitializationProps) => {
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const [fetchedChat, fetchedUser, fetchedChats] = await Promise.all([
      chatId ? getChat(chatId) : null,
      getMe(),
      getChats(),
    ]);

    if (!fetchedUser) {
      return;
    }

    const chats = fetchedChats || [];

    if (chatId) {
      await loadStartMessages(chatId);
    };

    setLoaded(true);

    return {
      user: fetchedUser,
      chats,
      initialChat: fetchedChat || null,
    }
  }, [chatId, loadStartMessages])

  return {
    loaded, load
  };
};
