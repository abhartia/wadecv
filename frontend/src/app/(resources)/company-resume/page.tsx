import Link from "next/link";
import { getCompanies } from "@/lib/seo-content";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Company Resume Guides | WadeCV",
  description:
    "Resume guides by company: hiring requirements, keywords, and tips for Google, Amazon, McKinsey, Goldman Sachs, and more.",
};

export default function CompanyResumeIndexPage() {
  const companies = getCompanies();
  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">Company Resume Guides</h1>
      <div className="text-muted-foreground mb-8 space-y-4">
        <p>
          Different companies evaluate candidates differently. Some emphasise leadership principles, others technical depth or culture fit. Knowing what a specific employer looks for—and how they describe it—helps you tailor your resume so it gets past recruiters and ATS.
        </p>
        <p>
          These guides cover hiring requirements, resume keywords, and sample snippets for top employers across tech, consulting, and finance. Use them to align your experience with each company’s language and expectations, then build a tailored CV with WadeCV for every application.
        </p>
        <p>
          From FAANG and startups to consulting and banking, you’ll find actionable advice so your resume stands out at the companies you care about most.
        </p>
      </div>
      <ul className="space-y-3">
        {companies.map((c) => (
          <li key={c.slug}>
            <Link href={`/company-resume/${c.slug}`} className="block group">
              <Card className="transition-colors group-hover:bg-muted/50">
                <CardContent className="py-4">
                  <h2 className="font-semibold text-lg group-hover:text-primary">{c.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.metaDescription}</p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
