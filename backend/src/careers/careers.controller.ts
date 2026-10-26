import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from "@nestjs/common";
import { CareersService } from "./careers.service";
import { CareerMatchingService } from "./career-matching.service";
@Controller("careers")
export class CareersController {
  constructor(private readonly service: CareersService, private readonly matchingService: CareerMatchingService){}
  @Get() findAll(){return this.service.findAll();}
  @Get("recommendations/:userId") recommendations(@Param("userId") userId:string){return this.matchingService.recommendations(userId);}
  @Get(":id") findOne(@Param("id") id:string){return this.service.findOne(id);}
  @Post() create(@Headers("x-user-id") userId: string | undefined, @Body() body: { title: string; description?: string; category?: string; demand?: string; url: string; skills: string[] }) { return this.service.createForAdmin(userId, body); }
  @Patch(":id") update(@Headers("x-user-id") userId: string | undefined, @Param("id") id: string, @Body() body: { title?: string; description?: string; category?: string; demand?: string; url?: string; skills?: string[] }) { return this.service.updateForAdmin(userId, id, body); }
  @Delete(":id") remove(@Headers("x-user-id") userId: string | undefined, @Param("id") id: string) { return this.service.removeForAdmin(userId, id); }
}