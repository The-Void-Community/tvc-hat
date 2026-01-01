import { Module } from "@nestjs/common";

import PrismaService from "@/database/prisma.service";

import { Controller } from "./users.controller";
import { Service } from "./users.service";

@Module({
  imports: [],
  controllers: [Controller],
  providers: [Service, PrismaService]
})
export default class UsersModule {}
