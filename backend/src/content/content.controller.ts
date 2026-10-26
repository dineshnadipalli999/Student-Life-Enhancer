import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ContentService } from "./content.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { CreateProjectDto } from "./dto/create-project.dto";

@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get("courses") courses() { return this.contentService.courses(); }
  @Get("projects") projects() { return this.contentService.projects(); }
  @Get("projects/:userId") studentProjects(@Param("userId") userId: string) { return this.contentService.projects(userId); }
  @Post("projects/:userId") createStudentProject(@Param("userId") userId: string, @Body() dto: CreateProjectDto) { return this.contentService.createStudentProject(userId, dto); }
  @Delete("projects/:userId/:id") deleteStudentProject(@Param("userId") userId: string, @Param("id") id: string) { return this.contentService.deleteStudentProject(userId, id); }
  @Post("admin/courses") createCourse(@Body() dto: CreateCourseDto) { return this.contentService.createCourse(dto); }
  @Patch("admin/courses/:id") updateCourse(@Param("id") id: string, @Body() dto: Partial<CreateCourseDto>) { return this.contentService.updateCourse(id, dto); }
  @Delete("admin/courses/:id") deleteCourse(@Param("id") id: string) { return this.contentService.deleteCourse(id); }
  @Post("admin/projects") createProject(@Body() dto: CreateProjectDto) { return this.contentService.createProject(dto); }
}
