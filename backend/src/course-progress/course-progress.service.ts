import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CourseProgressService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.courseProgress.findMany({ where: { userId } });
  }

  async update(userId: string, courseId: string, completed: boolean) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException("Course not found");
    return this.prisma.courseProgress.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId, completed, completedAt: completed ? new Date() : null },
      update: { completed, completedAt: completed ? new Date() : null },
    });
  }
}
