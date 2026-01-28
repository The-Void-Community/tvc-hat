import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  username: string;
}

export class SignUpDto extends SignInDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  nickname?: string;
}