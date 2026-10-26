import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ApplicationStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateApplicationDto } from "./dto/create-application.dto";

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  listForStudent(userId: string) {
    return this.prisma.application.findMany({ where: { userId }, include: { opportunity: true }, orderBy: { id: "desc" } });
  }

  async create(userId: string, dto: CreateApplicationDto) {
    const opportunity = await this.prisma.opportunity.findUnique({ where: { id: dto.opportunityId } });
    if (!opportunity) throw new NotFoundException("Opportunity not found");
    const existing = await this.prisma.application.findFirst({ where: { userId, opportunityId: dto.opportunityId } });
    if (existing) throw new ConflictException("You already applied to this opportunity");
    return this.prisma.application.create({ data: { userId, opportunityId: dto.opportunityId, status: ApplicationStatus.APPLIED, appliedAt: new Date() }, include: { opportunity: true } });
  }

  listForAdmin() {
    return this.prisma.application.findMany({ include: { user: { select: { id: true, name: true, email: true } }, opportunity: true }, orderBy: { id: "desc" } });
  }

  async updateStatus(id: string, status: ApplicationStatus) {
    const application = await this.prisma.application.findUnique({ where: { id } });
    if (!application) throw new NotFoundException("Application not found");
    const updated = await this.prisma.application.update({ where: { id }, data: { status }, include: { user: { select: { id: true, name: true, email: true } }, opportunity: true } });
    await this.prisma.notification.create({
      data: {
        userId: updated.user.id,
        title: status === ApplicationStatus.SELECTED ? "Application approved" : "Application denied",
        message: `${updated.opportunity.title} was ${status === ApplicationStatus.SELECTED ? "approved" : "denied"} by an administrator.`,
      },
    });
    return updated;
  }
}
