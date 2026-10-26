import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

type ScholarshipInput = {
  title: string;
  provider?: string;
  description?: string;
  amount?: string;
  eligibility?: string;
  url?: string;
  deadline?: string;
};

@Injectable()
export class ScholarshipsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.scholarship.findMany({ orderBy: { createdAt: "desc" } });
  }

  create(input: ScholarshipInput) {
    return this.prisma.scholarship.create({ data: { title: input.title.trim(), ...this.toData(input) } });
  }

  async update(id: string, input: Partial<ScholarshipInput>) {
    const existing = await this.prisma.scholarship.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Scholarship not found");
    return this.prisma.scholarship.update({ where: { id }, data: this.toData(input) });
  }

  async remove(id: string) {
    const existing = await this.prisma.scholarship.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Scholarship not found");
    return this.prisma.scholarship.delete({ where: { id } });
  }

  private toData(input: Partial<ScholarshipInput>) {
    return {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.provider !== undefined ? { provider: input.provider.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description.trim() } : {}),
      ...(input.amount !== undefined ? { amount: input.amount.trim() } : {}),
      ...(input.eligibility !== undefined ? { eligibility: input.eligibility.trim() } : {}),
      ...(input.url !== undefined ? { url: input.url.trim() } : {}),
      ...(input.deadline !== undefined ? { deadline: input.deadline ? new Date(input.deadline) : null } : {}),
    };
  }
}
