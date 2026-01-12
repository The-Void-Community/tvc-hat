"use server";

import type { Message } from "@/types";
import { revalidateTag } from "next/cache";

import { endpointRequestOrNull } from "./server-utils";

export const getMessages = async ({
  chatId,
  positionMessageId,
  count = 100,
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
    tags: [`messages-${chatId}`],
  });
};

export const revalidateMessages = async (chatId: string) => {
  revalidateTag(`messages-${chatId}`, {});
};
