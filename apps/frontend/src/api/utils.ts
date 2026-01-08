import type { Nullable, UrlType } from "@/constants/url";
import { BASE_PATH_NAME, BASE_URL } from "@/constants/url";

export type AvailableQueryTypes =
  | string
  | number
  | bigint
  | boolean
  | undefined
  | null;

export type EndpointOrUrl = (
  | {
      endpoint: string;
      url?: undefined;
    }
  | {
      url: Partial<Nullable<UrlType>>;
      endpoint?: undefined;
    }
) & {
  query?: Record<string, AvailableQueryTypes | AvailableQueryTypes[]>;
  skipQueryUndefined?: boolean;
  skipQueryNull?: boolean;
};

export type Parameters = {
  token?: string;
  init?: RequestInit;
  cache?: boolean;
  tokenFromCookie?: boolean;
} & EndpointOrUrl;

export const getCacheInit = (
  cache?: boolean,
): {
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
} => {
  if (cache === false) {
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
  const searchParams = new Map(
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
  );

  if (endpoint) {
    return BASE_URL.overwrite({
      pathname: BASE_PATH_NAME + endpoint,
      query: searchParams
    });
  }

  return BASE_URL.overwrite({
    ...url,
    query: searchParams,
  });
};