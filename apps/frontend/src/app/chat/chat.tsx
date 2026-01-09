"use client";

import type { Chat, Message, User } from "@/types";

import { getMe, getUser } from "@/api/get-user";
import { getChat, getChats } from "@/api/get-chats";
import { getMessages } from "@/api/get-messages";

import { useEffect, useRef, useState } from "react";
import { HiPlusCircle } from "react-icons/hi";

import { Wrapper } from "@/components/wrapper.component";

import { ChatsNavigation } from "@/components/chat/chat";
import { CurrentChat } from "@/components/chat/current-chat";
import { IconOrAvatar } from "@/components/chat/icon";
import { CreateChatModal } from "@/components/chat/create-chat";

import { useFilteredChats } from "@/hooks/use-filtered-chats.hook";
import { useMessages } from "@/hooks/use-messages.hook";
import { useWebsocket } from "@/hooks/use-websocket.hook";
import { useChatScroll } from "@/hooks/use-chat-scroll.hook";
import { useMap } from "@/hooks/use-map.hook";
import { useLoading } from "@/hooks/use-loading.hook";

import { ChatContext } from "@/contexts/chat.context";
import { ChatType } from "@/enums";

type Props = {
  chatId?: string;
};

const Chat = ({ chatId }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [sidebarShowed, setSidebarShowed] = useState<boolean>(false);
  const [createModalShowed, setCreateModalShowed] = useState<boolean>(false);

  const { loading: messagesLoading, toggleLoading: toggleMessagesLoading } = useLoading();
  const { map: chats, addMany: addChats } = useMap<Chat>();
  const { map: users, add: addUser } = useMap<User>();
  const { filteredChats } = useFilteredChats({ chats });
  const { emitMessage, closeConnection, socket } = useWebsocket({
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

  const { handleScroll, autoScrollEnabled, toggleScrollToBottom } = useChatScroll({
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
    return () => {
      closeConnection();
    }
  }, [closeConnection]);

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
  }, [addChats, addUser, chatId, setMessages, toggleMessagesLoading, toggleScrollToBottom]);

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
      (() => {
        setSidebarShowed(true);
      })();
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
  }, [currentChat, setMessages, sidebarShowed, toggleMessagesLoading, toggleScrollToBottom]);

  const onSubmit = (text: string) => {
    void sendMessage(text);
  }

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
        <nav
          className={[
            "bg-(--bg-card) rounded-lg overflow-y-auto overflow-x-hidden w-16",
            "flex flex-col",
          ].join(" ")}
        >
          <div className="flex flex-col items-center gap-1">
            <div
              className={[
                "px-3 py-2 flex-center cursor-pointer",
                "hover:bg-(--bg-component)",
              ].join(" ")}
              onClick={() => {
                if (sidebarShowed) {
                  return;
                }

                setSidebarShowed(true);
              }}
            >
              <IconOrAvatar />
            </div>

            <hr className="w-[60%] text-(--fg-mini-text)" />
            <ChatsNavigation type={ChatType.group} />

            <div
              className={[
                "w-full text-(--fg-mini-text) px-3 py-2 flex-center gap-3 cursor-pointer rounded-lg transition-colors",
                "hover:bg-(--bg-component)",
              ].join(" ")}
              onClick={() => {
                setCreateModalShowed(true);
              }}
            >
              <HiPlusCircle size={40} />
            </div>
          </div>
        </nav>

        <CreateChatModal state={[createModalShowed, setCreateModalShowed]} />

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
      </Wrapper>
    </ChatContext.Provider>
  );
};

export default Chat;
