import { Body, Controller, Get, Headers, Param, Patch } from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfileService } from "./profile.service";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(":userId")
  get(@Param("userId") userId: string) {
    return this.profileService.get(userId);
  }

  @Patch(":userId")
  update(@Param("userId") userId: string, @Body() dto: UpdateProfileDto) {
    return this.profileService.update(userId, dto);
  }
}
