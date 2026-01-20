import type { FrontendMessage } from "@/types";
import { useMemo } from "react";

export type GroupedMessage = FrontendMessage & {
  showHeader: boolean;
  dateString: string;
};

export type DateGroup = {
  dateString: string;
  formattedDate: string;
  messages: GroupedMessage[];
};

const TEN_MIN = 10 * 60 * 1000;

export const useGroupedMessages = (
  entities: Record<string, FrontendMessage>,
  order: string[],
  formatFullDate: (date: Date) => string,
): DateGroup[] => {
  return useMemo(() => {
    if (!order.length) {
      return [];
    }

    return order
      .map((id) => entities[id])
      .filter(Boolean)
      .reduce<DateGroup[]>((groups, message) => {
        const messageDate = new Date(message.createdAt);
        const dateString = messageDate.toDateString();

        const lastGroup = groups[groups.length - 1];
        const lastMessage = lastGroup?.messages[lastGroup.messages.length - 1];

        const showHeader =
          !lastMessage ||
          lastMessage.senderId !== message.senderId ||
          lastMessage?.dateString !== dateString ||
          Math.abs(
            messageDate.getTime() - new Date(lastMessage.createdAt).getTime(),
          ) > TEN_MIN;

        const groupedMessage: GroupedMessage = {
          ...message,
          showHeader,
          dateString,
        };

        if (!lastGroup || lastGroup.dateString !== dateString) {
          groups.push({
            dateString,
            formattedDate: formatFullDate(messageDate),
            messages: [groupedMessage],
          });
        } else {
          lastGroup.messages.push(groupedMessage);
        }

        return groups;
      }, []);
  }, [entities, order, formatFullDate]);
};
