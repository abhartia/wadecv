/**
 * Types and loaders for SEO content (jobs, companies, skills, resume-bullets, ATS, career-change).
 * Content is read from frontend/content/seo/*.json at build/request time.
 */

export interface JobEntry {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  responsibilities: string[];
  requiredSkills: string[];
  salaryRange?: string;
  careerPath?: string[];
  resumeKeywords: string[];
  body: string;
}

export interface CompanyEntry {
  slug: string;
  name: string;
  metaDescription: string;
  intro: string;
  hiringRequirements: string[];
  keywords: string[];
  sampleSnippet?: string;
  body: string;
}

export interface SkillEntry {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  skillClusters: { name: string; items: string[] }[];
  bulletExamples: string[];
  body: string;
}

export interface ResumeBulletEntry {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  bulletExamples: string[];
  impactFormulas: string[];
  body: string;
}

export interface AtsEntry {
  slug: string;
  name: string;
  metaDescription: string;
  intro: string;
  parsingRules: string[];
  formattingNotes: string[];
  body: string;
}

export interface CareerChangeEntry {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  fromRole: string;
  toRole: string;
  tips: string[];
  body: string;
}

// In Next.js, process.cwd() is the frontend directory when running next build/dev
const getContentDir = () => {
  const path = require("path");
  return path.join(process.cwd(), "content", "seo");
};

function loadJsonFile<T>(filename: string): T {
  const path = require("path");
  const fs = require("fs");
  const dir = getContentDir();
  const fullPath = path.join(dir, filename);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}

let jobsCache: JobEntry[] | null = null;
let companiesCache: CompanyEntry[] | null = null;
let skillsCache: SkillEntry[] | null = null;
let resumeBulletsCache: ResumeBulletEntry[] | null = null;
let atsCache: AtsEntry[] | null = null;
let careerChangeCache: CareerChangeEntry[] | null = null;

export function getJobs(): JobEntry[] {
  if (!jobsCache) jobsCache = loadJsonFile<JobEntry[]>("jobs.json");
  return jobsCache;
}

export function getJobBySlug(slug: string): JobEntry | null {
  return getJobs().find((j) => j.slug === slug) ?? null;
}

export function getCompanies(): CompanyEntry[] {
  if (!companiesCache) companiesCache = loadJsonFile<CompanyEntry[]>("companies.json");
  return companiesCache;
}

export function getCompanyBySlug(slug: string): CompanyEntry | null {
  return getCompanies().find((c) => c.slug === slug) ?? null;
}

export function getSkills(): SkillEntry[] {
  if (!skillsCache) skillsCache = loadJsonFile<SkillEntry[]>("skills.json");
  return skillsCache;
}

export function getSkillBySlug(slug: string): SkillEntry | null {
  return getSkills().find((s) => s.slug === slug) ?? null;
}

export function getResumeBullets(): ResumeBulletEntry[] {
  if (!resumeBulletsCache) resumeBulletsCache = loadJsonFile<ResumeBulletEntry[]>("resume-bullets.json");
  return resumeBulletsCache;
}

export function getResumeBulletBySlug(slug: string): ResumeBulletEntry | null {
  return getResumeBullets().find((r) => r.slug === slug) ?? null;
}

export function getAtsList(): AtsEntry[] {
  if (!atsCache) atsCache = loadJsonFile<AtsEntry[]>("ats.json");
  return atsCache;
}

export function getAtsBySlug(slug: string): AtsEntry | null {
  return getAtsList().find((a) => a.slug === slug) ?? null;
}

export function getCareerChanges(): CareerChangeEntry[] {
  if (!careerChangeCache) careerChangeCache = loadJsonFile<CareerChangeEntry[]>("career-change.json");
  return careerChangeCache;
}

export function getCareerChangeBySlug(slug: string): CareerChangeEntry | null {
  return getCareerChanges().find((c) => c.slug === slug) ?? null;
}
