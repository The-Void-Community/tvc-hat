import { getChat, getChats } from "@/api/get-chats";
import { getMe } from "@/api/get-user";
import { useToggleState } from "@/hooks/use-toggle.hook";
import { useCallback } from "react";

export type UseChatUserProps = {
  chatId?: string;
  loadMessages: (chatId: string) => Promise<void>;
};

export const useChatUser = ({ chatId, loadMessages }: UseChatUserProps) => {
  /* НЕ ТЕСТИРОВАЛОСЬ */
  /* ВОЗМОЖНО НУЖНО БУДЕТ ПОМЕНЯТЬ */
  /* НА useState */
  const [loaded, toggleLoaded] = useToggleState();

  const load = useCallback(async () => {
    const gettedUser = getMe();
    if (!gettedUser) {
      return null;
    }

    const gettedChat = chatId ? await getChat(chatId) : null;
    const gettedChats = (await getChats()) || [];

    if (chatId) {
      await loadMessages(chatId);
    }

    toggleLoaded(true);

    return {
      user: gettedUser,
      chat: gettedChat,
      chats: gettedChats,
    };
  }, [chatId, loadMessages, toggleLoaded]);

  return {
    load,
    loaded,
  };
};
