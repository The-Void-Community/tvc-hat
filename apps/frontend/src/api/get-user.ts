"use server";

import type { User } from "@/types";

import { cache } from "react";
import { endpointRequestOrNull } from "./utils";

export const getMeByToken = cache(
  async (token: string): Promise<User | null> => {
    return endpointRequestOrNull({endpoint: "/auth/@me", token});
  }
);

export const getMeByCookie = cache(async (): Promise<User | null> => {
  return endpointRequestOrNull(({endpoint: "/auth/@me"}));
});

export const getUser = cache(async (slug: string): Promise<User | null> => {
  return endpointRequestOrNull({endpoint: `/users/${slug}`});
});

export const getMe = cache(
  async (token?: string | null): Promise<User | null> => {
    if (token) {
      return getMeByToken(token);
    }

    return getMeByCookie();
  },
);
