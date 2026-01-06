"use server"

import type { Message } from "@/types";

import { cookies } from "next/headers";

export const getMessages = async ({
  chatId,
  positionMessageId,
  count = 30,
  skip = 0
}: {
  chatId: string,
  positionMessageId?: string,
  skip?: number,
  count?: number
}): Promise<Message[] | null> => {
  try {
    const cookie = await cookies();
    const token = cookie.get("token");
    if (!token) {
      return null;
    }
  
    const messageQuery = positionMessageId ? `&positionMessageId=${positionMessageId}` : "";
    const response = await fetch(`http://localhost:8080/api/v1/messages/?skip=${skip}&count=${count}&chatId=${chatId}${messageQuery}`, {
      method: "GET",
      cache: "no-cache",
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