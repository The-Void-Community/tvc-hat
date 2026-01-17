import type { User } from "@1/types";
import { UserStatus } from "@1/types";

import { ApiProperty } from "@nestjs/swagger";

import { Nullable } from "@/decorators/nullable.decorator";
import { IsDate, IsEnum, IsString } from "class-validator";
import { Transform } from "class-transformer";

const stringTransform = (value: string) => {
  return typeof value === "string" ? value.trim() : value;
};

export class UserDto implements User {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  @Transform(({ value }) => stringTransform(value)?.toLowerCase?.())
  username: string;
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => stringTransform(value))
  nickname: string;

  @ApiProperty()
  @IsString()
  @Nullable()
  avatar: string | null;
  @ApiProperty()
  @IsString()
  @Nullable()
  @Transform(({ value }) => stringTransform(value))
  bio: string | null;

  @ApiProperty()
  @IsEnum(UserStatus)
  status: UserStatus;
  @ApiProperty()
  @IsString()
  isProfilePublic: boolean;

  @ApiProperty()
  @IsString({
    each: true,
  })
  chats: string[];

  @ApiProperty()
  @IsDate()
  @Nullable()
  lastSeenAt: Date | null;
  @ApiProperty()
  @IsDate()
  createdAt: Date;
  @ApiProperty()
  @IsDate()
  @Nullable()
  updatedAt: Date | null;
}
