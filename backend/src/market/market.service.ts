import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMarketTrendDto } from "./dto/create-market-trend.dto";

@Injectable()
export class MarketService {
  constructor(private readonly prisma: PrismaService) {}
  list() { return this.prisma.marketTrend.findMany({ orderBy: { createdAt: "desc" } }); }
  create(dto: CreateMarketTrendDto) { return this.prisma.marketTrend.create({ data: dto }); }
}
