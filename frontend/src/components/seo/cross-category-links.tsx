import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

type CrossLink = { href: string; label: string };

const CATEGORY_HUBS: CrossLink[] = [
  { href: "/ats", label: "ATS Resume Guides" },
  { href: "/career-change", label: "Career Change Resumes" },
  { href: "/company-resume", label: "Company-Specific Resumes" },
  { href: "/jobs", label: "Job Description Guides" },
  { href: "/skills", label: "Skills Resume Guides" },
  { href: "/resume-bullets", label: "Resume Bullet Examples" },
  {
    href: "/best-ai-resume-builder-2026",
    label: "Best AI Resume Builders 2026",
  },
  { href: "/cv-vs-resume", label: "CV vs Resume Guide" },
  { href: "/humanize-ai-resume", label: "How to Humanize Your AI Resume" },
  { href: "/free-cv-builder-uk", label: "Free CV Builder for UK Jobs" },
  { href: "/ats-resume-checker", label: "Free ATS Resume Checker" },
  { href: "/consulting-resume", label: "Consulting Resume Guide (MBB + Big 4)" },
];

const TOOL_COMPARISONS: CrossLink[] = [
  { href: "/ai-resume-builder-comparison", label: "WadeCV vs ChatGPT" },
  { href: "/wadecv-vs-claude", label: "WadeCV vs Claude AI" },
  { href: "/wadecv-vs-teal", label: "WadeCV vs Teal" },
  { href: "/wadecv-vs-jobscan", label: "WadeCV vs Jobscan" },
  { href: "/wadecv-vs-wobo", label: "WadeCV vs Wobo AI" },
  { href: "/wadecv-vs-aiapply", label: "WadeCV vs AiApply" },
  { href: "/wadecv-vs-enhancv", label: "WadeCV vs Enhancv" },
];

type Props = {
  /** Current category path to exclude (e.g. "/ats") */
  currentCategory: string;
  /** Optional extra contextual links to show first */
  contextLinks?: CrossLink[];
};

export function CrossCategoryLinks({ currentCategory, contextLinks }: Props) {
  const hubs = CATEGORY_HUBS.filter((h) => h.href !== currentCategory);
  const seen = new Set<string>();
  const allLinks = [...(contextLinks ?? []), ...hubs]
    .filter((l) => {
      if (seen.has(l.href)) return false;
      seen.add(l.href);
      return true;
    })
    .slice(0, 6);
  const comparisons = TOOL_COMPARISONS.filter(
    (c) => c.href !== currentCategory,
  ).slice(0, 3);

  if (!allLinks.length) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Explore more guides</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {allLinks.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className="block group">
              <Card className="transition-colors group-hover:bg-muted/50 h-full">
                <CardContent className="py-3">
                  <span className="font-medium text-sm group-hover:text-primary">{label}</span>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
      {comparisons.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mt-6 mb-3">
            Compare AI resume tools
          </h3>
          <ul className="grid gap-3 sm:grid-cols-3">
            {comparisons.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="block group">
                  <Card className="transition-colors group-hover:bg-muted/50 h-full">
                    <CardContent className="py-3">
                      <span className="font-medium text-sm group-hover:text-primary">
                        {label}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
