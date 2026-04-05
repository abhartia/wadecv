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
];

type Props = {
  /** Current category path to exclude (e.g. "/ats") */
  currentCategory: string;
  /** Optional extra contextual links to show first */
  contextLinks?: CrossLink[];
};

export function CrossCategoryLinks({ currentCategory, contextLinks }: Props) {
  const hubs = CATEGORY_HUBS.filter((h) => h.href !== currentCategory);
  const allLinks = [...(contextLinks ?? []), ...hubs].slice(0, 4);

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
    </section>
  );
}
