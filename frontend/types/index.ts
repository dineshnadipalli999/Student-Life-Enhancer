export interface Student {
  id: string;
  name: string;
  email: string;
  education: string;
  branch: string;
  year: number;
  skills: string[];
  interests: string[];
  targetCareer: string;
  readinessScore: number;
  profileCompletion: number;
}

export interface Career {
  id: string;
  name: string;
  description: string;
  matchScore: number;
  demandScore: number;
  salaryMin: number;
  salaryMax: number;
  requiredSkills: string[];
  preferredSkills: string[];
  growth: string;
  url?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  stipend?: string;
  skills: string[];
  matchScore: number;
  deadline?: string;
  remote?: boolean;
  posted?: string;
  url?: string;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  rating: number;
  duration: string;
  skills: string[];
  matchScore: number;
  level: string;
  free: boolean;
  url?: string;
}

export interface Project {
  id: string;
  title: string;
  difficulty: string;
  duration: string;
  skills: string[];
  matchScore: number;
  description: string;
  url?: string;
}

export interface Application {
  id: string;
  company: string;
  role: string;
  date: string;
  status: "Saved" | "Applied" | "Interview" | "Offer" | "Rejected";
}
