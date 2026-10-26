import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { CourseProgressController } from "./course-progress.controller";
import { CourseProgressService } from "./course-progress.service";

@Module({ imports: [PrismaModule], controllers: [CourseProgressController], providers: [CourseProgressService] })
export class CourseProgressModule {}
