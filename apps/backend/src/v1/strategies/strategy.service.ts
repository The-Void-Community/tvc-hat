import type { AuthTypes } from "@1/types";
import type { Profile } from "passport";
import type { VerifyCallback } from "passport-oauth2";
import type OAuth2 from "passport-oauth2";

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import PrismaService from "@/database/prisma.service";
import Hash from "../services/hash.service";

import { getPassportEnv } from "f@/env";
import { v4 as uuid } from "uuid";
import { UsernamePipe } from "../pipes/username.pipe";
import { compressToEncodedURIComponent } from "lz-string";

type Strategies = Map<AuthTypes, OAuth2Strategy>;
type OAuth2ServiceProperties = {
  path: string;
  scopes: string[];
};

interface PassportStrategyMixin<TValidationResult = unknown> {
  validate(...args: unknown[]): TValidationResult | Promise<TValidationResult>;
}

export type OAuth2Strategy = OAuth2 & PassportStrategyMixin;

const oauth2Services: Record<AuthTypes, OAuth2ServiceProperties> = {
  google: {
    path: "passport-google-oauth20",
    scopes: ["profile", "email"],
  },
};

@Injectable()
export class AuthStrategyService {
  public static readonly strategies: Strategies = new Map();
  public readonly strategies: Strategies = new Map();

  public static getStrategy(strategy: string): OAuth2Strategy | null {
    const output = this.strategies.get(strategy as AuthTypes);
    return output || null;
  }

  public constructor(private readonly prisma: PrismaService) {
    this.execute();
  }

  public static async signUpByPassword({
    username,
    password,
    prisma,
    nickname,
  }: {
    username: string;
    nickname?: string;
    password: string;
    prisma: PrismaService;
  }) {
    const hash = new Hash().execute(password);
    const serviceId = uuid();

    return this.singUp({
      accessToken: hash,
      username: username,
      nickname: nickname,
      password: hash,
      serviceId,
      prisma,
    });
  }

  public static async signUpByService({
    accessToken,
    prisma,
    profile,
    refreshToken,
  }: {
    profile: Profile;
    accessToken: string;
    refreshToken?: string;
    prisma: PrismaService;
  }) {
    const profileUsername = (
      profile.username || profile.displayName
    ).toLowerCase();
    const nickname = profile.displayName;
    const username = (await prisma.user.findUnique({
      where: { username: profileUsername },
      select: { username: true },
    }))
      ? uuid()
      : profileUsername;

    return this.singUp({
      accessToken: accessToken,
      username: username,
      nickname: nickname,
      refreshToken: refreshToken,
      serviceId: profile.id,
      prisma,
    });
  }

  public static async signInByPassword({
    password,
    prisma,
    username,
  }: {
    username: string;
    password: string;
    prisma: PrismaService;
  }) {
    const user = await prisma.user.findUnique({
      where: { username: UsernamePipe.validate(username) },
    });

    if (!user) {
      throw new HttpException(
        `User with username ${username} is a Teapot (user not found)`,
        HttpStatus.I_AM_A_TEAPOT,
      );
    }

    const auth = await prisma.auth.findUnique({
      where: { userId: user.id },
    });

    if (!auth) {
      throw new HttpException(
        `Auth user not found`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!auth.password) {
      throw new HttpException(
        "Auth user does not have password",
        HttpStatus.FORBIDDEN,
      );
    }

    const hashedPassword = new Hash().execute(password);
    if (hashedPassword !== auth.password) {
      throw new HttpException("Password not equals", HttpStatus.FORBIDDEN);
    }

    return { user, auth };
  }

  public static async signInByService({
    accessToken,
    prisma,
    profile,
    refreshToken,
  }: {
    profile: Profile;
    accessToken: string;
    refreshToken?: string;
    prisma: PrismaService;
  }) {
    const auth = await prisma.auth.findUnique({
      where: {
        serviceId: profile.id,
      },
    });

    if (!auth) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: auth.userId,
      },
    });
    if (!user) {
      throw new HttpException(
        "user not found",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const newAuth = await prisma.auth.update({
      where: { id: auth.id },
      data: {
        accessToken,
        refreshToken,
      },
    });

    return {
      auth: newAuth,
      user,
    };
  }

  public execute(): this {
    for (const service in oauth2Services) {
      const { path, scopes } = oauth2Services[service];
      const client = getPassportEnv(
        service.toUpperCase() as Uppercase<AuthTypes>,
      );

      const { Strategy } = require(path);

      const ServiceStrategyClass = PassportStrategy(Strategy, service);
      const ServiceStrategy = new ServiceStrategyClass(
        {
          clientID: client.id,
          clientSecret: client.secret,
          callbackURL: client.callback,
          scope: scopes,
        },
        async (
          accessToken: string,
          refreshToken: string,
          profile: Profile,
          done: VerifyCallback,
        ) => {
          try {
            const parameters = {
              accessToken,
              refreshToken,
              profile,
              prisma: this.prisma,
            };

            const data =
              (await AuthStrategyService.signInByService(parameters)) ||
              (await AuthStrategyService.signUpByService(parameters));

            return done(false, data);
          } catch (error) {
            return done(error, false);
          }
        },
      ) as OAuth2Strategy;

      this.strategies.set(service as AuthTypes, ServiceStrategy);
      AuthStrategyService.strategies.set(service as AuthTypes, ServiceStrategy);
    }

    return this;
  }

  protected static async singUp({
    username,
    accessToken,
    prisma,
    nickname,
    password,
    serviceId = uuid(),
    refreshToken,
  }: {
    username: string;
    nickname?: string;
    accessToken: string;
    refreshToken?: string;
    password?: string;
    serviceId?: string;
    prisma: PrismaService;
  }) {
    const existedUser = await prisma.user.findUnique({
      where: {
        username: UsernamePipe.validate(username),
      },
    });

    if (existedUser) {
      throw new HttpException(
        `User with username "${username}" is exists`,
        HttpStatus.CONFLICT,
      );
    }

    const passwordData = password
      ? {
          password: password,
          tokenHashed: password === accessToken,
        }
      : {};

    const userId = uuid();

    const auth = await prisma.auth.create({
      data: {
        accessToken: accessToken,
        userId,
        serviceId,
        refreshToken: refreshToken,
        ...passwordData,
      },
    });

    const user = await prisma.user.create({
      data: {
        id: userId,
        nickname: nickname || username,
        username: username.toLowerCase(),
      },
    });

    const token = compressToEncodedURIComponent(
      JSON.stringify({
        id: auth.id,
        userId: auth.userId,
        token: new Hash().execute(auth.accessToken),
      }),
    );

    return {
      auth,
      user,
      token
    };
  }
}

export default AuthStrategyService;
