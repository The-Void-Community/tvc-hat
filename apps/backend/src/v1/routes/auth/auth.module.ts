import { Module } from "@nestjs/common";

import { Controller } from "./auth.controller";
import { Service } from "./auth.service";

import PrismaService from "@/database/prisma.service";

@Module({
  providers: [PrismaService, Service],
  controllers: [Controller],
})
export default class AuthModule {}
