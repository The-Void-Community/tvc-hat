import type { Request } from 'express';
import { PipeTransform, Injectable } from '@nestjs/common';

import Hash from '../services/hash.service';

type Slugs = "username"|"chatname";

export type IdOrValue<T extends string> = {
  id: string;
} | {
  [P in T]: string
};

export type Slug<T extends Slugs> = {
  type: "me"
  value: string
} | {
  type: "id"
  value: { id: string }
} | {
  type: T;
  value: {
    [P in T]: string
  }
};

export const CHARS: Record<Slugs, string> = {
  username: "@",
  chatname: "$"
};

export type IdOrUsername = IdOrValue<"username">;
export type IdOrChatname = IdOrValue<"chatname">;
export type UserSlug = Slug<"username">;
export type ChatSlug = Slug<"chatname">;

@Injectable()
export class SlugPipe<T extends Slugs> implements PipeTransform {
  protected readonly char: string;

  public static resolve<T extends Slugs>(req: Request, slug: Slug<T>): IdOrValue<T> {
    if (slug.type === "me") {
      return { id: Hash.parseOrThrow(req).profileId }
    }

    return slug.value as IdOrValue<T>;
  }

  public constructor(private readonly type: Slugs) {
    this.char = CHARS[type];
  }

  public transform(slug: string): Slug<T> {  
    if (slug === "@me") {
      return {
        type: "me",
        value: slug
      };
    }

    if (slug[0] === "@") {
      return { type: this.type, value: { [this.type]: slug.slice(1) } } as Slug<T>;
    }

    return { type: "id", value: { id: slug} };
  }  
}

export const UserSlugPipe = new SlugPipe("username");
export const ChatSlugPipe = new SlugPipe("chatname");