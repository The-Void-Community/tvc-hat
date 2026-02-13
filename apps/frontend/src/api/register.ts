"use server"

import { cookies } from "next/headers";
import { endpointRequest } from "./server-utils"

type RegisterParameters = {
  password: string
}

type BodyParameters = {
  nickname?: string;
  username: string;
}

export const register = async (headers: RegisterParameters, body: BodyParameters) => {
  const cookie = await cookies();

  const { data, type, message } = await endpointRequest({
    endpoint: "/auth/signup",
    cache: false,
    tokenFromCookie: false,
    init: {
      method: "POST",
      body: JSON.stringify(body),
      headers
    },
    statusResponse: 201
  });

  if (type === "successed") {
    cookie.set("user", JSON.stringify(data.user));
    cookie.set("auth", JSON.stringify(data.auth));
    cookie.set("token", data.token);
  
    return {
      type,
      user: data.user,
    } as const
  }

  if (type === "error") {
    return {
      type: "error",
      user: null,
      message: "server error"
    } as const;
  }

  return {
    type: "error",
    user: null,
    message: message
  } as const
}