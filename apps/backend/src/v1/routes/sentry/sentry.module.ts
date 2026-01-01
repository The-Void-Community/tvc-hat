import { Module } from "@nestjs/common";
import { Controller } from "./sentry.controller";

@Module({
  controllers: [Controller],
})
export default class SentryModule {}
