import { Module } from "@nestjs/common";

import { PrismaService } from "@/database/prisma.service";
import { Service as UsersService } from "@1/routes/users/users.service";

import { Controller } from "./chats.controller";
import { Service } from "./chats.service";

@Module({
  imports: [],
  controllers: [Controller],
  providers: [Service, PrismaService, UsersService],
})
export default class ChatsModule {}
