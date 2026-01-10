"use client";

import type { Chat, Message, User } from "@/types";

import { getMe, getUser } from "@/api/get-user";
import { getChat, getChats } from "@/api/get-chats";
import { getMessages } from "@/api/get-messages";

import { useCallback, useEffect, useRef, useState } from "react";

import { Wrapper } from "@/components/wrapper.component";

import { ChatsNavigation } from "@/components/chat/chat";
import { CurrentChat } from "@/components/chat/current-chat";
import { CreateChatModal } from "@/components/chat/create-chat";

import { useFilteredChats } from "@/hooks/use-filtered-chats.hook";
import { useMessages } from "@/hooks/use-messages.hook";
import { useWebsocket } from "@/hooks/use-websocket.hook";
import { useChatScroll } from "@/hooks/use-chat-scroll.hook";
import { useMap } from "@/hooks/use-map.hook";
import { useToggleRef, useToggleState } from "@/hooks/use-toggle.hook";

import { ChatContext } from "@/contexts/chat.context";
import { ChatType } from "@/enums";
import { MainNavigation } from "@/components/chat/main-navigation";

type Props = {
  chatId?: string;
};

const Chat = ({ chatId }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  const [sidebarShowed, toggleSidebar] = useToggleState();
  const [createModalShowed, toggleCreateModal] = useToggleState();
  const [messagesLoading, toggleMessagesLoading] = useToggleRef();
  const { map: chats, addMany: addChats } = useMap<Chat>();
  const { map: users, add: addUser } = useMap<User>();
  const { filteredChats } = useFilteredChats({ chats });
  const { emitMessage, closeConnection, openConnection, socket } = useWebsocket({
    chats,
    onRecieveMessage,
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
    currentChatId: currentChat?.id || null,
    myId: user?.id || null,
    emitMessage,
  });

  const { handleScroll, autoScrollEnabled, toggleScrollToBottom } =
    useChatScroll({
      messagesRef,
      messages,
    });

  async function onRecieveMessage(message: Message) {
    if (message.senderId === user?.id) {
      return;
    }

    const sender =
      users.get(message.senderId) || (await getUser(message.senderId));
    if (!sender) {
      return;
    }

    addMessages([message]);
    addUser(sender.id, sender);
  }

  useEffect(() => {
    openConnection();
    
    return () => {
      closeConnection();
    };
  }, [closeConnection, openConnection]);

  useEffect(() => {
    (async () => {
      toggleMessagesLoading(true);
      const gettedChat = chatId ? await getChat(chatId) : null;

      const gettedUser = await getMe();
      if (!gettedUser) {
        return;
      }
      const gettedMessages = gettedChat
        ? (
            (await getMessages({
              chatId: gettedChat.id,
              sort: "desc",
            })) || []
          ).reverse()
        : [];

      const gettedChats = (await getChats()) || [];

      setMessages(
        new Map(gettedMessages.map((m) => [m.id, m] as [string, Message])),
      );
      setUser(gettedUser);
      addChats(gettedChats, "id");
      setCurrentChat(gettedChat);
      addUser(gettedUser.id, gettedUser);
      toggleScrollToBottom(true);
      setLoaded(true);
      toggleMessagesLoading(false);
    })();
  }, [
    addChats,
    addUser,
    chatId,
    setMessages,
    toggleMessagesLoading,
    toggleScrollToBottom,
  ]);

  useEffect(() => {
    if (!currentChat || currentChat.id === chatId) {
      return;
    }

    window.history.replaceState(null, "", `/chat/${currentChat.id}`);
  }, [currentChat, chatId]);

  useEffect(() => {
    if (!currentChat) {
      return;
    }

    const isSelf = currentChat.type === ChatType.self;
    const isDirect = currentChat.type === ChatType.direct;

    if ((isSelf || isDirect) && !sidebarShowed) {
      toggleSidebar(true);
    }

    setMessages(new Map());
    toggleScrollToBottom(true);
    toggleMessagesLoading(true);

    (async () => {
      const gettedMessages = await getMessages({
        chatId: currentChat.id,
        sort: "desc",
      });

      if (gettedMessages && gettedMessages.length > 0) {
        const reversedMessages = gettedMessages.reverse();
        setMessages(
          new Map(reversedMessages.map((m) => [m.id, m] as [string, Message])),
        );
      }

      if (gettedMessages?.length === 0) {
        setMessages(new Map());
      }

      toggleMessagesLoading(false);
    })();
  }, [
    currentChat,
    setMessages,
    sidebarShowed,
    toggleMessagesLoading,
    toggleScrollToBottom,
    toggleSidebar,
  ]);

  const onSubmit = (text: string) => {
    void sendMessage(text);
  };

  const onChangeChat = useCallback(
    (chat: Chat | null) => {
      if (!chat) {
        return toggleSidebar(false);
      }

      if (chat.type === ChatType.group) {
        return toggleSidebar(false);
      }

      toggleSidebar(true);
    },
    [toggleSidebar],
  );

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
      }}
    >
      <Wrapper className="gap-2">
        <MainNavigation />

        {sidebarShowed && (
          <nav className="flex flex-col items-center gap-1 bg-(--bg-card) rounded-lg w-48">
            <ChatsNavigation type={ChatType.self} full />
            <hr className="w-[60%] text-(--fg-mini-text)" />
            <ChatsNavigation type={ChatType.direct} full />
          </nav>
        )}

        <div className="bg-(--bg-card) rounded-lg flex-1 flex flex-col">
          {currentChat && <CurrentChat />}
        </div>

        <CreateChatModal
          showed={createModalShowed}
          toggle={toggleCreateModal}
        />
      </Wrapper>
    </ChatContext.Provider>
  );
};

export default Chat;
