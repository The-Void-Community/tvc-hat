import { Module } from "@nestjs/common";

import { Controller } from "./test.controller";

@Module({
  imports: [],
  controllers: [Controller],
  providers: [],
})
export default class TestModule {}
