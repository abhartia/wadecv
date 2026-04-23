import Link from "next/link";
import {
  type SeoCategory,
  getTitleByCategoryAndSlug,
  getJobs,
  getCompanies,
  getSkills,
  getResumeBullets,
  getAtsList,
  getCareerChanges,
} from "@/lib/seo-content";
import { Card, CardContent } from "@/components/ui/card";

const CATEGORY_BASE_PATH: Record<SeoCategory, string> = {
  jobs: "/jobs",
  "company-resume": "/company-resume",
  skills: "/skills",
  "resume-bullets": "/resume-bullets",
  ats: "/ats",
  "career-change": "/career-change",
  "physical-mail": "/physical-mail",
};

type RelatedGuidesProps = {
  relatedSlugs?: string[];
  category: SeoCategory;
  currentSlug?: string;
};

function getFallbackSlugs(
  category: SeoCategory,
  currentSlug: string | undefined,
  max: number,
): string[] {
  let slugs: string[] = [];
  switch (category) {
    case "jobs":
      slugs = getJobs().map((j) => j.slug);
      break;
    case "company-resume":
      slugs = getCompanies().map((c) => c.slug);
      break;
    case "skills":
      slugs = getSkills().map((s) => s.slug);
      break;
    case "resume-bullets":
      slugs = getResumeBullets().map((r) => r.slug);
      break;
    case "ats":
      slugs = getAtsList().map((a) => a.slug);
      break;
    case "career-change":
      slugs = getCareerChanges().map((c) => c.slug);
      break;
    default:
      return [];
  }
  const filtered = currentSlug ? slugs.filter((s) => s !== currentSlug) : slugs;
  return filtered.slice(0, max);
}

export function RelatedGuides({ relatedSlugs, category, currentSlug }: RelatedGuidesProps) {
  const slugsToShow = relatedSlugs?.length
    ? relatedSlugs
    : getFallbackSlugs(category, currentSlug, 4);
  if (!slugsToShow.length) return null;

  const base = CATEGORY_BASE_PATH[category];
  const links = slugsToShow
    .map((slug) => {
      const title = getTitleByCategoryAndSlug(category, slug);
      if (!title) return null;
      return { slug, title, href: `${base}/${slug}` };
    })
    .filter(Boolean) as { slug: string; title: string; href: string }[];

  if (!links.length) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Related guides</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {links.map(({ slug, title, href }) => (
          <li key={slug}>
            <Link href={href} className="block group">
              <Card className="transition-colors group-hover:bg-muted/50 h-full">
                <CardContent className="py-3">
                  <span className="font-medium text-sm group-hover:text-primary">{title}</span>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
