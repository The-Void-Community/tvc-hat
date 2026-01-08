import type { User } from "@1/types";

import type { UserUpdateDto } from "./dto/user-update.dto";
import type { IdOrUsername } from "@/v1/pipes/slug.pipe";

import PrismaService from "@/database/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class Service {
  public constructor(private readonly prisma: PrismaService) {}

  public getOne(slug: IdOrUsername): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: slug,
    });
  }

  public put(slug: IdOrUsername, data: UserUpdateDto): Promise<User> {
    return this.prisma.user.update({
      where: slug,
      data,
    });
  }

  public patch(slug: IdOrUsername, data: UserUpdateDto): Promise<User> {
    return this.prisma.user.update({
      where: slug,
      data,
    });
  }

  public async delete(slug: IdOrUsername): Promise<string> {
    await this.prisma.user.delete({ where: slug });
    return "deleted";
  }
}
