import { Body, Controller, Get, Post } from "@nestjs/common";
import { MarketService } from "./market.service";
import { CreateMarketTrendDto } from "./dto/create-market-trend.dto";

@Controller("market")
export class MarketController {
  constructor(private readonly marketService: MarketService) {}
  @Get() list() { return this.marketService.list(); }
  @Post("admin") create(@Body() dto: CreateMarketTrendDto) { return this.marketService.create(dto); }
}
