import { Module } from "@nestjs/common";
import { CareersController } from "./careers.controller";
import { CareersService } from "./careers.service";
import { CareerMatchingService } from "./career-matching.service";
@Module({controllers:[CareersController],providers:[CareersService, CareerMatchingService]})
export class CareersModule {}