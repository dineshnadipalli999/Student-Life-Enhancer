import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

type ProfileContext = {
  name: string;
  skills: string[];
  degree?: string | null;
  branch?: string | null;
  bio?: string | null;
};

type CareerContext = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  demand: string | null;
  skills: { skill: { name: string } }[];
};

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);

  constructor(private readonly prisma: PrismaService) {}

  async latestConversation(userId: string) {
    const conversation = await this.prisma.aIConversation.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    return conversation ? { conversationId: conversation.id, messages: conversation.messages } : null;
  }

  async clearConversations(userId: string) {
    const result = await this.prisma.aIConversation.deleteMany({ where: { userId } });
    return { deleted: result.count };
  }

  async message(userId: string, message: string, conversationId?: string) {
    const question = message?.trim();
    if (!question) throw new BadRequestException("Message is required");

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: { include: { skills: { include: { skill: true } } } } },
    });
    if (!user) throw new NotFoundException("User not found");

    const profile: ProfileContext = {
      name: user.name,
      skills: user.profile?.skills.map(item => item.skill.name) || [],
      degree: user.profile?.degree,
      branch: user.profile?.branch,
      bio: user.profile?.bio,
    };
    const conversation = conversationId
      ? await this.prisma.aIConversation.findFirst({ where: { id: conversationId, userId }, include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } } })
      : await this.prisma.aIConversation.create({ data: { userId, title: "Career Assistant" }, include: { messages: true } });
    if (!conversation) throw new NotFoundException("Conversation not found");

    await this.prisma.aIMessage.create({ data: { conversationId: conversation.id, role: "user", content: question } });
    const history = [...conversation.messages, { role: "user", content: question }].slice(-20).map(item => ({ role: item.role, content: item.content }));
    const knowledge = await this.loadKnowledge();

    let reply = "";
    let source = "local-grounded-agent";
    const agentUrl = process.env.AGENT_API_URL;
    if (agentUrl) {
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (process.env.AGENT_API_KEY) headers.Authorization = `Bearer ${process.env.AGENT_API_KEY}`;
        const response = await fetch(agentUrl, {
          method: "POST",
          headers,
          signal: AbortSignal.timeout(30_000),
          body: JSON.stringify({
            message: question,
            messages: history,
            system: "Answer only from the supplied student profile and database context. Never invent careers, skills, courses, or profile facts. If data is missing, say so and suggest the relevant page.",
            profile,
            context: knowledge,
          }),
        });
        if (response.ok) {
          const data = await response.json() as { reply?: string; response?: string; content?: string; message?: { content?: string }; choices?: { message?: { content?: string }; text?: string }[] };
          reply = data.reply || data.response || data.content || data.message?.content || data.choices?.[0]?.message?.content || data.choices?.[0]?.text || "";
          if (reply.trim()) source = "agent-api";
        } else {
          this.logger.warn(`Agent API returned ${response.status}; using local grounded agent`);
        }
      } catch (error) {
        this.logger.warn(`Agent API unavailable; using local grounded agent: ${error instanceof Error ? error.message : "unknown error"}`);
      }
    }
    if (!reply) reply = this.localReply(question, profile, knowledge);

    await this.prisma.aIMessage.create({ data: { conversationId: conversation.id, role: "assistant", content: reply } });
    return { reply, source, conversationId: conversation.id, suggestions: this.suggestions(question, profile.skills) };
  }

  private async loadKnowledge() {
    const [careers, courses, projects, opportunities] = await Promise.all([
      this.prisma.career.findMany({ include: { skills: { include: { skill: true } } } }),
      this.prisma.course.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
      this.prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
      this.prisma.opportunity.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    ]);
    return { careers, courses, projects, opportunities };
  }

  private localReply(question: string, profile: ProfileContext, knowledge: Awaited<ReturnType<AssistantService["loadKnowledge"]>>) {
    const normalized = question.toLowerCase();
    const known = new Set(profile.skills.map(skill => skill.toLowerCase().trim()));
    const careerMatches = knowledge.careers.map(career => {
      const required = career.skills.map(link => link.skill.name);
      const matched = required.filter(skill => known.has(skill.toLowerCase()));
      return { career, required, matched, missing: required.filter(skill => !known.has(skill.toLowerCase())) };
    }).filter(item => item.required.length && item.matched.length).sort((a, b) => b.matched.length / b.required.length - a.matched.length / a.required.length);

    if (normalized.includes("missing") || normalized.includes("gap")) {
      if (!careerMatches.length) return profile.skills.length ? "I could not find a published career with overlapping required skills. Explore Careers to review available paths, then add a target career's skills to your profile." : "Your profile has no saved skills yet. Add your skills on My Profile so I can calculate specific gaps.";
      const best = careerMatches[0];
      return `For ${best.career.title}, you match ${best.matched.length} of ${best.required.length} required skills (${Math.round(best.matched.length / best.required.length * 100)}%). Missing skills: ${best.missing.length ? best.missing.join(", ") : "none"}. View the Skill Gap page for the full breakdown.`;
    }

    if (normalized.includes("career") || normalized.includes("role") || normalized.includes("job") || normalized.includes("best for")) {
      if (!careerMatches.length) return profile.skills.length ? "I could not find a strong match among the published careers. Add more skills to your profile or browse Career Explorer for available paths." : "Your profile has no saved skills yet. Add them on My Profile before asking for a career match.";
      const top = careerMatches.slice(0, 3);
      return `Based on your saved skills (${profile.skills.join(", ")}), your strongest published matches are:\n${top.map((item, index) => `${index + 1}. ${item.career.title} — ${Math.round(item.matched.length / item.required.length * 100)}% match (${item.matched.length}/${item.required.length} skills)`).join("\n")}\n\nOpen Career Recommendations for matched and missing skill details.`;
    }

    if (normalized.includes("course") || normalized.includes("learn") || normalized.includes("next")) {
      const missing = careerMatches[0]?.missing || [];
      const courses = knowledge.courses.filter(course => {
        const courseSkills = (course.skills || "").split(",").map(skill => skill.trim().toLowerCase());
        return missing.some(skill => courseSkills.includes(skill.toLowerCase()));
      }).slice(0, 3);
      if (courses.length) return `To close your ${careerMatches[0].career.title} gap, prioritize ${missing.join(", ")}. Published courses that cover those skills:\n${courses.map(course => `• ${course.title}${course.provider ? ` (${course.provider})` : ""}`).join("\n")}`;
      return knowledge.courses.length ? `I could not find a published course explicitly tagged for your current gaps. Browse the ${Math.min(knowledge.courses.length, 30)} available course(s) and choose one related to ${missing.length ? missing.join(", ") : "your target career"}.` : "No courses are currently published by an administrator.";
    }

    if (normalized.includes("project") || normalized.includes("prove") || normalized.includes("evidence")) {
      const project = knowledge.projects.find(item => item.skills && profile.skills.some(skill => item.skills?.toLowerCase().includes(skill.toLowerCase())));
      return project ? `Use "${project.title}" as evidence: explain the problem, your contribution, technologies used, and measurable result. Its listed skills are ${project.skills || "not specified"}.` : "No published project matches your saved skills yet. Build a small project using one target skill, document the result, and add it to your profile.";
    }

    if (normalized.includes("profile") || normalized.includes("resume")) {
      return `Your profile currently contains ${profile.skills.length} saved skill(s)${profile.branch ? ` and your branch is ${profile.branch}` : ""}. Keep skills, education, summary, and resume evidence aligned with the career you want. Open My Profile to update missing information.`;
    }

    return `I can give grounded advice about your ${knowledge.careers.length} published career(s), ${knowledge.courses.length} course(s), skill gaps, projects, and opportunities. Try asking “Which careers match my skills?”, “What skills am I missing?”, or “What course should I take next?”`;
  }

  private suggestions(message: string, skills: string[]) {
    const normalized = message.toLowerCase();
    if (normalized.includes("skill") || normalized.includes("learn")) return ["Which careers match my skills?", "What course should I take next?", "How can I prove this skill in a project?"];
    if (normalized.includes("career") || normalized.includes("role")) return ["What skills am I missing?", "What course should I take next?", "How can I improve my resume?"];
    return skills.length ? ["Which careers match my skills?", "What skills am I missing?", "What course should I take next?"] : ["How do I complete my profile?", "What skills should I learn first?", "How can I upload my resume?"];
  }
}
