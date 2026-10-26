import type { Application, Career, Course, Opportunity, Project, Student } from "@/types";

export const student: Student = {
  id: "STU-001",
  name: "Student User",
  email: "student@example.com",
  education: "B.Tech",
  branch: "Computer Science Engineering",
  year: 3,
  skills: ["JavaScript", "React", "HTML", "CSS", "Python", "SQL"],
  interests: ["Web Development", "AI", "Technology"],
  targetCareer: "Full Stack Developer",
  readinessScore: 72,
  profileCompletion: 91
};

export const careers: Career[] = [
  {
    id: "full-stack",
    name: "Full Stack Developer",
    description: "Build complete web products across frontend, backend and APIs.",
    matchScore: 87, demandScore: 91, salaryMin: 500000, salaryMax: 1400000,
    requiredSkills: ["JavaScript", "React", "Node.js", "Express", "SQL", "REST APIs"],
    preferredSkills: ["Docker", "Git", "Cloud"], growth: "Very High"
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    description: "Turn business data into useful insights and decisions.",
    matchScore: 81, demandScore: 88, salaryMin: 450000, salaryMax: 1200000,
    requiredSkills: ["Python", "SQL", "Excel", "Power BI", "Statistics"],
    preferredSkills: ["Tableau", "Machine Learning"], growth: "High"
  },
  {
    id: "backend",
    name: "Backend Developer",
    description: "Design scalable APIs, services and database-backed systems.",
    matchScore: 78, demandScore: 90, salaryMin: 550000, salaryMax: 1500000,
    requiredSkills: ["Node.js", "Express", "SQL", "REST APIs", "Git"],
    preferredSkills: ["Docker", "Cloud", "Redis"], growth: "Very High"
  },
  {
    id: "ai-engineer",
    name: "AI Engineer",
    description: "Build intelligent applications using machine learning and AI.",
    matchScore: 71, demandScore: 96, salaryMin: 700000, salaryMax: 1800000,
    requiredSkills: ["Python", "Machine Learning", "Statistics", "SQL"],
    preferredSkills: ["Deep Learning", "LLMs", "MLOps"], growth: "Exceptional"
  },
  {
    id: "cloud",
    name: "Cloud Engineer",
    description: "Deploy, automate and operate reliable cloud infrastructure.",
    matchScore: 68, demandScore: 93, salaryMin: 650000, salaryMax: 1700000,
    requiredSkills: ["Linux", "Networking", "Cloud", "Docker"],
    preferredSkills: ["Kubernetes", "Terraform", "CI/CD"], growth: "Very High"
  },
  {
    id: "cyber",
    name: "Cybersecurity Analyst",
    description: "Protect systems, applications and data from security threats.",
    matchScore: 62, demandScore: 89, salaryMin: 500000, salaryMax: 1400000,
    requiredSkills: ["Networking", "Linux", "Security Fundamentals"],
    preferredSkills: ["SIEM", "Python", "Cloud Security"], growth: "High"
  }
];

export const jobs: Opportunity[] = [
  { id:"j1", title:"Frontend Developer Intern", company:"NovaStack", location:"Hyderabad", type:"Internship", stipend:"₹25,000/month", skills:["React","JavaScript","Git"], matchScore:91, remote:false, posted:"2 days ago" },
  { id:"j2", title:"Junior React Developer", company:"BrightLabs", location:"Bengaluru", type:"Full-time", salary:"₹7–10 LPA", skills:["React","TypeScript","CSS"], matchScore:88, remote:true, posted:"1 day ago" },
  { id:"j3", title:"Backend Developer Intern", company:"CloudNest", location:"Remote", type:"Internship", stipend:"₹20,000/month", skills:["Node.js","REST APIs","SQL"], matchScore:83, remote:true, posted:"4 days ago" },
  { id:"j4", title:"Software Engineer", company:"Orbit Systems", location:"Pune", type:"Full-time", salary:"₹8–12 LPA", skills:["JavaScript","Node.js","SQL"], matchScore:81, remote:false, posted:"5 days ago" },
  { id:"j5", title:"Data Analyst Intern", company:"InsightWorks", location:"Remote", type:"Internship", stipend:"₹18,000/month", skills:["Python","SQL","Power BI"], matchScore:79, remote:true, posted:"3 days ago" },
  { id:"j6", title:"Web Developer", company:"PixelForge", location:"Visakhapatnam", type:"Part-time", salary:"₹18,000–25,000/month", skills:["React","JavaScript"], matchScore:89, remote:false, posted:"Today" }
];

