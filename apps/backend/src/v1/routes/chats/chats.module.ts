import { Module } from "@nestjs/common";

import { PrismaService } from "@/database/prisma.service";

import { Controller } from "./chats.controller";
import { Service } from "./chats.service";

@Module({
  imports: [],
  controllers: [Controller],
  providers: [Service, PrismaService]
})
export default class ChatsModule {}
