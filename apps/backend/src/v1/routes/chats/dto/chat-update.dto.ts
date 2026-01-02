import type { Chat } from "@1/types";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

type ChatData = Omit<
  Chat,
  "id" | "rights" | "type" | "createdAt" | "updatedAt" | "ownerId"
>;

export class ChatUpdateDto implements Partial<ChatData> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name?: string | undefined;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  chatname?: string | null | undefined;
}
