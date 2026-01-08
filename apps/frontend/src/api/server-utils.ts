"use server";

import type { Parameters } from "./utils";

import { getToken } from "./get-token";
import { createEndpointUrl, getCacheInit } from "./utils";

export const endpointRequest = async ({ init, tokenFromCookie = true, ...data }: Parameters) => {
  const { next: requestInitNextFetch, cache: requestInitCache } = getCacheInit(
    data.cache,
  );
  const { next, cache, headers, ...requestInit } = init || {};

  try {
    const token = data.token
      ? data.token
      : tokenFromCookie
        ? await getToken()
        : null;

    const response = await fetch(createEndpointUrl(data).href, {
      method: "GET",
      headers: {
        authorization: token ? `Bearer ${token}` : "",
        ...headers,
      },
      next: {
        ...requestInitNextFetch,
        ...next,
      },
      cache: cache ? cache : requestInitCache,
      ...requestInit,
    });

    if (response.status !== 200) {
      return {
        response,
        data: null,
      } as const;
    }

    return {
      data: await response.json(),
    } as const;
  } catch (error) {
    console.error(error);
    return {
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
