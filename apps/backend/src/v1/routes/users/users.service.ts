import type { User } from "@1/types";

import type { UserUpdateDto } from "./dto/user-update.dto";
import type { IdOrUsername } from "@/v1/pipes/slug.pipe";

import PrismaService from "@/database/prisma.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class Service {
  public constructor(private readonly prisma: PrismaService) {}

  public async usersHasRelationBySlug(
    firstSlug: IdOrUsername,
    secondSlug: IdOrUsername,
  ) {
    if ("id" in firstSlug && "id" in secondSlug) {
      if (firstSlug.id === secondSlug.id) {
        return true;
      }
    }

    if ("username" in firstSlug && "username" in secondSlug) {
      if (firstSlug.username === secondSlug.username) {
        return true;
      }
    }

    const first = await this.getOne(firstSlug);
    const second = await this.getOne(secondSlug);

    if (!first || !second) {
      throw new HttpException("Server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return this.usersHasRelation(first, second);
  }

  public usersHasRelation(first: User, second: User) {
    if (first.id === second.id) {
      return true;
    }

    const chats =
      first.chats.length <= second.chats.length
        ? ([first.chats, second.chats] as const)
        : ([second.chats, first.chats] as const);

    return chats[0].some((chat) => chats[1].includes(chat));
  }

  public getOne(
    slug: IdOrUsername,
    hasRelation: boolean = true,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: slug,
      select: {
        avatar: true,
        bio: true,
        id: true,
        nickname: true,
        updatedAt: true,
        username: true,
        isProfilePublic: true,
        status: hasRelation,
        lastSeenAt: hasRelation,
        chats: hasRelation,
        createdAt: hasRelation,
      },
    });
  }

  public put(slug: IdOrUsername, data: UserUpdateDto): Promise<User> {
    return this.prisma.user.update({
      where: slug,
      data,
    });
  }

  public patch(slug: IdOrUsername, data: UserUpdateDto): Promise<User> {
    return this.prisma.user.update({
      where: slug,
      data,
    });
  }

  public async delete(slug: IdOrUsername): Promise<string> {
    await this.prisma.user.delete({ where: slug });
    return "deleted";
  }
}
