import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CareersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.career.findMany({
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.career.findUnique({
      where: { id },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }

  async createForAdmin(userId: string | undefined, input: { title: string; description?: string; category?: string; demand?: string; url: string; skills: string[] }) {
    await this.assertAdmin(userId);
    this.validateInput(input);
    return this.prisma.career.create({
      data: {
        title: input.title.trim(),
        description: input.description?.trim(),
        category: input.category?.trim(),
        demand: input.demand?.trim(),
        url: input.url.trim(),
        skills: { create: await this.skillLinks(input.skills) },
      },
      include: { skills: { include: { skill: true } } },
    });
  }

  async updateForAdmin(userId: string | undefined, id: string, input: { title?: string; description?: string; category?: string; demand?: string; url?: string; skills?: string[] }) {
    await this.assertAdmin(userId);
    const existing = await this.prisma.career.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Career not found");
    this.validateInput({ ...existing, ...input });
    if (input.skills) await this.prisma.careerSkill.deleteMany({ where: { careerId: id } });
    return this.prisma.career.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title.trim() } : {}),
        ...(input.description !== undefined ? { description: input.description.trim() } : {}),
        ...(input.category !== undefined ? { category: input.category.trim() } : {}),
        ...(input.demand !== undefined ? { demand: input.demand.trim() } : {}),
        ...(input.url !== undefined ? { url: input.url.trim() } : {}),
        ...(input.skills ? { skills: { create: await this.skillLinks(input.skills) } } : {}),
      },
      include: { skills: { include: { skill: true } } },
    });
  }

  async removeForAdmin(userId: string | undefined, id: string) {
    await this.assertAdmin(userId);
    const existing = await this.prisma.career.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Career not found");
    return this.prisma.career.delete({ where: { id } });
  }

  private async skillLinks(names: string[]) {
    const links: { skill: { connect: { id: string } }; importance: number }[] = [];
    const uniqueNames = [...new Map(names.map(item => item.trim()).filter(Boolean).map(name => [name.toLowerCase(), name])).values()];
    for (const name of uniqueNames) {
      const skill = await this.prisma.skill.upsert({ where: { name }, update: {}, create: { name } });
      links.push({ skill: { connect: { id: skill.id } }, importance: 1 });
    }
    return links;
  }

  private validateInput(input: { title?: string; description?: string | null; url?: string | null; skills?: string[] }) {
    if (!input.title?.trim()) throw new BadRequestException("Career title is required");
    if (!input.description?.trim()) throw new BadRequestException("Career description is required");
    if (!input.url?.trim()) throw new BadRequestException("Career information URL is required");
    try {
      const url = new URL(input.url.trim());
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      throw new BadRequestException("Career information URL must be a valid HTTP or HTTPS URL");
    }
    if (!input.skills?.length || !input.skills.some(skill => skill.trim())) {
      throw new BadRequestException("At least one required skill is required");
    }
  }

  private async assertAdmin(userId: string | undefined) {
    if (!userId) throw new UnauthorizedException("Authentication is required");
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!user) throw new UnauthorizedException("User not found");
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") throw new ForbiddenException("Only administrators can manage careers");
  }
}