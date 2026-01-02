import { Module } from "@nestjs/common";

import { Service as ChatsService } from "@/v1/routes/chats/chats.service";
import { PrismaService } from "@/database/prisma.service";

import { Service } from "./messages.service";
import { Gateway } from "./messages.gateway";

@Module({
  providers: [Gateway, Service, ChatsService, PrismaService],
})
export default class MessagesModule {}