export const internships: Opportunity[] = [
  { id:"i1", title:"Full Stack Engineering Intern", company:"TechBridge", location:"Hyderabad", type:"Internship", stipend:"₹30,000/month", skills:["React","Node.js","MongoDB"], matchScore:94, deadline:"Sep 22, 2026", remote:true },
  { id:"i2", title:"AI Engineering Intern", company:"NeuralWorks", location:"Bengaluru", type:"Internship", stipend:"₹35,000/month", skills:["Python","ML","SQL"], matchScore:78, deadline:"Sep 28, 2026", remote:false },
  { id:"i3", title:"Product Engineering Intern", company:"LaunchPad", location:"Pune", type:"Internship", stipend:"₹25,000/month", skills:["React","APIs","Git"], matchScore:87, deadline:"Oct 2, 2026", remote:true },
  { id:"i4", title:"Data Analytics Intern", company:"MetricLoop", location:"Remote", type:"Internship", stipend:"₹20,000/month", skills:["Python","SQL","Power BI"], matchScore:82, deadline:"Sep 18, 2026", remote:true }
];

export const partTime: Opportunity[] = [
  { id:"p1", title:"Weekend Web Development Assistant", company:"CodeCraft Academy", location:"Remote", type:"Tutoring", salary:"₹12,000–18,000/month", skills:["React","JavaScript"], matchScore:89, remote:true },
  { id:"p2", title:"Technical Content Writer", company:"DevDigest", location:"Remote", type:"Content Writing", salary:"₹10,000–20,000/month", skills:["JavaScript","Writing"], matchScore:76, remote:true },
  { id:"p3", title:"Campus Coding Mentor", company:"SkillSpring", location:"Visakhapatnam", type:"Campus Work", salary:"₹8,000–12,000/month", skills:["Python","JavaScript"], matchScore:84, remote:false },
  { id:"p4", title:"Junior Frontend Freelancer", company:"Freelance Project", location:"Remote", type:"Freelancing", salary:"₹15,000–30,000/month", skills:["React","CSS","Git"], matchScore:92, remote:true }
];

export const scholarships: Opportunity[] = [
  { id:"s1", title:"Future Technologists Scholarship", company:"Tech Foundation", location:"India", type:"Scholarship", stipend:"₹75,000 award", skills:["Technology"], matchScore:88, deadline:"Sep 30, 2026" },
  { id:"s2", title:"Women in Computing Grant", company:"Digital Futures", location:"India", type:"Scholarship", stipend:"₹50,000 award", skills:["Computer Science"], matchScore:74, deadline:"Oct 8, 2026" }
];

export const courses: Course[] = [
  { id:"c1", title:"Node.js Backend Development", provider:"Code Academy", rating:4.8, duration:"8 weeks", skills:["Node.js","Express","REST APIs"], matchScore:94, level:"Intermediate", free:true },
  { id:"c2", title:"Advanced React & TypeScript", provider:"Frontend Masters", rating:4.9, duration:"6 weeks", skills:["React","TypeScript"], matchScore:91, level:"Advanced", free:false },
  { id:"c3", title:"SQL for Data Analysis", provider:"DataCamp", rating:4.7, duration:"5 weeks", skills:["SQL","Analytics"], matchScore:82, level:"Beginner", free:true },
  { id:"c4", title:"Docker & Cloud Fundamentals", provider:"Cloud Academy", rating:4.6, duration:"4 weeks", skills:["Docker","Cloud"], matchScore:77, level:"Intermediate", free:false },
  { id:"c5", title:"REST API Design", provider:"DevPath", rating:4.8, duration:"3 weeks", skills:["REST APIs","Backend"], matchScore:96, level:"Intermediate", free:true }
];

export const projects: Project[] = [
  { id:"pr1", title:"Student Expense Tracker API", difficulty:"Intermediate", duration:"2 weeks", skills:["Node.js","Express","MongoDB","REST API"], matchScore:96, description:"Build a secure API for tracking student income and expenses." },
  { id:"pr2", title:"Career Recommendation Dashboard", difficulty:"Advanced", duration:"4 weeks", skills:["React","Charts","TypeScript"], matchScore:91, description:"Create an analytics dashboard that explains career recommendations." },
  { id:"pr3", title:"Internship Finder", difficulty:"Intermediate", duration:"3 weeks", skills:["React","APIs","Filters"], matchScore:88, description:"Build a searchable opportunity discovery application." },
  { id:"pr4", title:"AI Study Planner", difficulty:"Advanced", duration:"4 weeks", skills:["Python","AI","React"], matchScore:78, description:"Create a personalized learning planner with simulated AI insights." }
];

export const applications: Application[] = [
  { id:"a1", company:"NovaStack", role:"Frontend Developer Intern", date:"Sep 5, 2026", status:"Applied" },
  { id:"a2", company:"BrightLabs", role:"Junior React Developer", date:"Sep 3, 2026", status:"Interview" },
  { id:"a3", company:"CloudNest", role:"Backend Developer Intern", date:"Aug 29, 2026", status:"Saved" },
  { id:"a4", company:"Orbit Systems", role:"Software Engineer", date:"Aug 20, 2026", status:"Rejected" }
];

export const marketData = [
  { month:"Apr", demand:54, salary:6.2 },
  { month:"May", demand:61, salary:6.5 },
  { month:"Jun", demand:66, salary:6.8 },
  { month:"Jul", demand:72, salary:7.1 },
  { month:"Aug", demand:78, salary:7.5 },
  { month:"Sep", demand:84, salary:7.9 }
];
