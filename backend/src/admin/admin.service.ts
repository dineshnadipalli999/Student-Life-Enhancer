import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService, private readonly authService: AuthService) {}

  async overview() {
    const [students, admins, applications, opportunities, jobs, internships, partTime, recentOpportunities] = await Promise.all([
      this.prisma.user.count({ where: { role: "STUDENT" } }),
      this.prisma.user.count({ where: { role: "ADMIN" } }),
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
      admins,
      applications,
      opportunities,
      opportunityBreakdown: { jobs, internships, partTime },
      recentOpportunities,
    };
  }

  async students(requesterId?: string) {
    await this.requireAdministrator(requesterId);
    return this.prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true, name: true, email: true, role: true, createdAt: true, profile: { select: { degree: true, branch: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async admins(requesterId?: string) {
    await this.requireSuperAdmin(requesterId);
    return this.prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
  }

  opportunities() {
    return this.prisma.opportunity.findMany({ orderBy: { createdAt: "desc" } });
  }

  async deleteStudent(id: string, requesterId?: string) {
    await this.requireAdministrator(requesterId);
    const student = await this.prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!student) throw new NotFoundException("Student not found");
    if (student.role !== "STUDENT") throw new ForbiddenException("Only student accounts can be deleted");
    return this.prisma.user.delete({ where: { id } });
  }

  async deleteAdmin(id: string, requesterId?: string) {
    await this.requireSuperAdmin(requesterId);
    if (id === requesterId) throw new ForbiddenException("You cannot delete your own account");
    const admin = await this.prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!admin) throw new NotFoundException("Administrator not found");
    if (admin.role !== "ADMIN") throw new ForbiddenException("Only administrator accounts can be deleted");
    return this.prisma.user.delete({ where: { id } });
  }

  async resetStudentPassword(id: string, newPassword: string, requesterId?: string) {
    await this.requireAdministrator(requesterId);
    await this.requireTargetRole(id, "STUDENT");
    return this.authService.resetPassword(id, newPassword);
  }

  async resetAdminPassword(id: string, newPassword: string, requesterId?: string) {
    await this.requireSuperAdmin(requesterId);
    if (id === requesterId) throw new ForbiddenException("You cannot reset your own password here");
    await this.requireTargetRole(id, "ADMIN");
    return this.authService.resetPassword(id, newPassword);
  }

  private async requireTargetRole(id: string, role: "STUDENT" | "ADMIN") {
    const user = await this.prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!user) throw new NotFoundException("User not found");
    if (user.role !== role) {
      throw new ForbiddenException(`Only ${role === "STUDENT" ? "student" : "administrator"} accounts can be reset`);
    }
  }

  private async requireAdministrator(requesterId?: string) {
    if (!requesterId) throw new ForbiddenException("Administrator identity is required");
    const requester = await this.prisma.user.findUnique({ where: { id: requesterId }, select: { role: true } });
    if (!requester || !["ADMIN", "SUPER_ADMIN"].includes(requester.role)) {
      throw new ForbiddenException("Only administrators can access this resource");
    }
    return requester;
  }

  private async requireSuperAdmin(requesterId?: string) {
    const requester = await this.requireAdministrator(requesterId);
    if (requester.role !== "SUPER_ADMIN") throw new ForbiddenException("Only super administrators can access this resource");
    return requester;
  }
}
