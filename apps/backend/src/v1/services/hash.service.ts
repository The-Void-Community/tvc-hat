import type { Request } from "express";

import crypto from "crypto";
import { decompressFromEncodedURIComponent } from "lz-string";

import { env } from "f@/env";
import { HttpException, HttpStatus } from "@nestjs/common";

const PARSE_ERROR = {
  successed: false,
  id: false,
  profileId: false,
  token: false,
} as const;

type SuccessedParseReturnType = Readonly<{
  successed: true;
  id: string;
  profileId: string;
  token: string;
}>;

type ParseReturnType =
  | SuccessedParseReturnType
  | typeof PARSE_ERROR;

export class Hash {
  private readonly _hmac: crypto.Hmac;

  public constructor() {
    this._hmac = crypto.createHmac("sha512", env.HASH_KEY);
  }

  public execute(data: string) {
    this._hmac.update(data);
    return this._hmac.digest("hex");
  }

  public static resolveToken(token: string): ParseReturnType {
    const [method, ...hashData] = token.split(" ");
    const hash = hashData.join(" ");

    const tokenValided = Boolean(method && hash);
    if (!tokenValided) {
      return PARSE_ERROR;
    }

    if (method === "Bearer") {
      const { id, profileId, accessToken } = JSON.parse(
        decompressFromEncodedURIComponent(hash),
      );

      const valided = id && profileId && accessToken;
      if (!valided) {
        return PARSE_ERROR;
      }

      return {
        successed: true,
        id,
        profileId,
        token: accessToken,
      };
    } else {
      return PARSE_ERROR;
    }
  }

  public static parse(req: Request): ParseReturnType {
    const hash = req.headers.authorization;

    if (hash === undefined) {
      return PARSE_ERROR;
    }

    try {
      return Hash.resolveToken(hash.toString());
    } catch {
      return PARSE_ERROR;
    }
  }

  public static parseWithExeption(req: Request): SuccessedParseReturnType {
    const hash = req.headers.authorization;

    if (hash === undefined) {
      throw new HttpException("No token", HttpStatus.BAD_REQUEST);
    }

    try {
      const data = Hash.resolveToken(hash.toString());
      
      if (!data.successed) {
        throw new HttpException("Bad token", HttpStatus.UNAUTHORIZED);
      }

      return data;
    } catch {
      throw new HttpException("Server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

export default Hash;
