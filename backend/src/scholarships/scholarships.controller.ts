import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ScholarshipsService } from "./scholarships.service";

type ScholarshipInput = {
  title: string;
  provider?: string;
  description?: string;
  amount?: string;
  eligibility?: string;
  url?: string;
  deadline?: string;
};

@Controller("scholarships")
export class ScholarshipsController {
  constructor(private readonly service: ScholarshipsService) {}

  @Get()
  list() { return this.service.list(); }

  @Post()
  create(@Body() input: ScholarshipInput) { return this.service.create(input); }

  @Patch(":id")
  update(@Param("id") id: string, @Body() input: Partial<ScholarshipInput>) { return this.service.update(id, input); }

  @Delete(":id")
  remove(@Param("id") id: string) { return this.service.remove(id); }
}
