import type { Chat } from "@1/types";
import { ChatType } from "@1/types";

import { ApiProperty } from "@nestjs/swagger";

import { Nullable } from "@/decorators/nullable.decorator";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

type ChatData = Omit<
  Chat,
  | "id"
  | "rights"
  | "createdAt"
  | "updatedAt"
  | "ownerId"
  | "members"
  | "messages"
>;

export class ChatCreateDto implements ChatData {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @Nullable()
  chatname: string | null;

  @ApiProperty()
  @IsEnum(ChatType)
  type: ChatType;
}
