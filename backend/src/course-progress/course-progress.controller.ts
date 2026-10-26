import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { CourseProgressService } from "./course-progress.service";

@Controller("course-progress")
export class CourseProgressController {
  constructor(private readonly service: CourseProgressService) {}
  @Get(":userId") list(@Param("userId") userId: string) { return this.service.list(userId); }
  @Patch(":userId/:courseId") update(@Param("userId") userId: string, @Param("courseId") courseId: string, @Body("completed") completed: boolean) { return this.service.update(userId, courseId, completed); }
}
