import { Controller, Delete, Get, Headers, Param } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("overview")
  overview() { return this.adminService.overview(); }

  @Get("students")
  students() { return this.adminService.students(); }

  @Get("opportunities")
  opportunities() { return this.adminService.opportunities(); }
  @Delete("students/:id")
  deleteStudent(@Param("id") id: string, @Headers("x-user-id") requesterId?: string) {
    return this.adminService.deleteStudent(id, requesterId);
  }
}
