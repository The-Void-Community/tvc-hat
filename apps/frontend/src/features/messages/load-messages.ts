import type { Message } from "@/types";
import { getMessages } from "@/api/get-messages";

export type LoadMessagesParameters = {
  chatId: string;
  positionMessageId?: string;
  count?: number;
};

export type LoadMessagesResult = {
  messages: Message[];
  moreMessagesAvailable: boolean;
  oldMessageId?: string;
};

export const loadMessages = async ({
  chatId,
  count = 100,
  positionMessageId,
}: LoadMessagesParameters): Promise<LoadMessagesResult> => {
  const gettedMessages = await getMessages({
    chatId,
    count,
    positionMessageId,
    sort: "desc",
  });

  if (!gettedMessages || gettedMessages.length === 0) {
    return {
      messages: [],
      moreMessagesAvailable: false,
    };
  }

  const messages = gettedMessages.reverse();
  const oldMessage = messages[0];
  const moreMessagesAvailable = gettedMessages.length === count;

  return {
    messages,
    moreMessagesAvailable,
    oldMessageId: oldMessage.id,
  };
};
