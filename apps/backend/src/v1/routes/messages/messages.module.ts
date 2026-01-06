import { Module } from "@nestjs/common";

import { Controller } from "./messages.controller";
import { Service } from "./messages.service";
import { PrismaService } from "@/database/prisma.service";
import { Service as ChatsService } from "@/v1/routes/chats/chats.service";

@Module({
  imports: [],
  controllers: [Controller],
  providers: [Service, ChatsService, PrismaService],
})
export default class MessagesModule {}
