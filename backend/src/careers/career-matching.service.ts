import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaService } from "../prisma/prisma.service";

type CareerWithSkills = Awaited<ReturnType<PrismaService["career"]["findMany"]>>[number] & {
  skills: { skill: { name: string } }[];
};

type WeightedSkills = Record<string, Record<string, number>>;

@Injectable()
export class CareerMatchingService {
  private readonly logger = new Logger(CareerMatchingService.name);
  private readonly model = this.loadModel();

  constructor(private readonly prisma: PrismaService) {}

  async recommendations(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: { include: { skills: { include: { skill: true } } } } },
    });
    if (!user) throw new NotFoundException("User not found");

    const careers = await this.prisma.career.findMany({
      include: { skills: { include: { skill: true } } },
    }) as CareerWithSkills[];
    const skills = user.profile?.skills.map(item => item.skill.name) || [];
    return careers
      .map(career => this.scoreCareer(career, skills))
      .filter(item => item.requiredSkills.length > 0)
      .sort((a, b) => b.score - a.score);
  }

  private scoreCareer(career: CareerWithSkills, skills: string[]) {
    const databaseSkills = career.skills.map(item => item.skill.name);
    const configuredWeights = this.model[career.title.toLowerCase()];
    const requirements = configuredWeights
      ? Object.fromEntries(databaseSkills.map(skill => [skill.toLowerCase(), configuredWeights[skill.toLowerCase()] ?? 1]))
      : Object.fromEntries(databaseSkills.map(skill => [skill.toLowerCase(), 1]));
    const known = new Set(skills.map(skill => skill.trim().toLowerCase()));
    const requiredSkills = databaseSkills.length ? databaseSkills : Object.keys(requirements);
    const matchedSkills = requiredSkills.filter(skill => known.has(skill.toLowerCase()));
    const missingSkills = requiredSkills.filter(skill => !known.has(skill.toLowerCase()));
    const totalWeight = Object.values(requirements).reduce((sum, weight) => sum + weight, 0);
    const matchedWeight = Object.entries(requirements)
      .filter(([skill]) => known.has(skill))
      .reduce((sum, [, weight]) => sum + weight, 0);

    return {
      career: {
        id: career.id,
        title: career.title,
        description: career.description,
        category: career.category,
        demand: career.demand,
        url: career.url,
      },
      score: totalWeight ? Math.round((matchedWeight / totalWeight) * 100) : 0,
      requiredSkills,
      matchedSkills,
      missingSkills,
      modelSource: configuredWeights ? "ml/career_skills.csv" : "career requirements",
    };
  }

  private loadModel(): WeightedSkills {
    const file = join(__dirname, "../../../ml/career_skills.csv");
    try {
      const rows = readFileSync(file, "utf-8").trim().split(/\r?\n/).slice(1);
      return rows.reduce<WeightedSkills>((model, row) => {
        const [career, skill, weight] = row.split(",");
        if (!career || !skill || !weight) return model;
        const careerKey = career.trim().toLowerCase();
        model[careerKey] ||= {};
        model[careerKey][skill.trim().toLowerCase()] = Number(weight);
        return model;
      }, {});
    } catch (error) {
      this.logger.warn(`ML career dataset unavailable; using database skill requirements: ${error instanceof Error ? error.message : "unknown error"}`);
      return {};
    }
  }
}
