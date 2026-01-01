import type { User } from "@1/types";

import type { UserUpdateDto } from "./dto/user-update.dto";

import PrismaService from "@/database/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class Service {
  public static resolveUserSlug(slug: string) {
    return slug[0] === "@"
      ? { username: slug.slice(1) }
      : { id: slug }
  }

  public constructor(private readonly prisma: PrismaService) {}

  public getOne(slug: string): Promise<User|null> {
    return this.prisma.user.findUnique({ where: Service.resolveUserSlug(slug) });
  }

  public put(slug: string, data: UserUpdateDto): Promise<User> {
    return this.prisma.user.update({ where: Service.resolveUserSlug(slug), data });
  }
  
  public patch(slug: string, data: UserUpdateDto): Promise<User> {
    return this.prisma.user.update({ where: Service.resolveUserSlug(slug), data });
  }

  public async delete(slug: string): Promise<string> {
    await this.prisma.user.delete({ where: Service.resolveUserSlug(slug) });
    return "deleted";
  }
}