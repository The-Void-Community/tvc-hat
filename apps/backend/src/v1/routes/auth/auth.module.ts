import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import PrismaService from "@/database/prisma.service";

@Module({
  providers: [PrismaService],
  controllers: [AuthController],
})
export default class AuthModule {}
