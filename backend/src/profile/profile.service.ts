import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async get(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: { include: { skills: { include: { skill: true } } } } },
    });
    if (!user) throw new NotFoundException("User not found");
    return this.toResponse(user);
  }

  async update(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    if (dto.name) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { name: dto.name.trim() },
      });
    }

    const profile = await this.prisma.studentProfile.upsert({
      where: { userId },
      create: {
        userId,
        degree: dto.degree,
        branch: dto.branch,
        graduationYear: dto.graduationYear,
        college: dto.college,
        location: dto.location,
        bio: dto.bio,
      },
      update: {
        degree: dto.degree,
        branch: dto.branch,
        graduationYear: dto.graduationYear,
        college: dto.college,
        location: dto.location,
        bio: dto.bio,
      },
    });

    if (dto.skills) {
      await this.prisma.studentSkill.deleteMany({ where: { profileId: profile.id } });
      for (const name of dto.skills.map((skill) => skill.trim()).filter(Boolean)) {
        const skill = await this.prisma.skill.upsert({
          where: { name },
          create: { name },
          update: {},
        });
        await this.prisma.studentSkill.create({
          data: { profileId: profile.id, skillId: skill.id },
        });
      }
    }

    return this.get(userId);
  }

  private toResponse(user: any) {
    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      profile: user.profile
        ? {
            id: user.profile.id,
            degree: user.profile.degree || "",
            branch: user.profile.branch || "",
            graduationYear: user.profile.graduationYear || null,
            college: user.profile.college || "",
            location: user.profile.location || "",
            bio: user.profile.bio || "",
            skills: user.profile.skills.map((item: any) => item.skill.name),
          }
        : null,
    };
  }
}
