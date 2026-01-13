"use server";

import type { Chat } from "@/types";

import { cache } from "react";
import { endpointRequestOrNull, endpointRequestOrThrow } from "./server-utils";

export const getDirectChat = async (userSlug: string): Promise<Chat | null> => {
  return endpointRequestOrNull({
    endpoint: `/chats/u/${userSlug}`,
    tags: [`chat/u/${userSlug}`],
  });
}

export const getDirectChatOrCreate = async (userSlug: string): Promise<Chat> => {
  const chat = await getDirectChat(userSlug);

  if (chat) {
    return chat;
  }

  return endpointRequestOrThrow({
    endpoint: `/chats/u/${userSlug}`,
    tags: [`chats/u/${userSlug}`],
    init: {
      method: "POST"
    }
  })
}

export const getChat = cache(async (slug: string): Promise<Chat | null> => {
  return endpointRequestOrNull({
    endpoint: `/chats/${slug}`,
    tags: [`chat/${slug}`],
  });
});

export const getChats = cache(async (): Promise<Chat[] | null> => {
  return endpointRequestOrNull({
    endpoint: "/chats/@me",
    tags: ["chats/me"],
  });
});
