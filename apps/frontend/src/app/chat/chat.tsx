"use client";

import type { Chat, User } from "@/types";

import { useCallback, useEffect, useState } from "react";

import { getUser } from "@/api/get-user";
import { revalidateMessages } from "@/api/get-messages";

import { ChatProviders } from "@/providers/chat.provider";

import { ChatSidebar } from "@/features/chat/components/chat-sidebar";
import { CurrentChat } from "@/features/chat/components/current-chat.component";
import { MainNavigation } from "@/features/chat/components/main-navigation";
import { CreateChatModal } from "@/features/chat/components/create-chat.modal";
import { UserProfileDropdown } from "@/features/users/user-profile-dropdown";

import { useChatClient } from "@/features/client/use-chat-client.hook";
import { useWebsocket } from "@/features/client/use-websocket.hook";

import { useFilteredChats } from "@/features/chat/hooks/use-filtered-chats.hook";
import { useChatScroll } from "@/features/chat/hooks/use-chat-scroll.hook";

import { useStore } from "@/hooks/use-store.hook";
import { useUserFind } from "@/hooks/use-user-find";
import { useToggleState } from "@/hooks/use-toggle.hook";

import { useMessagesLoader } from "@/features/messages/hooks/use-messages-loader.hook";
import { useMessagesState } from "@/features/messages/hooks/use-messages-state.hook";
import { useMessageSender } from "@/features/messages/hooks/use-message-sender.hook";

type Props = {
  chatId?: string;
};

const Chat = ({ chatId }: Props) => {
  /* ---------------- users ---------------- */
  const [me, setMe] = useState<User | null>(null);
  const usersStore = useStore<User>();

  /* ---------------- chats ---------------- */
  const chatsStore = useStore<Chat>();
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const { filteredChats } = useFilteredChats({ chats: chatsStore });

  const [sidebarShowed, toggleSidebar] = useToggleState(false);
  const [createModalShowed, toggleCreateModal] = useToggleState(false);

  /* ---------------- messages ---------------- */
  const { store: messagesStore, messagesRef, textareaRef } = useMessagesState();

  /* ---------------- websocket ---------------- */
  const {
    connectToChat,
    disconnectFromChat,
    initializeWebsocket,
    emitMessage,
  } = useWebsocket({
    onRecieveMessage: useCallback(
      async (message) => {
        if (message.senderId === me?.id) {
          return;
        }

        const sender =
          usersStore.getById(message.senderId) ||
          (await getUser(message.senderId));
        if (!sender) {
          return;
        }

        messagesStore.addMessages([message]);
        usersStore.append(sender);

        if (currentChat) {
          revalidateMessages(currentChat.id);
        }
      },
      [me?.id, currentChat, messagesStore, usersStore],
    ),
  });

  const { autoScrollEnabled, handleScroll, toggleScrollToBottom } =
    useChatScroll({
      messagesRef,
    });

  const {
    loadMessages,
    handleChatChange,
    oldMessagesAvailable,
    messagesLoading,
    oldMessagesLoading,
    toggleMessagesLoading,
    toggleOldMessagesAvailable,
    toggleOldMessagesLoading,
  } = useMessagesLoader({
    addMessages: messagesStore.addMessages,
    toggleScrollToBottom,
  });

  const { retrySendMessage, sendMessage, onSubmit, pendingMessages } =
    useMessageSender({
      emitMessage,
      myId: me?.id || null,
      state: { messagesRef, textareaRef, store: messagesStore },
    });

  /* ---------------- initializing ---------------- */
  const { load, loaded, setLoaded } = useChatClient({
    chatId,
    loadMessages: async (chatId) => {
      await loadMessages({
        chatId,
        enableScroll: true,
      });
    },
  });

  useEffect(() => {
    initializeWebsocket();

    load().then((data) => {
      if (data === null) {
        return;
      }

      setMe(data.user);
      chatsStore.prependMany(data.chats);
      usersStore.append(data.user);
      setCurrentChat(data.initialChat);

      toggleMessagesLoading(false);
      setLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Работает не так, как надо */
  /** Работает не так, как надо */
  /** Работает не так, как надо */
  /** Работает не так, как надо */
  /** Работает не так, как надо */
  useEffect(() => {
    chatsStore.order.forEach((c) => connectToChat(c));

    return () => {
      chatsStore.order.forEach((c) => disconnectFromChat(c));
    };
  }, []);

  const onChangeChat = useCallback(
    (chat: Chat) => {
      window.history.replaceState(null, "", `/chat/${chat.id}`);

      messagesStore.clear();

      loadMessages({
        chatId: chat.id,
        enableScroll: true,
      });

      handleChatChange(chat);
    },
    [handleChatChange, loadMessages, messagesStore],
  );

  const { Modal: UserFindModal, Trigger: UserFindTrigger } = useUserFind();

  if (!loaded) {
    return <div>loading...</div>;
  }

  if (!me) {
    return <div>unauthorized</div>;
  }

  return (
    <ChatProviders
      chat={{
        store: chatsStore,
        currentChat,
        filteredChats,
        setCurrentChat,
        onChangeChat,
        sidebarShowed,
        toggleSidebar,
        createModalShowed,
        toggleCreateModal,
      }}
      messages={{
        store: messagesStore,
        autoScrollEnabled,
        loadMessages,
        messagesLoading,
        messagesRef,
        oldMessagesAvailable,
        oldMessagesLoading,
        onMessagesScroll: handleScroll,
        onTextareaSubmit: onSubmit(
          currentChat?.id || null,
          toggleScrollToBottom,
        ),
        pendingMessages,
        retrySendMessage,
        sendMessage,
        textareaRef,
        toggleMessagesLoading,
        toggleOldMessagesAvailable,
        toggleOldMessagesLoading,
      }}
      users={{
        me,
        users: usersStore,
        addUser: usersStore.append,
        setMe,
      }}
    >
      <div className="relative h-screen w-screen flex gap-2 p-8">
        <div className="h-full flex flex-col h-full gap-2">
          <div className="flex flex-1 gap-2">
            <MainNavigation />
            {sidebarShowed && <ChatSidebar UserFindTrigger={UserFindTrigger} />}
          </div>

          <UserProfileDropdown user={me} />
        </div>

        <div className="bg-(--bg-card) rounded-lg flex-1 flex flex-col">
          {currentChat && <CurrentChat />}
        </div>

        <UserFindModal />

        <CreateChatModal
          showed={createModalShowed}
          toggle={toggleCreateModal}
        />
      </div>
    </ChatProviders>
  );
};

export default Chat;
