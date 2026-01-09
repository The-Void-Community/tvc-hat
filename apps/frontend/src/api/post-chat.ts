"use server";

import type { ChatType } from "@/enums";
import type { Chat } from "@/types";

import { endpointRequestOrNull } from "./server-utils";
import { revalidatePath, revalidateTag } from "next/cache";

export const createChat = async (data: {
  type: ChatType;
  name: string;
  icon: string | null;
  chatname: string | null;
}): Promise<Chat | null> => {
  const chat = await endpointRequestOrNull({
    endpoint: "/chats/",
    cache: false,
    statusResponse: 201,
    init: { method: "POST", body: JSON.stringify(data) },
  });

  revalidateTag("chats", {});
  revalidatePath("/chat");

  return chat;
};
