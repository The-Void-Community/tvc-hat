import { Rights } from "@/services";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString, IsOptional } from "class-validator";

type ChatRights = Record<keyof typeof Rights.RAW.chat, boolean>;

export class RightsUpdateDto implements Partial<Omit<ChatRights, "admin">> {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  kick?: boolean;
  
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  mute?: boolean;
  
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  ban?: boolean;
  
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  alienEdit?: boolean;
  
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  alienDelete?: boolean;
  
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  send?: boolean;
  
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  selfEdit?: boolean;
  
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  selfDelete?: boolean;
}