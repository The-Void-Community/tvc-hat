"use server";

import { endpointRequestOrNull } from "./server-utils";
import type { Message } from "@/types";
import { revalidateTag } from "next/cache";

export const postMessage = async (data: {
  chatId: string;
  text: string;
}): Promise<Message | null> => {
  const message = await endpointRequestOrNull({
    endpoint: "/messages",
    statusResponse: 201,
    init: { method: "POST", body: JSON.stringify(data) },
  });

  if (message && (message as Message).chatId) {
    revalidateTag(`messages_${(message as Message).chatId}`, {});
  }

  return message;
};
