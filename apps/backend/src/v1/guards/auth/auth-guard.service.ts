import type { Request } from "express";
import type { IncomingMessage } from "http";

import Hash from "@1/services/hash.service";
import authErrors from "@1/errors/guards/auth.errors";

import PrismaService from "@/database/prisma.service";

export class Service {
  public static async validateRequest(
    req: Request | IncomingMessage,
    prisma: PrismaService,
  ) {
    const { successed, id, token, profileId } = Hash.parse(req);

    if (!successed) {
      throw new Error(authErrors.hashParseError);
    }

    const findedUser = await prisma.authUser.findUnique({
      where: { id },
    });
    if (!findedUser) {
      throw new Error(authErrors.userNotFound);
    }

    if (findedUser.profileId !== profileId) {
      throw new Error(authErrors.profileIdError);
    }

    if (token !== new Hash().execute(findedUser.accessToken)) {
      throw new Error(authErrors.tokenError);
    }

    const profileUser = prisma.user.findUnique({
      where: {
        id: findedUser.profileId,
      },
    });
    if (!profileUser) {
      throw new Error(authErrors.profileNotFound);
    }

    console.log("User access granted");
    return true;
  }
}

export default Service;
