import type { User } from "@1/types";
import { UserStatus } from "@1/types";

import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
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
  @IsOptional()
  @Transform(({ value }) => stringTransform(value)?.toLowerCase?.())
  username?: string | undefined;
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => stringTransform(value))
  nickname?: string | undefined;

  @ApiProperty()
  @IsString()
  @IsOptional()
  avatar?: string | null | undefined;
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => stringTransform(value))
  bio?: string | null | undefined;

  @ApiProperty()
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus | undefined;
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isProfilePublic?: boolean | undefined;
}
