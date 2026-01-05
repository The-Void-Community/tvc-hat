"use server";

import { Chat } from "@/types";
import { cookies } from "next/headers";

export const getChat = async (slug: string): Promise<Chat | null> => {
  try {
    const cookie = await cookies();
    const token = cookie.get("token");
    if (!token) {
      return null;
    }

    const response = await fetch(`http://localhost:8080/api/v1/chats/${slug}`, {
      method: "GET",
      next: {
        revalidate: 1200,
      },
      cache: "force-cache",
      headers: {
        authorization: `Bearer ${token.value}`,
      },
    });

    if (response.status !== 200) {
      return null;
    }

    const chat = response.json();
    if (!chat) {
      return null;
    }

    return chat;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/** @deprecated */
export const deprecatedGetChats = async (
  slugs: string[],
): Promise<Chat[] | null> => {
  const data = await Promise.all(slugs.map((slug) => getChat(slug)));

  return data.filter((chat) => !!chat);
};
