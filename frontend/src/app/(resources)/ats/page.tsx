import Link from "next/link";
import { getAtsList } from "@/lib/seo-content";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "ATS Resume Guides: Beat Every Applicant Tracking System (2026) | WadeCV",
  description:
    "System-by-system ATS guides for Workday, Greenhouse, Lever, iCIMS, and more. Exact parsing rules, safe formatting, and keywords that get your resume past the screen.",
};

export default function AtsIndexPage() {
  const list = getAtsList();
  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">ATS Resume Guides</h1>
      <div className="text-muted-foreground mb-8 space-y-4">
        <p>
          Many employers use applicant tracking systems (ATS) to screen resumes before a human sees them. How your resume is formatted and which keywords it contains can determine whether you make it through. Each ATS parses and ranks applications slightly differently, so a one-size-fits-all resume often underperforms.
        </p>
        <p>
          These guides explain how specific platforms—Workday, Greenhouse, Lever, iCIMS, and others—handle resumes: parsing rules, formatting tips, and keyword matching. Use them to optimize your resume for the systems your target companies use, then create a clean, tailored CV with WadeCV that works across ATS and human reviewers.
        </p>
        <p>
          A small amount of format and keyword tuning can significantly improve your chances of getting in front of a recruiter.
        </p>
      </div>
      <ul className="space-y-3">
        {list.map((a) => (
          <li key={a.slug}>
            <Link href={`/ats/${a.slug}`} className="block group">
              <Card className="transition-colors group-hover:bg-muted/50">
                <CardContent className="py-4">
                  <h2 className="font-semibold text-lg group-hover:text-primary">{a.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.metaDescription}</p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
