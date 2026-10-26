import { IsString, MinLength } from "class-validator";

export class CreateCourseDto {
  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  @MinLength(2)
  description!: string;

  @IsString()
  @MinLength(2)
  provider!: string;

  @IsString()
  @MinLength(8)
  url!: string;

  @IsString()
  @MinLength(2)
  level!: string;

  @IsString()
  @MinLength(2)
  duration!: string;

  @IsString()
  @MinLength(2)
  skills!: string;
}
