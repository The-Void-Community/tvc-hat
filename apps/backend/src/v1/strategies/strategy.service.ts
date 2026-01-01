import type { AuthTypes } from "@1/types";
import type { Profile } from "passport";
import type { VerifyCallback } from "passport-oauth2";
import type OAuth2 from "passport-oauth2";

import { PassportStrategy } from "@nestjs/passport";
import PrismaService from "@/database/prisma.service";

import { getPassportEnv } from "f@/env";
import { Injectable } from "@nestjs/common";

import { v4 as uuid } from "uuid";

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
            const authUser = await this.prisma.authUser.findUnique({
              where: {
                serviceId: profile.id,
              },
            });

            const createUserData = {
              data: {
                nickname: profile.displayName,
                username: uuid(),
              },
            };

            const user = !authUser
              ? await this.prisma.user.create(createUserData)
              : (await this.prisma.user.findUnique({
                  where: {
                    id: authUser.profileId,
                  },
                })) || (await this.prisma.user.create(createUserData));

            const auth = !authUser
              ? await this.prisma.authUser.create({
                  data: {
                    accessToken,
                    refreshToken,
                    profileId: user.id,
                    serviceId: profile.id,
                  },
                })
              : await this.prisma.authUser.update({
                  where: {
                    serviceId: profile.id,
                  },
                  data: {
                    accessToken,
                    refreshToken,
                    profileId: user.id,
                    serviceId: profile.id,
                  },
                });

            return done({ auth, user }, false);
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
}

export default AuthStrategyService;
