


export interface ProjectItem {
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string; // Vercel live link
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  achievements: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

export interface CVData {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  github: string;
  portfolio: string;
  location: string;
  summary: string;
  skills: SkillGroup[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
}