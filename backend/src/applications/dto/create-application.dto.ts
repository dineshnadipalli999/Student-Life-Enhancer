import { IsString } from "class-validator";

export class CreateApplicationDto {
  @IsString()
  opportunityId!: string;
}
