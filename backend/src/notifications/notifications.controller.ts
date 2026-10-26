import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get(":userId")
  list(@Param("userId") userId: string) {
    return this.notificationsService.list(userId);
  }

  @Patch(":userId/:notificationId/read")
  markRead(@Param("userId") userId: string, @Param("notificationId") notificationId: string) {
    return this.notificationsService.markRead(userId, notificationId);
  }

  @Post("admin/broadcast")
  broadcast(@Body() dto: CreateNotificationDto) { return this.notificationsService.broadcast(dto); }
  @Get("admin/updates")
  adminUpdates() { return this.notificationsService.adminUpdates(); }
  @Patch("admin/updates/:id")
  updateBroadcast(@Param("id") id: string, @Body() dto: CreateNotificationDto) { return this.notificationsService.updateBroadcast(id, dto); }
  @Delete("admin/updates/:id")
  deleteBroadcast(@Param("id") id: string) { return this.notificationsService.deleteBroadcast(id); }
}
