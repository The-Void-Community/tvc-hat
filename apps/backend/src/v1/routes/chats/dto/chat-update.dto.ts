import type { Chat } from "@1/types";

import { Nullable } from "@/decorators/nullable.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

type ChatData = Omit<
  Chat,
  "id" | "rights" | "type" | "createdAt" | "updatedAt" | "ownerId"
>;

export class ChatUpdateDto implements Partial<ChatData> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string | undefined;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Nullable()
  @IsOptional()
  chatname?: string | null | undefined;
}
