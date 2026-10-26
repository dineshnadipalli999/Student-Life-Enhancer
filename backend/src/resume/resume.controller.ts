import { BadRequestException, Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ResumeService } from "./resume.service";

@Controller("resume")
export class ResumeController {
  constructor(private readonly service: ResumeService) {}
  @Get(":userId/latest")
  latest(@Param("userId") userId: string) { return this.service.latest(userId); }

  @Post(":userId/analyze")
  @UseInterceptors(FileInterceptor("file"))
  analyze(@Param("userId") userId: string, @Body("targetRole") targetRole: string, @UploadedFile() file?: { originalname: string; buffer: Buffer; mimetype: string }) {
    if (!file) throw new BadRequestException("Resume file is required");
    if (!file.buffer?.length) throw new BadRequestException("The uploaded resume is empty.");
    if (!targetRole?.trim()) throw new BadRequestException("Target role is required");
    return this.service.analyze(userId, file, targetRole.trim());
  }
}
