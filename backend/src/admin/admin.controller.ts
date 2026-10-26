import { Body, Controller, Delete, Get, Headers, Param, Patch } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { ResetPasswordDto } from "../auth/dto/reset-password.dto";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("overview")
  overview() { return this.adminService.overview(); }

  @Get("students")
  students(@Headers("x-user-id") requesterId?: string) { return this.adminService.students(requesterId); }

  @Get("admins")
  admins(@Headers("x-user-id") requesterId?: string) { return this.adminService.admins(requesterId); }

  @Get("opportunities")
  opportunities() { return this.adminService.opportunities(); }
  @Delete("students/:id")
  deleteStudent(@Param("id") id: string, @Headers("x-user-id") requesterId?: string) {
    return this.adminService.deleteStudent(id, requesterId);
  }

  @Delete("admins/:id")
  deleteAdmin(@Param("id") id: string, @Headers("x-user-id") requesterId?: string) {
    return this.adminService.deleteAdmin(id, requesterId);
  }

  @Patch("students/:id/password")
  resetStudentPassword(@Param("id") id: string, @Headers("x-user-id") requesterId: string | undefined, @Body() dto: ResetPasswordDto) {
    return this.adminService.resetStudentPassword(id, dto.newPassword, requesterId);
  }

  @Patch("admins/:id/password")
  resetAdminPassword(@Param("id") id: string, @Headers("x-user-id") requesterId: string | undefined, @Body() dto: ResetPasswordDto) {
    return this.adminService.resetAdminPassword(id, dto.newPassword, requesterId);
  }
}
