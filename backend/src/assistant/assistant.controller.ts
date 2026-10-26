import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AssistantService } from "./assistant.service";

@Controller("assistant")
export class AssistantController {
  constructor(private readonly service: AssistantService) {}
  @Post(":userId/message")
  message(@Param("userId") userId: string, @Body() body: { message?: string; conversationId?: string }) {
    return this.service.message(userId, body.message || "", body.conversationId);
  }

  @Get(":userId/conversation")
  latestConversation(@Param("userId") userId: string) {
    return this.service.latestConversation(userId);
  }

  @Delete(":userId/conversation")
  clearConversations(@Param("userId") userId: string) {
    return this.service.clearConversations(userId);
  }
}
