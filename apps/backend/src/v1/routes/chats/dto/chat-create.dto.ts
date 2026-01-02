import type { Chat } from "@1/types";
import { ChatType } from "@1/types";

import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

type ChatData = Omit<Chat, "id"|"rights"|"createdAt"|"updatedAt"|"ownerId">;

export class ChatCreateDto implements ChatData {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty()
  @IsString()
  chatname: string | null;
  
  @ApiProperty()
  @IsEnum(ChatType)
  type: ChatType;
}