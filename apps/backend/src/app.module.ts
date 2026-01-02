import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from "@nestjs/common";

import { APP_PIPE, RouterModule } from "@nestjs/core";
import PrismaService from "./database/prisma.service";

import v1Module, { v1Modules } from "./v1/v1.module";

type RegisterModule = {
  module: new () => NestModule;
  children: (new () => unknown)[];
  path: string;
};

const modules: RegisterModule[] = [
  {
    module: v1Module,
    children: v1Modules,
    path: "v1",
  },
];

@Module({
  imports: [
    ...modules.flatMap(({ module, children, path }) => [
      module,
      RouterModule.register([
        {
          path: "api",
          module,
          children: children.flatMap((module) => [{ path, module }]),
        },
      ]),
    ]),
  ],
  providers: [
    PrismaService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export default class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes("/");
  }
}
