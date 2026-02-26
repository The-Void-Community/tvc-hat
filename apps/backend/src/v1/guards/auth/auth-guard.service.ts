import type { Request } from "express";
import type { IncomingMessage } from "http";

import Hash from "@1/services/hash.service";
import authErrors from "@1/errors/guards/auth.errors";

import PrismaService from "@/database/prisma.service";
import { HttpException, HttpStatus } from "@nestjs/common";

export class Service {
  public static async validateRequest(
    req: Request | IncomingMessage,
    prisma: PrismaService,
  ) {
    const { successed, id, token, userId } = Hash.parse(req);

    if (!successed) {
      throw new HttpException(
        authErrors.hashParseError,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const findedUser = await prisma.auth.findUnique({
      where: { id },
    });
    if (!findedUser) {
      throw new HttpException(authErrors.userNotFound, HttpStatus.UNAUTHORIZED);
    }

    if (findedUser.userId !== userId) {
      throw new HttpException(
        authErrors.profileIdError,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (token !== new Hash().execute(findedUser.accessToken)) {
      throw new HttpException(authErrors.tokenError, HttpStatus.UNAUTHORIZED);
    }

    const profileUser = prisma.user.findUnique({
      where: {
        id: findedUser.userId,
      },
    });
    if (!profileUser) {
      throw new HttpException(
        authErrors.profileNotFound,
        HttpStatus.UNAUTHORIZED,
      );
    }

    console.log("User access granted");
    return true;
  }
}

export default Service;
