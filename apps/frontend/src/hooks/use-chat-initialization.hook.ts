import type { Chat, User } from "@/types";
import { getMe } from "@/api/get-user";
import { getChat, getChats } from "@/api/get-chats";
import { useEffect, useState } from "react";

export type UseChatInitializationProps = {
  chatId?: string;
  onInitialized: (data: {
    user: User;
    chats: Chat[];
    initialChat: Chat | null;
  }) => void;
};

export const useChatInitialization = ({
  chatId,
  onInitialized,
}: UseChatInitializationProps) => {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const [fetchedChat, fetchedUser, fetchedChats] = await Promise.all([
        chatId ? getChat(chatId) : null,
        getMe(),
        getChats(),
      ]);

      if (!fetchedUser) {
        setLoading(false);
        return;
      }

      const chats = fetchedChats || [];

      onInitialized({
        user: fetchedUser,
        chats,
        initialChat: fetchedChat || null,
      });

      setLoaded(true);
      setLoading(false);
    })();
  }, [chatId, onInitialized]);

  return {
    loaded,
    loading,
  };
};
