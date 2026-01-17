"use server";

import type { User } from "@/types";
import { endpointRequestOrNull } from "./server-utils";
import { cookies } from "next/headers";

export const patchMe = async (data: Partial<User>): Promise<User | null> => {
  const cookie = await cookies();
  const response = await endpointRequestOrNull({
    endpoint: "/users/@me",
    cache: false,
    init: {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  });

  if (!response) {
    return null;
  }

  cookie.set("user", JSON.stringify(response));
  return response;
};
