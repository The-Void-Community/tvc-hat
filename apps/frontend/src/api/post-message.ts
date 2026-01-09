"use server";

import type { Message } from "@/types";

import { endpointRequestOrNull } from "./server-utils";

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
