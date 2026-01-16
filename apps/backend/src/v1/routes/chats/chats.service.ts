import type { Chat } from "@1/types";

import type { ChatCreateDto } from "./dto/chat-create.dto";
import type { ChatUpdateDto } from "./dto/chat-update.dto";
import type { RightsUpdateDto } from "./dto/rights-update.dto";

import type { IdOrChatname } from "@/v1/pipes/slug.pipe";
import { CHARS } from "@/v1/pipes/slug.pipe";

import { PrismaService } from "@/database/prisma.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Rights } from "@/services";

import BitField from "fbit-field";

@Injectable()
export class Service {
  public static resolveSlug(slug: string) {
    return slug[0] === CHARS.chatname
      ? { chatname: slug.slice(1) }
      : { id: slug };
  }

  public static hasRights(
    chat: Chat | null,
    userId: string,
    rights?: bigint,
  ): boolean {
    if (!chat) {
      throw new HttpException("Chat not found", HttpStatus.BAD_REQUEST);
    }

    if (chat.ownerId === userId) {
      return true;
    }

    if (rights === undefined) {
      return false;
    }

    const chatRights = chat.rights as Record<string, string | undefined>;
    const userRights = chatRights[userId]
      ? BigInt(chatRights[userId])
      : Rights.Chat.RAW_DEFAULT;

    return (userRights & rights) === rights;
  }

  public constructor(private readonly prisma: PrismaService) {}

  public getMany(slugs: string[]): Promise<Chat[]> {
    return this.prisma.chat.findMany({
      where: {
        OR: slugs.map((slug) => Service.resolveSlug(slug)),
      },
    });
  }

  public getOne(slug: IdOrChatname): Promise<Chat | null> {
    return this.prisma.chat.findUnique({ where: slug });
  }

  public getUserChats(id: string) {
    return this.prisma.chat.findMany({
      where: {
        members: {
          has: id,
        },
      },
    });
  }

  public getDirectChat(userOne: string, userTwo: string): Promise<Chat | null> {
    return this.prisma.chat.findUnique({
      where: {
        chatname: `${userOne}:${userTwo}`,
        OR: [
          {
            chatname: `${userTwo}:${userOne}`,
          },
        ],
      },
    });
  }

  public createDirectChat(userOne: string, userTwo: string): Promise<Chat> {
    return this.prisma.chat.create({
      data: {
        name: `${userOne}:${userTwo}`,
        chatname: `${userOne}:${userTwo}`,
        ownerId: "tvc-hat",
        members: [userOne, userTwo],
        type: "DIRECT",
      },
    });
  }

  public post(data: ChatCreateDto, userId: string): Promise<Chat> {
    return this.prisma.chat.create({
      data: {
        ...data,
        ownerId: userId,
        members: [userId],
      },
    });
  }

  public async put(
    slug: IdOrChatname,
    data: ChatUpdateDto,
    userId: string,
  ): Promise<Chat> {
    const chat = await this.prisma.chat.findUnique({
      where: slug,
    });
    if (!Service.hasRights(chat, userId)) {
      throw new HttpException("No rights", HttpStatus.UNAUTHORIZED);
    }

    return this.prisma.chat.update({
      where: slug,
      data,
    });
  }

  public async patch(
    slug: IdOrChatname,
    data: ChatUpdateDto,
    userId: string,
  ): Promise<Chat> {
    const chat = await this.prisma.chat.findUnique({
      where: slug,
    });
    if (!Service.hasRights(chat, userId)) {
      throw new HttpException("No rights", HttpStatus.UNAUTHORIZED);
    }

    return this.prisma.chat.update({
      where: slug,
      data,
    });
  }

  public async patchRights(
    slug: IdOrChatname,
    data: RightsUpdateDto,
    userId: string,
  ) {
    const chat = await this.prisma.chat.findUnique({
      where: slug,
    });
    if (!Service.hasRights(chat, userId, Rights.RAW.chat.admin)) {
      throw new HttpException("No rights", HttpStatus.UNAUTHORIZED);
    }

    const isAdminInRights = "admin" in data && data.admin === true;
    const isUserOwner = chat!.ownerId === userId;
    if (isAdminInRights && !isUserOwner) {
      throw new HttpException("No rights", HttpStatus.UNAUTHORIZED);
    }

    const filtered = Object.keys(data)
      .filter((key) => key !== "userId")
      .filter((key) => data[key] === true);

    const rights = BitField.summarize(
      ...filtered.map((key) => Rights.RAW.chat[key]),
    );

    return this.prisma.chat.update({
      where: slug,
      data: {
        rights: {
          ...(chat!.rights as Record<string, string>),
          [data.userId]: rights.toString(),
        },
      },
    });
  }

  public async patchJoin(slug: IdOrChatname, userId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: slug,
      select: { members: true },
    });

    if (!chat) {
      throw new HttpException(
        "Chat not found",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.prisma.chat.update({
      where: slug,
      data: {
        members: [...chat.members, userId],
      },
    });
  }

  public async delete(slug: IdOrChatname, userId: string): Promise<string> {
    const chat = await this.prisma.chat.findUnique({
      where: slug,
    });
    if (!Service.hasRights(chat, userId)) {
      throw new HttpException("No rights", HttpStatus.UNAUTHORIZED);
    }

    await this.prisma.chat.delete({
      where: slug,
    });

    return "deleted";
  }

  public async addMessage(slug: IdOrChatname | Chat, messageId: string) {
    const chat =
      "ownerId" in slug
        ? slug
        : await this.prisma.chat.findUnique({
            where: slug,
            select: {
              messages: true,
            },
          });

    if (!chat) {
      throw new HttpException(
        "Chat not found",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.prisma.chat.update({
      where: "ownerId" in slug ? { id: slug.id } : slug,
      data: {
        messages: [...chat.messages, messageId],
      },
    });
  }
}
