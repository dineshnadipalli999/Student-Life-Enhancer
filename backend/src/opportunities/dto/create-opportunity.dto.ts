import { IsArray, IsEnum, IsString, MinLength } from "class-validator";
import { OpportunityType } from "@prisma/client";

export class CreateOpportunityDto {
  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  @MinLength(2)
  company!: string;

  @IsString()
  @MinLength(2)
  description!: string;

  @IsString()
  @MinLength(2)
  location!: string;

  @IsEnum(OpportunityType)
  type!: OpportunityType;

  @IsString()
  @MinLength(8)
  url!: string;

  @IsArray()
  @IsString({ each: true })
  skills!: string[];
}
