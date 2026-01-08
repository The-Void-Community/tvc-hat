"use server";

import { endpointRequestOrNull } from "./server-utils";
import type { Message } from "@/types";

export const postMessage = async (data: {
  chatId: string;
  text: string;
}): Promise<Message | null> => {
  const message = await endpointRequestOrNull({
    endpoint: "/messages",
    statusResponse: 201,
    init: { method: "POST", body: JSON.stringify(data) },
  });

  return message;
};
