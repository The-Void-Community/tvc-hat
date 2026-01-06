"use server";

import { Chat } from "@/types";
import { cookies } from "next/headers";
import { cache } from "react";

export const getChat = cache(async (slug: string): Promise<Chat | null> => {
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
});

export const getChats = cache(async(slugs: string[]) => {
  try {
    const cookie = await cookies();
    const token = cookie.get("token");
    if (!token) {
      return null;
    }

    const response = await fetch(`http://localhost:8080/api/v1/chats/?slugs=${slugs.join(",")}`, {
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
})
