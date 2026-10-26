import { IsNumber, IsString, MinLength } from "class-validator";

export class CreateMarketTrendDto {
  @IsString()
  @MinLength(2)
  career!: string;

  @IsString()
  @MinLength(2)
  skill!: string;

  @IsString()
  @MinLength(2)
  demand!: string;

  @IsNumber()
  growth!: number;

  @IsString()
  @MinLength(2)
  description!: string;
}
