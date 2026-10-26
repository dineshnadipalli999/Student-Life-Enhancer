import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { OpportunitiesService } from "./opportunities.service";
import { CreateOpportunityDto } from "./dto/create-opportunity.dto";
@Controller("opportunities")
export class OpportunitiesController {
  constructor(private readonly service:OpportunitiesService){}
  @Get() findAll(@Query("type") type?:string){return this.service.findAll(type);}
  @Post() create(@Body() dto: CreateOpportunityDto){return this.service.create(dto);}
  @Patch(":id") update(@Param("id") id: string, @Body() dto: Partial<CreateOpportunityDto>){return this.service.update(id, dto);}
  @Delete(":id") remove(@Param("id") id: string){return this.service.remove(id);}
}