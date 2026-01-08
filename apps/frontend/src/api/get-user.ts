"use server";

import type { User } from "@/types";

import { cache } from "react";
import { endpointRequestOrNull } from "./server-utils";
import { cookies } from "next/headers";

export const getMeByToken = cache(
  async (token: string): Promise<User | null> => {
    const user = await endpointRequestOrNull({ endpoint: "/auth/@me", token });
    if (!user) {
      return null;
    }

    return user.user;
  },
);

export const getMeByCookie = cache(async (): Promise<User | null> => {
  const user = await endpointRequestOrNull({ endpoint: "/auth/@me" });
  if (!user) {
    return null;
  }

  return user.user;
});

export const getUser = cache(async (slug: string): Promise<User | null> => {
  const user = await endpointRequestOrNull({ endpoint: `/users/${slug}` });
  if (!user) {
    return null;
  }

  return user.user;
});

export const getMe = cache(
  async (token?: string | null): Promise<User | null> => {
    const cookie = await cookies();

    const userFromCookie = cookie.get("user");
    if (userFromCookie) {
      return JSON.parse(userFromCookie.value);
    }

    const user = await (token ? getMeByToken(token) : getMeByCookie());
    if (!user) {
      return null;
    }

    cookie.set("user", JSON.stringify(user), {
      expires: new Date().getTime() + 5 * 60 * 1000,
    });

    return user;
  },
);
