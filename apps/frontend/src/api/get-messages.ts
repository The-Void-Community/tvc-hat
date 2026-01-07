"use server";

import type { Message } from "@/types";

import { endpointRequestOrNull } from "./utils";

export const getMessages = async ({
  chatId,
  positionMessageId,
  count = 30,
  skip = 0,
  sort = "asc",
}: {
  chatId: string;
  positionMessageId?: string;
  skip?: number;
  count?: number;
  sort: "asc" | "desc";
}): Promise<Message[] | null> => {
  return endpointRequestOrNull({
    endpoint: "/messages",
    query: {
      skip,
      count,
      positionMessageId,
      sort,
      chatId,
    },
  });
};
