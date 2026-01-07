"use server";

import { getToken } from "./get-token";

const BASE_PATH_NAME = "/api/v1";
/**
 * НЕ ЗАБЫТЬ ВЫНЕСТИ В .ENV
 */
const API_URL: string = "http://localhost:8080" + BASE_PATH_NAME;
const BASE_URL: URL = new URL(API_URL);

type AvailableQueryTypes =
  | string
  | number
  | bigint
  | boolean
  | undefined
  | null;

type EndpointOrUrl = (
  | {
      endpoint: string;
      url?: undefined;
    }
  | {
      url: Partial<URL>;
      endpoint?: undefined;
    }
) & {
  query?: Record<string, AvailableQueryTypes | AvailableQueryTypes[]>;
  skipQueryUndefined?: boolean;
  skipQueryNull?: boolean;
};

const getCacheInit = (
  cache?: boolean,
): {
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
} => {
  if (!cache) {
    return {};
  }

  return {
    next: {
      revalidate: 1200,
    },
    cache: "force-cache",
  };
};

export const createEndpointUrl = ({
  url,
  endpoint,
  query = {},
  skipQueryNull = false,
  skipQueryUndefined = true,
}: EndpointOrUrl) => {
  const searchParams = new URLSearchParams(
    Object.fromEntries(
      Object.keys(query)
        .filter((key) => {
          const value = query[key];
          if (skipQueryUndefined && value === undefined) {
            return false;
          }
          if (skipQueryNull && value === null) {
            return false;
          }

          return true;
        })
        .map((key) => {
          const value = query[key];
          if (Array.isArray(value)) {
            return [key, value.join(",")];
          }

          return [key, value!.toString()];
        }),
    ),
  );

  if (endpoint) {
    return new URL({
      ...BASE_URL,
      pathname: BASE_PATH_NAME + endpoint,
      searchParams,
    });
  }

  return new URL({
    ...BASE_URL,
    ...url,
    searchParams,
  });
};

type Parameters = {
  token?: string;
  init?: RequestInit;
  cache?: boolean;
  tokenFromCookie?: boolean;
} & EndpointOrUrl;

export const endpointRequest = async ({ init, ...data }: Parameters) => {
  const { next: requestInitNextFetch, cache: requestInitCache } = getCacheInit(
    data.cache,
  );
  const { next, cache, headers, ...requestInit } = init || {};

  try {
    const token = data.token
      ? data.token
      : data.tokenFromCookie
        ? await getToken()
        : null;

    const response = await fetch(createEndpointUrl(data).toString(), {
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
