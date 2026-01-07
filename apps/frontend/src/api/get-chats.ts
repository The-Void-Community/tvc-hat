"use server";

import { Chat } from "@/types";
import { cache } from "react";
import { endpointRequestOrNull } from "./utils";

export const getChat = cache(async (slug: string): Promise<Chat | null> => {
  return endpointRequestOrNull({
    endpoint: `/chats/${slug}`
  });
});

export const getChats = cache(
  async (slugs: string[]): Promise<Chat[] | null> => {
    return endpointRequestOrNull({
      endpoint: "/chats",
      query: { slugs }
    });
});
