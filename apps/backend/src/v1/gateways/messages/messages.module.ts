import { Module } from "@nestjs/common";

import { Gateway } from "./messages.gateway";

@Module({
  providers: [Gateway],
})
export default class MessagesModule {}
