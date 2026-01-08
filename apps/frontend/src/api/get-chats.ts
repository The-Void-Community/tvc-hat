"use server";

import { Chat } from "@/types";
import { cache } from "react";
import { endpointRequestOrNull } from "./server-utils";

export const getChat = cache(async (slug: string): Promise<Chat | null> => {
  return endpointRequestOrNull({
    endpoint: `/chats/${slug}`,
    tags: ["chat", slug],
  });
});

export const getChats = cache(async (): Promise<Chat[] | null> => {
  return endpointRequestOrNull({
    endpoint: "/chats/@me",
    tags: ["chats"],
  });
});
