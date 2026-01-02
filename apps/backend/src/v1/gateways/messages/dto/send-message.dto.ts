import { UserDto } from "@/v1/routes/users/dto/user.dto";

import { ApiProperty } from "@nestjs/swagger";

import { Type } from "class-transformer";
import { IsString } from "class-validator";

export class SendMessageDto {
  @ApiProperty()
  @Type(() => UserDto)
  user: UserDto;

  @ApiProperty()
  @IsString()
  chat: string;

  @ApiProperty()
  @IsString()
  text: string;
}
