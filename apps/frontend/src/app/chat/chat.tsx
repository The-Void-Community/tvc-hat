"use client";

import type { Chat, Message, User } from "@/types";

import { getToken } from "@/api/get-token";
import { getMe, getUser } from "@/api/get-user";
import { getChat, getChats } from "@/api/get-chats";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuid } from "uuid";

import { Wrapper } from "@/components/wrapper.component";
import { getMessages } from "@/api/get-messages";
import { ChatsNavigation } from "@/components/chat/chat";
import { ChoosedChat } from "@/components/chat/choosed-chat";
import { ChatType } from "@/enums";
import { IconOrAvatar } from "@/components/chat/icon";

import { HiPlusCircle } from "react-icons/hi";
import { CreateChatModal } from "@/components/chat/create-chat";

type Props = {
  chatId?: string;
};

const Chat = ({ chatId }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef<boolean>(true);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Record<ChatType, Chat[]>>({
    DIRECT: [],
    GROUP: [],
    SELF: [],
  });
  const [choosedChat, setChoosedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Map<string, Message>>(new Map());
  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [sidebarShowed, setSidebarShowed] = useState<boolean>(false);
  const [createModalShowed, setCreateModalShowed] = useState<boolean>(false);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const pendingAcksRef = useRef<Map<string, number>>(new Map());
  const messagesStateRef = useRef<Map<string, Message>>(messages);

  useEffect(() => {
    messagesStateRef.current = messages;
  }, [messages]);

  const addMessages = (messages: Message[], to: "start" | "end" = "end") => {
    return setMessages((previous) => {
      if (to === "end") {
        return new Map<string, Message>([
          ...Array.from(previous.entries()),
          ...messages.map(
            (message) => [message.id, message] as [string, Message],
          ),
        ]);
      }

      return new Map<string, Message>([
        ...messages.map(
          (message) => [message.id, message] as [string, Message],
        ),
        ...Array.from(previous.entries()),
      ]);
    });
  };

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "instant") => {
      if (!messagesRef.current) {
        return;
      }

      if (behavior === "instant") {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        return;
      }

      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior,
      });
    },
    [],
  );

  const handleScroll = useCallback(() => {
    if (!messagesRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
    shouldAutoScrollRef.current = scrollHeight - scrollTop - clientHeight < 100;
  }, []);

  useEffect(() => {
    (async () => {
      const gettedToken = await getToken();
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
      const filtered = {
        ...filteredChats,
        ...Object.groupBy(gettedChats, (chat) => chat.type),
      };

      setMessages(
        new Map(gettedMessages.map((m) => [m.id, m] as [string, Message])),
      );
      setFilteredChats(filtered);
      setUser(gettedUser);
      setToken(gettedToken);
      setChats(gettedChats || []);
      setChoosedChat(gettedChat);
      setUsers((previous) => ({ ...previous, [gettedUser.id]: gettedUser }));

      setLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, scrollToBottom]);

  useEffect(() => {
    if (!choosedChat || choosedChat.id === chatId) {
      return;
    }

    window.history.replaceState(null, "", `/chat/${choosedChat.id}`);
  }, [choosedChat, chatId]);

  useEffect(() => {
    if (!choosedChat) {
      return;
    }

    const isSelf = choosedChat.type === ChatType.self;
    const isDirect = choosedChat.type === ChatType.direct;

    if ((isSelf || isDirect) && !sidebarShowed) {
      setSidebarShowed(true);
    }
    
    setMessages(new Map());
    setLastMessageId(null);
    shouldAutoScrollRef.current = true;

    (async () => {
      const gettedMessages = (await getMessages({
        chatId: choosedChat.id,
        sort: "desc",
      }));

      if (gettedMessages && gettedMessages.length > 0) {
        const reversedMessages = gettedMessages.reverse();
        setMessages(
          new Map(reversedMessages.map((m) => [m.id, m] as [string, Message])),
        );
        setLastMessageId(reversedMessages[reversedMessages.length - 1].id);
        scrollToBottom("instant");
      }
    })();
  }, [choosedChat, sidebarShowed, scrollToBottom]);

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    const websocket = io("http://localhost:8080/chat", {
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
    });

    websocket.on("receive_message", async (message: Message) => {
      if (message.senderId === user.id) {
        return;
      }

      const messageUser = await getUser(message.senderId);
      if (!messageUser) {
        return;
      }

      setUsers((previous) => ({ ...previous, [messageUser.id]: messageUser }));
      addMessages([message]);
      setLastMessageId(message.id);
    });

    (() => {
      setSocket(websocket);
    })();
  }, [chats, token, user]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.emit(
      "rooms_connect",
      chats.map((chat) => chat.id),
    );

    return () => {
      socket.emit(
        "rooms_disconnect",
        chats.map((chat) => chat.id),
      );

      socket.removeListener("receive_message");
      socket.disconnect();
      socket.close();
    };
  }, [chats, socket]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!socket || !user || !choosedChat) return;

    const textTrimmed = messageText.trim();
    if (textTrimmed === "") return;

    const tempId = uuid();
    const tempMessage = {
      senderId: user.id,
      chatId: choosedChat.id,
      text: textTrimmed,
      id: tempId,
      createdAt: new Date(),
      pending: true,
    } as unknown as Message;

    addMessages([tempMessage]);
    setLastMessageId(tempId);

    try {
      const timeout = window.setTimeout(() => {
        setMessages((prev) => {
          const next = new Map(prev);
          const m = next.get(tempId);
          if (!m) return prev;
          next.set(tempId, { ...m, pending: false, failed: true } as unknown as Message);
          return next;
        });
        pendingAcksRef.current.delete(tempId);
      }, 8000);

      pendingAcksRef.current.set(tempId, timeout as unknown as number);

      socket.emit("send_message", { chatId: choosedChat.id, senderId: user.id, text: textTrimmed }, (serverMessage: Message | null) => {
        const pending = pendingAcksRef.current.get(tempId);
        if (pending) {
          clearTimeout(pending as unknown as number);
          pendingAcksRef.current.delete(tempId);
        }

        if (serverMessage) {
          setMessages((prev) => {
            const next = new Map(prev);
            if (next.has(tempId)) next.delete(tempId);
            next.set(serverMessage.id, serverMessage);
            return next;
          });
          setLastMessageId(serverMessage.id);
        } else {
          setMessages((prev) => {
            const next = new Map(prev);
            const m = next.get(tempId);
            if (!m) return prev;
            next.set(tempId, { ...m, pending: false, failed: true } as unknown as Message);
            return next;
          });
        }
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const next = new Map(prev);
        const m = next.get(tempId);
        if (!m) return prev;
        next.set(tempId, { ...m, pending: false, failed: true } as unknown as Message);
        return next;
      });
    }
  }, [socket, user, choosedChat]);

  const onSubmit = (messageText: string) => {
    void sendMessage(messageText);
  };

  const retryMessage = useCallback((id: string) => {
    if (!socket || !choosedChat || !user) return;

    const msg = messagesStateRef.current.get(id);
    if (!msg) return;

    const text = msg.text;

    setMessages((prev) => {
      const next = new Map(prev);
      const current = next.get(id);
      if (!current) return prev;
      next.set(id, { ...current, pending: true, failed: false } as unknown as Message);
      return next;
    });

    setLastMessageId(id);

    const timeout = window.setTimeout(() => {
      setMessages((prev) => {
        const next = new Map(prev);
        const curr = next.get(id);
        if (!curr) return prev;
        next.set(id, { ...curr, pending: false, failed: true } as unknown as Message);
        return next;
      });
      pendingAcksRef.current.delete(id);
    }, 8000);

    pendingAcksRef.current.set(id, timeout);

    socket.emit("send_message", { chatId: choosedChat.id, senderId: user.id, text }, (serverMessage: Message | null) => {
      const pending = pendingAcksRef.current.get(id);
      if (pending) {
        clearTimeout(pending);
        pendingAcksRef.current.delete(id);
      }
      if (serverMessage) {
        setMessages((prev) => {
          const next = new Map(prev);
          if (next.has(id)) next.delete(id);
          next.set(serverMessage.id, serverMessage);
          return next;
        });
        setLastMessageId(serverMessage.id);
      } else {
        setMessages((prev) => {
          const next = new Map(prev);
          const curr = next.get(id);
          if (!curr) return prev;
          next.set(id, { ...curr, pending: false, failed: true } as unknown as Message);
          return next;
        });
      }
    });
  }, [socket, choosedChat, user]);

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollToBottom("smooth");
    }
  }, [lastMessageId, scrollToBottom]);

  if (!user || !socket || !loaded) {
    return <div>loading...</div>;
  }

  return (
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

          <ChatsNavigation
            choosedChat={choosedChat}
            setChoosedChat={setChoosedChat}
            chats={filteredChats.GROUP}
          />

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
          <ChatsNavigation
            choosedChat={choosedChat}
            setChoosedChat={setChoosedChat}
            chats={filteredChats.SELF}
            full
            />
          <hr className="w-[60%] text-(--fg-mini-text)" />
          <ChatsNavigation
            choosedChat={choosedChat}
            setChoosedChat={setChoosedChat}
            chats={filteredChats.DIRECT}
            full
          />
        </nav>
      )}

      <div className="bg-(--bg-card) rounded-lg flex-1 flex flex-col">
        {choosedChat && (
          <ChoosedChat
            chat={choosedChat}
            messages={messages}
            onSubmit={onSubmit}
            textareaRef={textareaRef}
            messagesRef={messagesRef}
            users={users}
            onScroll={handleScroll}
            onRetry={retryMessage}
          />
        )}
      </div>
    </Wrapper>
  );
};

export default Chat;
