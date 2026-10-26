import { IsString, MinLength } from "class-validator";

export class CreateProjectDto {
  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  @MinLength(2)
  description!: string;

  @IsString()
  @MinLength(2)
  difficulty!: string;

  @IsString()
  @MinLength(2)
  skills!: string;

  @IsString()
  @MinLength(8)
  url!: string;
}
