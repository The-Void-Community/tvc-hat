import PrismaService from "@/database/prisma.service";
import { AuthStrategyService } from "@/v1/strategies";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import AuthService from "@1/services/auth.service";
import { Auth, User } from "@/v1/types";
import { compressToEncodedURIComponent } from "lz-string";
import Hash from "@/v1/services/hash.service";
import { env } from "@/services";

const toStr = (str: unknown) => JSON.stringify(str, undefined, 4);

@Injectable()
export class Service {
  public constructor(private readonly prisma: PrismaService) {}

  public getAllMethods() {
    const { abbreviations, methods } = AuthService.methods;

    return {
      stringMethods: toStr(methods),
      stringAbbreviations: toStr(abbreviations),
      abbreviations,
      methods,
    };
  }

  public async getMe(authId: string, userId: string) {
    const auth = await this.prisma.auth.findUnique({
      where: { id: authId },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    return { auth, user };
  }

  public async postUser({
    username,
    nickname,
    password,
  }: {
    username: string;
    nickname: string;
    password: string;
  }) {
    return AuthStrategyService.signUpByPassword({
      password,
      prisma: this.prisma,
      username,
      nickname,
    });
  }

  public async getUserByPassowrd({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    return AuthStrategyService.signInByPassword({
      password,
      username,
      prisma: this.prisma,
    });
  }

  public getRedirectString(data: { auth: Auth; user: User } | null) {
    if (!data || !data.auth) {
      throw new HttpException("Server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const token = compressToEncodedURIComponent(
      JSON.stringify({
        id: data.auth.id,
        userId: data.auth.userId,
        accessToken: new Hash().execute(data.auth.accessToken),
      }),
    );

    return env.CLIENT_URL + "?token=" + token;
  }
}
