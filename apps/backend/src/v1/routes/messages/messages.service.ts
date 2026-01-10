import type { Chat, Message } from "@/v1/types";
import { Injectable } from "@nestjs/common";

import { Service as ChatsService } from "@1/routes/chats/chats.service";
import { PrismaService } from "@/database/prisma.service";

import { SendMessageDto } from "./dto/send-message.dto";
import { MessageUpdateDto } from "./dto/message-update.dto";

@Injectable()
export class Service {
  public constructor(
    private readonly chatsService: ChatsService,
    private readonly prisma: PrismaService,
  ) {}

  public async get(filter: {
    skip: number;
    count: number;
    chatId: string;
    positionMessageId?: string;
    sort?: string;
  }) {
    const messages = await this.prisma.message.findMany({
      skip: filter.skip,
      cursor: filter.positionMessageId
        ? { id: filter.positionMessageId }
        : undefined,
      take: filter.count,
      where: { chatId: filter.chatId },
      orderBy: {
        createdAt: filter.sort === "asc" ? "asc" : "desc",
      },
    });

    return messages;
  }

  public async getOne(id: string) {
    return this.prisma.message.findUnique({ where: { id } });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async put(id: string, data: MessageUpdateDto) {
    throw new Error("Method not realized.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async patch(id: string, data: MessageUpdateDto) {
    throw new Error("Method not realized.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async delete(id: string) {
    throw new Error("Method not realized.");
  }

  public async createMessageAndUpdateChat(
    data: SendMessageDto & { senderId: string },
  ): Promise<{
    message: Message;
    chat: Chat;
  }> {
    const message = await this.prisma.message.create({
      data,
    });

    const chat = await this.chatsService.addMessage(
      { id: message.chatId },
      message.id,
    );

    return {
      message,
      chat,
    };
  }
}
