import type { User } from "@1/types";
import { UserStatus } from "@1/types";

import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { Transform } from "class-transformer";

type UserData = Pick<
  User,
  "username" | "nickname" | "avatar" | "bio" | "status" | "isProfilePublic"
>;

const stringTransform = (value: string) => {
  return typeof value === "string" ? value.trim() : value;
};

export class UserUpdateDto implements Partial<UserData> {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => stringTransform(value))
  username?: string | undefined;
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => stringTransform(value))
  nickname?: string | undefined;

  @ApiProperty()
  @IsString()
  avatar?: string | null | undefined;
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => stringTransform(value))
  bio?: string | null | undefined;

  @ApiProperty()
  @IsEnum(UserStatus)
  status?: UserStatus | undefined;
  @ApiProperty()
  @IsString()
  isProfilePublic?: boolean | undefined;
}
