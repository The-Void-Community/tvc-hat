import { UserDto } from "@/v1/routes/users/dto/user.dto";

import { ApiProperty } from "@nestjs/swagger";

import { IsString } from "class-validator";

export class SendMessageDto {
  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  @IsString()
  chat: string;

  @ApiProperty()
  @IsString()
  text: string;
}
