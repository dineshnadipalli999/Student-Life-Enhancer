import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async overview() {
    const [students, applications, opportunities, jobs, internships, partTime, recentOpportunities] = await Promise.all([
      this.prisma.user.count({ where: { role: "STUDENT" } }),
      this.prisma.application.count(),
      this.prisma.opportunity.count(),
      this.prisma.opportunity.count({ where: { type: "JOB" } }),
      this.prisma.opportunity.count({ where: { type: "INTERNSHIP" } }),
      this.prisma.opportunity.count({ where: { type: "PART_TIME" } }),
      this.prisma.opportunity.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { _count: { select: { applications: true } } },
      }),
    ]);
    return {
      students,
      applications,
      opportunities,
      opportunityBreakdown: { jobs, internships, partTime },
      recentOpportunities,
    };
  }

  students() {
    return this.prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true, name: true, email: true, role: true, createdAt: true, profile: { select: { degree: true, branch: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  opportunities() {
    return this.prisma.opportunity.findMany({ orderBy: { createdAt: "desc" } });
  }

  async deleteStudent(id: string, requesterId?: string) {
    if (!requesterId) throw new ForbiddenException("Administrator identity is required");
    const requester = await this.prisma.user.findUnique({ where: { id: requesterId }, select: { role: true } });
    if (!requester || !["ADMIN", "SUPER_ADMIN"].includes(requester.role)) throw new ForbiddenException("Only administrators can delete students");
    const student = await this.prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!student) throw new NotFoundException("Student not found");
    if (student.role !== "STUDENT") throw new ForbiddenException("Only student accounts can be deleted");
    return this.prisma.user.delete({ where: { id } });
  }
}
