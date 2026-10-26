import { IsArray, IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  graduationYear?: number;

  @IsOptional()
  @IsString()
  college?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
