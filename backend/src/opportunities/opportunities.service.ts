import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOpportunityDto } from "./dto/create-opportunity.dto";
@Injectable()
export class OpportunitiesService {
  constructor(private readonly prisma:PrismaService){}
  findAll(type?:string){return this.prisma.opportunity.findMany({where:type?{type:type as any}:undefined,orderBy:{createdAt:"desc"}});}
  create(dto: CreateOpportunityDto){return this.prisma.opportunity.create({data:{...dto,skills:dto.skills?.join(",")}});}
  async update(id: string, dto: Partial<CreateOpportunityDto>) {
    const opportunity = await this.prisma.opportunity.findUnique({ where: { id } });
    if (!opportunity) throw new NotFoundException("Opportunity not found");
    return this.prisma.opportunity.update({ where: { id }, data: { ...dto, skills: dto.skills ? dto.skills.join(",") : undefined } });
  }
  async remove(id: string) {
    const opportunity = await this.prisma.opportunity.findUnique({ where: { id } });
    if (!opportunity) throw new NotFoundException("Opportunity not found");
    return this.prisma.opportunity.delete({ where: { id } });
  }
}