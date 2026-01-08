"use server"

import { cache } from "react";

import { endpointRequestOrNull } from "./server-utils";

import { ChatType } from "@/enums";
import { Chat } from "@/types";
import { revalidatePath, revalidateTag } from "next/cache";

export const createChat = cache(async (data: {
  type: ChatType,
  name: string,
  icon: string|null;
  chatname: string|null;
}): Promise<Chat|null> => {
  const chat = await endpointRequestOrNull({
    endpoint: "/chats/",
    cache: false,
    statusResponse: 201,
    init: { method: "POST", body: JSON.stringify(data) }
  });

  revalidatePath('/chat/[chatId]', "page");
  revalidatePath('/chat/', "page");
  revalidateTag("chats", {});

  return chat;
});