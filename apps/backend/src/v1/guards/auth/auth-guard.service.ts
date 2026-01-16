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
    const { successed, id, token, profileId } = Hash.parse(req);

    if (!successed) {
      throw new HttpException(authErrors.hashParseError, HttpStatus.UNAUTHORIZED);
    }

    const findedUser = await prisma.authUser.findUnique({
      where: { id },
    });
    if (!findedUser) {
      throw new HttpException(authErrors.userNotFound, HttpStatus.UNAUTHORIZED);
    }

    if (findedUser.profileId !== profileId) {
      throw new HttpException(authErrors.profileIdError, HttpStatus.UNAUTHORIZED);
    }

    if (token !== new Hash().execute(findedUser.accessToken)) {
      throw new HttpException(authErrors.tokenError, HttpStatus.UNAUTHORIZED);
    }

    const profileUser = prisma.user.findUnique({
      where: {
        id: findedUser.profileId,
      },
    });
    if (!profileUser) {
      throw new HttpException(authErrors.profileNotFound, HttpStatus.UNAUTHORIZED);
    }

    console.log("User access granted");
    return true;
  }
}

export default Service;
