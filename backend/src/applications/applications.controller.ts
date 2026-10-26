import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApplicationStatus } from "@prisma/client";
import { ApplicationsService } from "./applications.service";
import { CreateApplicationDto } from "./dto/create-application.dto";

@Controller()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get("applications/:userId") listForStudent(@Param("userId") userId: string) { return this.applicationsService.listForStudent(userId); }
  @Post("applications/:userId") create(@Param("userId") userId: string, @Body() dto: CreateApplicationDto) { return this.applicationsService.create(userId, dto); }
  @Get("admin/applications") listForAdmin() { return this.applicationsService.listForAdmin(); }
  @Patch("admin/applications/:id") updateStatus(@Param("id") id: string, @Body("status") status: ApplicationStatus) { return this.applicationsService.updateStatus(id, status); }
}
