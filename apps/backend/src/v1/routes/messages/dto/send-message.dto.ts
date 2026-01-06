import type { Message } from "@/v1/types";

import { ApiProperty } from "@nestjs/swagger";

import { IsString } from "class-validator";

type MessageData = Omit<Message, "id"|"readedBy"|"deliveredTo"|"createdAt"|"updatedAt"> & {
  createdAt?: Date
};

export class SendMessageDto implements MessageData {
  @ApiProperty()
  @IsString()
  senderId: string;
  
  @ApiProperty()
  @IsString()
  chatId: string;

  @ApiProperty()
  @IsString()
  text: string;
}
