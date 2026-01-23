import { getChat, getChats } from "@/api/get-chats";
import { getMe } from "@/api/get-user";
import { useCallback, useState } from "react";

export type UseChatClientProps = {
  chatId?: string;
  loadMessages: (chatId: string) => Promise<void>;
};

export const useChatClient = ({ chatId, loadMessages }: UseChatClientProps) => {
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const user = await getMe();
    if (!user) return null;

    const chat = chatId ? await getChat(chatId) : null;
    const chats = (await getChats()) ?? [];

    if (chatId) {
      await loadMessages(chatId);
    }

    return {
      user,
      initialChat: chat,
      chats,
    };
  }, [chatId, loadMessages]);

  return {
    load,
    loaded,
    setLoaded,
  };
};
