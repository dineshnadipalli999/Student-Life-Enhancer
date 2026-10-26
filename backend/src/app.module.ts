import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthModule } from "./health/health.module";
import { CareersModule } from "./careers/careers.module";
import { SkillsModule } from "./skills/skills.module";
import { OpportunitiesModule } from "./opportunities/opportunities.module";
import { AuthModule } from "./auth/auth.module";
import { ProfileModule } from "./profile/profile.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { AdminModule } from "./admin/admin.module";
import { ContentModule } from "./content/content.module";
import { ApplicationsModule } from "./applications/applications.module";
import { MarketModule } from "./market/market.module";
import { CourseProgressModule } from "./course-progress/course-progress.module";
import { ResumeModule } from "./resume/resume.module";
import { AssistantModule } from "./assistant/assistant.module";
import { ScholarshipsModule } from "./scholarships/scholarships.module";

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}), PrismaModule, AuthModule, ProfileModule, NotificationsModule, AdminModule, ContentModule, ApplicationsModule, MarketModule, CourseProgressModule, ResumeModule, AssistantModule, ScholarshipsModule, HealthModule, CareersModule, SkillsModule, OpportunitiesModule],
})
export class AppModule {}