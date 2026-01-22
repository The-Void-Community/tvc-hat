"use client";

import type { Chat, Message, User } from "@/types";

import { getUser } from "@/api/get-user";
import { revalidateMessages } from "@/api/get-messages";

import { useCallback, useEffect, useRef, useState } from "react";

import { CurrentChat } from "@/components/chat/current-chat";
import { CreateChatModal } from "@/components/chat/create-chat";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { UserProfileDropdown } from "@/components/chat/user-profile-dropdown";
import { MainNavigation } from "@/components/chat/main-navigation";

import { useWebsocket } from "@/hooks/use-websocket.hook";

import { useMessages } from "@/hooks/use-messages.hook";
import { useMessagePagination } from "@/hooks/use-message-pagination.hook";

import { useChatMessages } from "@/hooks/use-chat-messages.hook";

import { useChatScroll } from "@/hooks/use-chat-scroll.hook";
import { useFilteredChats } from "@/hooks/use-filtered-chats.hook";
import { useChatInitialization } from "@/hooks/use-chat-initialization.hook";

import { useToggleRef, useToggleState } from "@/hooks/use-toggle.hook";
import { useMap } from "@/hooks/use-map.hook";
import { useUserFind } from "@/hooks/use-user-find";

import { ChatType } from "@/enums";

import { ChatContext } from "@/contexts/chat.context";

type Props = {
  chatId?: string;
};

const Chat = ({ chatId }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  const [sidebarShowed, toggleSidebar] = useToggleState();
  const [createModalShowed, toggleCreateModal] = useToggleState();
  const [messagesLoading, toggleMessagesLoading] = useToggleRef();
  const { map: chats, addMany: addChats } = useMap<Chat>();
  const { map: users, add: addUser } = useMap<User>();
  const { filteredChats } = useFilteredChats({ chats });

  const addMessagesRef = useRef<((messages: Message[]) => void) | null>(null);
  const addUserRef = useRef<((id: string, user: User) => void) | null>(null);

  const memoizedOnRecieveMessage = useCallback(
    async (message: Message) => {
      if (message.senderId === user?.id) {
        return;
      }

      const sender =
        users.get(message.senderId) || (await getUser(message.senderId));
      if (!sender) {
        return;
      }

      addMessagesRef.current?.([message]);
      addUserRef.current?.(sender.id, sender);

      if (currentChat) {
        revalidateMessages(currentChat.id);
      }
    },
    [currentChat, user?.id, users],
  );

  const { emitMessage, socket } = useWebsocket({
    chats,
    onRecieveMessage: memoizedOnRecieveMessage,
  });

  const {
    addMessages,
    sendMessage,
    retrySendMessage,
    setMessages,
    pendingMessagesRef,
    messagesRef,
    messages,
  } = useMessages({
    myId: user?.id || null,
    emitMessage,
  });

  const { handleScroll, autoScrollEnabled, toggleScrollToBottom } =
    useChatScroll({
      messagesRef,
    });

  const { Modal: UserFindModal, Trigger: UserFindTrigger } = useUserFind();

  const {
    oldestMessageId,
    hasMore: hasMoreMessages,
    handleChatChange,
    loadStartMessages,
  } = useChatMessages({
    setMessages,
    toggleMessagesLoading,
    toggleScrollToBottom,
  });

  const { loaded, load } = useChatInitialization({
    chatId,
    loadStartMessages,
  });

  const {
    loadOlderMessages,
    hasMore,
    loading: loadingOlder,
  } = useMessagePagination({
    chatId: currentChat?.id || "",
    addMessages,
    toggleMessagesLoading,
    oldestMessageId,
    hasMore: hasMoreMessages,
  });

  const onSubmit = useCallback(
    (text: string) => {
      if (!currentChat) {
        return;
      }

      sendMessage(text, currentChat.id);
      toggleScrollToBottom(true);
    },
    [currentChat, sendMessage, toggleScrollToBottom],
  );

  const showSidebar = useCallback(
    (chatType: ChatType) => {
      const isSelf = chatType === ChatType.self;
      const isDirect = chatType === ChatType.direct;

      if ((isSelf || isDirect) && !sidebarShowed) {
        toggleSidebar(true);
      }
    },
    [sidebarShowed, toggleSidebar],
  );

  const updateUrlState = useCallback((newChatId: string) => {
    window.history.replaceState(null, "", `/chat/${newChatId}`);
  }, []);

  const onChangeChat = useCallback(
    (chat: Chat | null) => {
      if (!chat) {
        return toggleSidebar(false);
      }

      handleChatChange(chat);
      updateUrlState(chat.id);
      showSidebar(chat.type);

      if (chat.type === ChatType.group) {
        return toggleSidebar(false);
      }

      toggleSidebar(true);
    },
    [handleChatChange, showSidebar, toggleSidebar, updateUrlState],
  );

  useEffect(() => {
    addMessagesRef.current = addMessages;
    addUserRef.current = addUser;
  }, [addMessages, addUser]);

  useEffect(() => {
    (async () => {
      const data = await load();
      if (!data) {
        return;
      }

      setUser(data.user);
      addChats(data.chats, "id");
      setCurrentChat(data.initialChat);
      addUser(data.user.id, data.user);

      if (data.initialChat) {
        showSidebar(data.initialChat.type);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user || !socket || !loaded) {
    return <div>loading...</div>;
  }

  return (
    <ChatContext.Provider
      value={{
        retrySendMessage,
        sendMessage,
        onSubmit,
        onScroll: handleScroll,
        setCurrentChat,
        toggleCreateModal,
        toggleSidebar,
        onChangeChat,
        addUser,
        setUser,
        createModalShowed,
        sidebarShowed,
        messagesLoading,
        filteredChats,
        autoScrollEnabled,
        me: user,
        messages,
        messagesRef,
        pendingMessages: pendingMessagesRef,
        textareaRef,
        currentChat,
        users,
        loadOlderMessages: currentChat ? loadOlderMessages : undefined,
        hasMoreMessages: hasMore,
        loadingOlderMessages: loadingOlder,
      }}
    >
      <div className="relative h-screen w-screen flex gap-2 p-8">
        <div className="h-full flex flex-col h-full gap-2">
          <div className="flex flex-1 gap-2">
            <MainNavigation />
            {sidebarShowed && <ChatSidebar UserFindTrigger={UserFindTrigger} />}
          </div>

          <UserProfileDropdown user={user} />
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
    </ChatContext.Provider>
  );
};

export default Chat;
