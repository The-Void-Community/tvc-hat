import type { Message } from "@/types";
import { useMemo } from "react";

export type GroupedMessage = Message & {
  showHeader: boolean;
  dateString: string;
};

export type DateGroup = {
  dateString: string;
  formattedDate: string;
  messages: GroupedMessage[];
};

export const useGroupedMessages = (
  messagesArray: Message[],
  formatFullDate: (date: Date) => string,
): DateGroup[] => {
  const groupedMessages = useMemo(() => {
    if (messagesArray.length === 0) return [];

    const TEN_MIN = 10 * 60 * 1000;
    const groups: Array<{
      messages: Message[];
      dateString: string;
    }> = [];

    messagesArray.forEach((message, index) => {
      const messageDate = new Date(message.createdAt);
      const messageTime = messageDate.getTime();
      const messageDateString = messageDate.toDateString();

      if (index === 0) {
        groups.push({
          messages: [message],
          dateString: messageDateString,
        });
        return;
      }

      const prevMessage = messagesArray[index - 1];
      const lastGroup = groups[groups.length - 1];
      const prevMessageTime = new Date(prevMessage.createdAt).getTime();

      const timeDiff = Math.abs(messageTime - prevMessageTime);
      const isSameDate = messageDateString === lastGroup.dateString;
      const isSameSender = prevMessage.senderId === message.senderId;
      const isWithinTenMin = timeDiff <= TEN_MIN;

      if (isSameSender && isSameDate && isWithinTenMin) {
        lastGroup.messages.push(message);
      } else {
        groups.push({
          messages: [message],
          dateString: messageDateString,
        });
      }
    });

    return groups.flatMap((group) =>
      group.messages.map((message, indexInGroup) => ({
        ...message,
        showHeader: indexInGroup === 0,
        dateString: group.dateString,
      })),
    );
  }, [messagesArray]);

  const groupsWithDates = useMemo(() => {
    const result: DateGroup[] = [];
    let currentGroup: DateGroup | null = null;

    groupedMessages.forEach((message) => {
      if (!currentGroup || currentGroup.dateString !== message.dateString) {
        currentGroup = {
          dateString: message.dateString,
          formattedDate: formatFullDate(new Date(message.createdAt)),
          messages: [],
        };
        result.push(currentGroup);
      }
      currentGroup.messages.push(message);
    });

    return result;
  }, [groupedMessages, formatFullDate]);

  return groupsWithDates;
};
