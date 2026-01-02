import type { Chat } from "@1/types";

import type { ChatCreateDto } from "./dto/chat-create.dto";
import type { ChatUpdateDto } from "./dto/chat-update.dto";
import type { RightsUpdateDto } from "./dto/rights-update.dto";

import { PrismaService } from "@/database/prisma.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Rights } from "@/services";
import BitField from "fbit-field";

@Injectable()
export class Service {
  public static resolveSlug(slug: string) {
    return slug[0] === "$" ? { chatname: slug.slice(1) } : { id: slug };
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

  public async getOne(slug: string): Promise<Chat | null> {
    return this.prisma.chat.findUnique({ where: Service.resolveSlug(slug) });
  }

  public async post(data: ChatCreateDto, userId: string): Promise<Chat> {
    return this.prisma.chat.create({
      data: {
        ...data,
        ownerId: userId,
      },
    });
  }

  public async put(
    slug: string,
    data: ChatUpdateDto,
    userId: string,
  ): Promise<Chat> {
    const chat = await this.prisma.chat.findUnique({
      where: Service.resolveSlug(slug),
    });
    if (!Service.hasRights(chat, userId)) {
      throw new HttpException("No rights", HttpStatus.UNAUTHORIZED);
    }

    return this.prisma.chat.update({
      where: Service.resolveSlug(slug),
      data,
    });
  }

  public async patch(
    slug: string,
    data: ChatUpdateDto,
    userId: string,
  ): Promise<Chat> {
    const chat = await this.prisma.chat.findUnique({
      where: Service.resolveSlug(slug),
    });
    if (!Service.hasRights(chat, userId)) {
      throw new HttpException("No rights", HttpStatus.UNAUTHORIZED);
    }

    return this.prisma.chat.update({
      where: Service.resolveSlug(slug),
      data,
    });
  }

  public async patchRights(
    slug: string,
    data: RightsUpdateDto,
    userId: string,
  ) {
    const chat = await this.prisma.chat.findUnique({
      where: Service.resolveSlug(slug),
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
      where: Service.resolveSlug(slug),
      data: {
        rights: {
          ...(chat!.rights as Record<string, string>),
          [data.userId]: rights.toString(),
        },
      },
    });
  }

  public async delete(slug: string, userId: string): Promise<string> {
    const chat = await this.prisma.chat.findUnique({
      where: Service.resolveSlug(slug),
    });
    if (!Service.hasRights(chat, userId)) {
      throw new HttpException("No rights", HttpStatus.UNAUTHORIZED);
    }

    await this.prisma.chat.delete({
      where: Service.resolveSlug(slug),
    });

    return "deleted";
  }
}
