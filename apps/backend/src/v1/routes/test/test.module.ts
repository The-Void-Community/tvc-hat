import { Module } from "@nestjs/common";

import { PrismaService } from "@/database/prisma.service";
import { Controller } from "./test.controller";

@Module({
  imports: [],
  controllers: [Controller],
  providers: [PrismaService],
})
export default class TestModule {}
