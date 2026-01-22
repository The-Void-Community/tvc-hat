"use server";

import type { User } from "@/types";

import { cache } from "react";
import { cookies } from "next/headers";

import { endpointRequestOrNull } from "./server-utils";
import { getToken } from "./get-token";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const getMeByToken = cache(
  async (
    token: string,
    cookie: ReadonlyRequestCookies,
  ): Promise<User | null> => {
    const user = await endpointRequestOrNull({ endpoint: "/auth/@me", token });
    if (!user) {
      return null;
    }
    cookie.set("auth", JSON.stringify(user.auth));

    return user.user;
  },
);

export const getMeByCookieToken = cache(
  async (cookieToken?: string): Promise<User | null> => {
    const token = cookieToken ? cookieToken : await getToken();
    if (!token) {
      return null;
    }

    const user = await endpointRequestOrNull({ endpoint: "/auth/@me", token });
    if (!user) {
      return null;
    }

    return user.user;
  },
);

export const getUser = cache(async (slug: string): Promise<User | null> => {
  const user = await endpointRequestOrNull({ endpoint: `/users/${slug}` });
  if (!user) {
    return null;
  }

  if ("user" in user) {
    return user.user;
  }

  return user;
});

export const getMe = cache(
  async (token?: string | null): Promise<User | null> => {
    const cookie = await cookies();

    const userFromCookie = cookie.get("user");
    if (userFromCookie) {
      return JSON.parse(userFromCookie.value);
    }

    if (token) {
      cookie.set("token", token);
    }

    const user = await (token
      ? getMeByToken(token, cookie)
      : getMeByCookieToken(cookie.get("token")?.value));
    if (!user) {
      return null;
    }

    cookie.set("user", JSON.stringify(user), {
      expires: new Date().getTime() + 5 * 60 * 1000,
    });

    return user;
  },
);
