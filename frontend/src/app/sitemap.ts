import type { MetadataRoute } from "next";
import {
  getJobs,
  getCompanies,
  getSkills,
  getResumeBullets,
  getAtsList,
  getCareerChanges,
  getPhysicalMailEntries,
} from "@/lib/seo-content";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://wadecv.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastmod = new Date().toISOString().split("T")[0];

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: lastmod, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/auth/login`, lastModified: lastmod, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/auth/register`, lastModified: lastmod, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/legal/terms`, lastModified: lastmod, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/legal/privacy`, lastModified: lastmod, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/legal/refund`, lastModified: lastmod, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/legal/ai-disclosure`, lastModified: lastmod, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/jobs`, lastModified: lastmod, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/company-resume`, lastModified: lastmod, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/skills`, lastModified: lastmod, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/resume-bullets`, lastModified: lastmod, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/ats`, lastModified: lastmod, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/career-change`, lastModified: lastmod, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/physical-mail`, lastModified: lastmod, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/ai-resume-builder-comparison`, lastModified: lastmod, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/best-ai-resume-builder-2026`, lastModified: lastmod, changeFrequency: "monthly", priority: 0.9 },
  ];

  const jobUrls = getJobs().map((j) => ({
    url: `${BASE_URL}/jobs/${j.slug}`,
    lastModified: lastmod,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const companyUrls = getCompanies().map((c) => ({
    url: `${BASE_URL}/company-resume/${c.slug}`,
    lastModified: lastmod,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const skillUrls = getSkills().map((s) => ({
    url: `${BASE_URL}/skills/${s.slug}`,
    lastModified: lastmod,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const bulletUrls = getResumeBullets().map((b) => ({
    url: `${BASE_URL}/resume-bullets/${b.slug}`,
    lastModified: lastmod,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const atsUrls = getAtsList().map((a) => ({
    url: `${BASE_URL}/ats/${a.slug}`,
    lastModified: lastmod,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const careerChangeUrls = getCareerChanges().map((c) => ({
    url: `${BASE_URL}/career-change/${c.slug}`,
    lastModified: lastmod,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const physicalMailUrls = getPhysicalMailEntries().map((e) => ({
    url: `${BASE_URL}/physical-mail/${e.slug}`,
    lastModified: lastmod,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...jobUrls,
    ...companyUrls,
    ...skillUrls,
    ...bulletUrls,
    ...atsUrls,
    ...careerChangeUrls,
    ...physicalMailUrls,
  ];
}
