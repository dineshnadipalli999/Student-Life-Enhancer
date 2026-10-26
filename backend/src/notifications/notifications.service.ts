import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async markRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({ where: { id: notificationId, userId } });
    if (!notification) throw new NotFoundException("Notification not found");
    return this.prisma.notification.update({ where: { id: notificationId }, data: { read: true } });
  }

  async broadcast(dto: CreateNotificationDto) {
    const students = await this.prisma.user.findMany({ where: { role: "STUDENT" }, select: { id: true } });
    if (students.length) {
      await this.prisma.notification.createMany({ data: students.map((student) => ({ userId: student.id, title: dto.title, message: dto.message })) });
    }
    return { recipients: students.length };
  }

  async adminUpdates() {
    const notifications = await this.prisma.notification.findMany({ orderBy: { createdAt: "desc" } });
    const seen = new Set<string>();
    return notifications.filter((notification) => {
      const key = `${notification.title}\u0000${notification.message}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async updateBroadcast(id: string, dto: CreateNotificationDto) {
    const source = await this.prisma.notification.findUnique({ where: { id } });
    if (!source) throw new NotFoundException("Update not found");
    return this.prisma.notification.updateMany({
      where: { title: source.title, message: source.message },
      data: { title: dto.title, message: dto.message },
    });
  }

  async deleteBroadcast(id: string) {
    const source = await this.prisma.notification.findUnique({ where: { id } });
    if (!source) throw new NotFoundException("Update not found");
    return this.prisma.notification.deleteMany({ where: { title: source.title, message: source.message } });
  }
}
