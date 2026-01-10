import type { NestModule, MiddlewareConsumer } from "@nestjs/common";

import { Module } from "@nestjs/common";

import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  RouterModule,
} from "@nestjs/core";
import { CacheModule, CacheInterceptor } from "@nestjs/cache-manager";
import {
  SentryGlobalFilter,
  SentryModule as Sentry,
} from "@sentry/nestjs/setup";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import PrismaService from "@/database/prisma.service";

import { LoggerMiddleware } from "./middleware/logger.middleware";

import AuthStrategyService from "./strategies/strategy.service";
import AuthModule from "./routes/auth/auth.module";
import SentryModule from "./routes/sentry/sentry.module";
import TestModule from "./routes/test/test.module";
import UsersModule from "./routes/users/users.module";
import ChatsModule from "./routes/chats/chats.module";
import MessagesModule from "./routes/messages/messages.module";

import MessagesGatewayModule from "./gateways/messages/messages.module";

import env from "f@/env";

export const v1Modules = [
  AuthModule,
  SentryModule,
  TestModule,
  UsersModule,
  ChatsModule,
  MessagesModule,
];

@Module({
  imports: [
    MessagesGatewayModule,
    ...v1Modules.flatMap((module) => [
      module,
      RouterModule.register([{ path: "v1", module }]),
    ]),
    ThrottlerModule.forRoot([
      {
        ttl: +env.THROLLER_TIME_TO_LIVE_IN_MILLISECONDS,
        limit: 1000 /* INDEV DEVELOPMENT */,
      },
    ]),
    CacheModule.register({
      ttl: +env.CACHE_TIME_TO_LIVE_IN_MILLISECONDS,
      isGlobal: true,
    }),
    Sentry.forRoot(),
  ],
  providers: [
    PrismaService,
    AuthStrategyService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export default class v1Module implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("/");
  }
}
