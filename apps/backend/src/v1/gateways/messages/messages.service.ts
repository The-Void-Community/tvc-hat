import type { Chat, Message } from "@/v1/types";
import { Injectable } from "@nestjs/common";

import { Service as ChatsService } from "@1/routes/chats/chats.service";
import { PrismaService } from "@/database/prisma.service";

import { SendMessageDto } from "./dto/send-message.dto";

@Injectable()
export class Service {
  public constructor(
    private readonly chatsService: ChatsService,
    private readonly prisma: PrismaService,
  ) {}

  public async createMessageAndUpdateChat(data: SendMessageDto): Promise<{
    message: Message;
    chat: Chat;
  }> {
    const message = await this.prisma.message.create({
      data: {
        text: data.text,
        chatId: data.chat,
        senderId: data.user.id,
      },
    });

    const chat = await this.chatsService.addMessage(message.chatId, message.id);

    return {
      message,
      chat,
    };
  }
}
