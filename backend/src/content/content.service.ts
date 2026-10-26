import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { CreateProjectDto } from "./dto/create-project.dto";

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  courses() { return this.prisma.course.findMany({ orderBy: { createdAt: "desc" } }); }
  projects(userId?: string) { return this.prisma.project.findMany({ where: userId ? { ownerId: userId } : undefined, orderBy: { createdAt: "desc" } }); }
  createCourse(dto: CreateCourseDto) { return this.prisma.course.create({ data: dto }); }
  async updateCourse(id: string, dto: Partial<CreateCourseDto>) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException("Course not found");
    return this.prisma.course.update({ where: { id }, data: dto });
  }
  async deleteCourse(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException("Course not found");
    return this.prisma.course.delete({ where: { id } });
  }
  createProject(dto: CreateProjectDto) { return this.prisma.project.create({ data: dto }); }
  createStudentProject(userId: string, dto: CreateProjectDto) { return this.prisma.project.create({ data: { ...dto, ownerId: userId } }); }
  deleteStudentProject(userId: string, id: string) { return this.prisma.project.deleteMany({ where: { id, ownerId: userId } }); }
}
