"use client"

/**
 * WARNING
 * WARNING
 * WARNING
 * WARNING
 * WARNING
 * WARNING
 * WARNING
 * WARNING
 * WARNING
 * 
 * 
 * ЭТОТ КОД НАПИСАЛА НЕЙРОСЕТЬ И ОН ТРЕБУЕТ ПРОВЕРКИ
 * ЭТОТ КОД НАПИСАЛА НЕЙРОСЕТЬ И ОН ТРЕБУЕТ ПРОВЕРКИ
 * ЭТОТ КОД НАПИСАЛА НЕЙРОСЕТЬ И ОН ТРЕБУЕТ ПРОВЕРКИ
 * ЭТОТ КОД НАПИСАЛА НЕЙРОСЕТЬ И ОН ТРЕБУЕТ ПРОВЕРКИ
 * ЭТОТ КОД НАПИСАЛА НЕЙРОСЕТЬ И ОН ТРЕБУЕТ ПРОВЕРКИ
 * ЭТОТ КОД НАПИСАЛА НЕЙРОСЕТЬ И ОН ТРЕБУЕТ ПРОВЕРКИ
 * ЭТОТ КОД НАПИСАЛА НЕЙРОСЕТЬ И ОН ТРЕБУЕТ ПРОВЕРКИ
 * ЭТОТ КОД НАПИСАЛА НЕЙРОСЕТЬ И ОН ТРЕБУЕТ ПРОВЕРКИ
 * ЭТОТ КОД НАПИСАЛА НЕЙРОСЕТЬ И ОН ТРЕБУЕТ ПРОВЕРКИ
 * ЭТОТ КОД НАПИСАЛА НЕЙРОСЕТЬ И ОН ТРЕБУЕТ ПРОВЕРКИ
 * ЭТОТ КОД НАПИСАЛА НЕЙРОСЕТЬ И ОН ТРЕБУЕТ ПРОВЕРКИ
 * ЭТОТ КОД НАПИСАЛА НЕЙРОСЕТЬ И ОН ТРЕБУЕТ ПРОВЕРКИ
 * 
 * WARNING
 * WARNING
 * WARNING
 * WARNING
 * WARNING
 * WARNING
 * WARNING
 * WARNING
 * WARNING
 */

import type { Message as MessageType, User } from "@/types";
import { IconOrAvatar } from "./icon";

type MessageProps = {
  message: MessageType;
  users: Record<string, User>;
  showHeader: boolean;
};

export const Message = ({ message, users, showHeader }: MessageProps) => {
  const sender = users[message.senderId];
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={[
      "flex items-start gap-2 px-4 rounded-md",
      "hover:bg-(--bg-component) duration-100",
      showHeader ? "mt-2" : ""
    ].join(" ")}>
      {showHeader ? (
        <>
          <IconOrAvatar entity={sender} size={48} />
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-1">
              <span className="font-semibold">{sender.nickname}</span>
              <span className="text-mini">{time}</span>
            </div>
            <span>{message.text}</span>
          </div>
        </>
      ) : (
        <div style={{ marginLeft: "54px" }} className="flex flex-col w-full">
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
};

type MessagesProps = {
  messages: Map<string, MessageType>;
  users: Record<string, User>;
};

export const Messages = ({ messages, users }: MessagesProps) => {
  const array = Array.from(messages.values());

  const groups: {
    startIndex: number;
    startMessage: MessageType;
    messages: MessageType[];
  }[] = [];

  for (let i = 0; i < array.length; i++) {
    const message = array[i];
    
    if (i === 0 || array[i - 1].senderId !== message.senderId) {
      groups.push({
        startIndex: i,
        startMessage: message,
        messages: [message]
      });
      continue;
    }

    const lastGroup = groups[groups.length - 1];
    
    const timeDiff = Math.abs(
      new Date(message.createdAt).getTime() - 
      new Date(lastGroup.startMessage.createdAt).getTime()
    );
    const isSameDate = 
      new Date(message.createdAt).toDateString() === 
      new Date(lastGroup.startMessage.createdAt).toDateString();
    const isWithinTenMin = timeDiff <= 10 * 60 * 1000;

    if (isSameDate && isWithinTenMin) {
      lastGroup.messages.push(message);
    } else {
      groups.push({
        startIndex: i,
        startMessage: message,
        messages: [message]
      });
    }
  }

  const messagesWithHeader: Array<MessageType & { showHeader: boolean }> = [];
  
  groups.forEach(group => {
    group.messages.forEach((message, indexInGroup) => {
      messagesWithHeader.push({
        ...message,
        showHeader: indexInGroup === 0
      });
    });
  });

  return (
    <>
      {messagesWithHeader.map((message, index) => {
        const prevMessage = messagesWithHeader[index - 1];
        const showDateSeparator = !prevMessage || 
          new Date(message.createdAt).toDateString() !== 
          new Date(prevMessage.createdAt).toDateString();
        
        return (
          <div key={index}>
            {showDateSeparator && (
              <div className="px-4 py-2 my-2 text-center text-mini text-xs">
                {new Date(message.createdAt).toLocaleDateString('ru-RU', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}
            <Message
              message={message}
              users={users}
              showHeader={message.showHeader}
            />
          </div>
        );
      })}
    </>
  );
};