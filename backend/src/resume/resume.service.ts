import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PDFParse } from "pdf-parse";

type UploadedResume = { originalname: string; buffer: Buffer; mimetype: string };

@Injectable()
export class ResumeService {
  constructor(private readonly prisma: PrismaService) {}
  latest(userId: string) {
    return this.prisma.resume.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
  }

  async analyze(userId: string, file: UploadedResume, targetRole: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { profile: { include: { skills: { include: { skill: true } } } } } });
    if (!user) throw new NotFoundException("User not found");
    let rawText = file.buffer.toString("utf8");
    if (file.mimetype === "application/pdf") {
      const parser = new PDFParse({ data: file.buffer });
      try {
        rawText = (await parser.getText()).text;
      } finally {
        await parser.destroy();
      }
    }
    if (!rawText.trim()) {
      throw new BadRequestException("We could not extract any text from this resume. Upload a text-based PDF or DOC file.");
    }
    const text = rawText.toLowerCase();
    const catalog = ["javascript", "typescript", "react", "html", "css", "python", "sql", "node.js", "express", "rest apis", "docker", "git", "java", "c++", "machine learning", "power bi", "statistics", "cloud", "linux"];
    const detectedSkills = catalog.filter(skill => new RegExp(`(?<!\\w)${skill.replace(/[.+]/g, "\\$&")}(?!\\w)`, "i").test(text));
    // Resume scoring must only use evidence found in the uploaded file. Profile
    // skills belong to the separate skill-gap view and must not hide resume gaps.
    const profileSkills = user.profile?.skills.map(item => item.skill.name.toLowerCase()) || [];
    const roleSkills: Record<string, Record<string, number>> = {
      "full stack developer": { javascript: 1, react: .9, "node.js": 1, sql: .8, "rest apis": .9, docker: .5 },
      "frontend developer": { javascript: 1, typescript: .9, react: 1, html: .7, css: .7, git: .5 },
      "backend developer": { "node.js": 1, express: .9, sql: .8, "rest apis": 1, docker: .6, git: .5 },
      "data analyst": { python: 1, sql: 1, statistics: .9, "power bi": .8, "machine learning": .5 },
      "ai engineer": { python: 1, "machine learning": 1, statistics: .8, sql: .5 },
      "cloud engineer": { docker: .9, cloud: 1, linux: .8, python: .6 },
    };
    const roleKey = Object.keys(roleSkills).find(role => targetRole.toLowerCase().includes(role)) || "custom";
    const requirements = roleSkills[roleKey] || Object.fromEntries(catalog.slice(0, 8).map(skill => [skill, 1]));
    const target = Object.keys(requirements);
    const normalizedTargetRole = targetRole.trim();
    const matched = target.filter(skill => detectedSkills.some(value => value === skill || (skill === "node.js" && value === "node")));
    const totalWeight = Object.values(requirements).reduce((sum, weight) => sum + weight, 0);
    const score = Math.round(matched.reduce((sum, skill) => sum + requirements[skill], 0) / totalWeight * 100);
    const missingSkills = target.filter(skill => !matched.includes(skill));
    await this.prisma.resume.create({ data: { userId, targetRole: normalizedTargetRole, fileName: file.originalname, score } });
    return {
      fileName: file.originalname,
      targetRole: normalizedTargetRole,
      score,
      detectedSkills,
      matchedSkills: matched,
      missingSkills,
      recommendations: missingSkills.map(skill => `Build ${skill} evidence with a practical ${normalizedTargetRole} project or course.`),
      profileSkills,
    };
  }
}
