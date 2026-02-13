"use server";

import type { Parameters } from "./utils";

import { getToken } from "./get-token";
import { createEndpointUrl, getCacheInit } from "./utils";

export const endpointRequest = async ({
  init,
  tokenFromCookie = true,
  statusResponse = 200,
  tags,
  ...data
}: Parameters) => {
  const { next: requestInitNextFetch, cache: requestInitCache } = getCacheInit(
    data.cache,
  );
  const { next, cache, headers, body, ...requestInit } = init || {};

  try {
    const token = data.token
      ? data.token
      : tokenFromCookie
        ? await getToken()
        : null;

    const response = await fetch(createEndpointUrl(data).href, {
      method: requestInit?.method || "GET",
      headers: {
        authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
        ...headers,
      },
      next: {
        ...requestInitNextFetch,
        ...next,
        tags: tags,
      },
      cache: cache ? cache : requestInitCache,
      body: body,
      ...requestInit,
    });

    if (response.status !== statusResponse) {
      const { statusCode, message } = JSON.parse(await response.text());

      return {
        type: "status",
        response,
        statusCode,
        message,
        data: null,
      } as const;
    }

    return {
      data: await response.json(),
      type: "successed"
    } as const;
  } catch (error) {
    console.error(error);
    return {
      type: "error",
      error,
      data: null,
    } as const;
  }
};

export const endpointRequestOrNull = async (data: Parameters) => {
  const response = await endpointRequest(data);

  if (response.data) {
    return response.data;
  }

  return null;
};

export const endpointRequestOrThrow = async (data: Parameters) => {
  const response = await endpointRequest(data);

  if (response.error) {
    throw new Error("unknown error");
  }

  if (response.data) {
    return response.data;
  }

  return null;
};
