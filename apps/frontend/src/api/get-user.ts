"use server";

import type { User } from "@/types";

import { cache } from "react";
import { endpointRequestOrNull } from "./server-utils";

export const getMeByToken = cache(
  async (token: string): Promise<User | null> => {
    const user = await endpointRequestOrNull({ endpoint: "/auth/@me", token });
    return user.user;
  },
);

export const getMeByCookie = cache(async (): Promise<User | null> => {
  const user = await endpointRequestOrNull({ endpoint: "/auth/@me" });
  return user.user;
});

export const getUser = cache(async (slug: string): Promise<User | null> => {
  const user = await endpointRequestOrNull({ endpoint: `/users/${slug}` });
  return user.user;
});

export const getMe = cache(
  async (token?: string | null): Promise<User | null> => {
    if (token) {
      return getMeByToken(token);
    }

    return getMeByCookie();
  },
);
