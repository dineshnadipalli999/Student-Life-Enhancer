import type { Career, Opportunity } from "@/types";

export function getCareerMatch(career: Career, skills: string[]) {
  const knownSkills = new Set(skills.map((skill) => skill.toLowerCase()));
  const requiredMatches = career.requiredSkills.filter((skill) => knownSkills.has(skill.toLowerCase())).length;
  const preferredMatches = career.preferredSkills.filter((skill) => knownSkills.has(skill.toLowerCase())).length;
  const requiredScore = career.requiredSkills.length ? requiredMatches / career.requiredSkills.length : 0;
  const preferredScore = career.preferredSkills.length ? preferredMatches / career.preferredSkills.length : 0;
  if (!skills.length) return 0;
  return Math.round(Math.min(100, requiredScore * 80 + preferredScore * 20));
}

export function personalizeCareer(career: Career, skills: string[]): Career {
  return { ...career, matchScore: getCareerMatch(career, skills) };
}

export function getOpportunityMatch(opportunity: Opportunity, skills: string[]) {
  const knownSkills = new Set(skills.map((skill) => skill.toLowerCase()));
  const matches = opportunity.skills.filter((skill) => knownSkills.has(skill.toLowerCase())).length;
  return opportunity.skills.length ? Math.round((matches / opportunity.skills.length) * 100) : 0;
}

export function personalizeOpportunity(opportunity: Opportunity, skills: string[]): Opportunity {
  return { ...opportunity, matchScore: getOpportunityMatch(opportunity, skills) };
}

export function getInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";
}
