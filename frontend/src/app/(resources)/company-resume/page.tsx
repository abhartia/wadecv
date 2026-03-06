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
      <p className="text-muted-foreground mb-8">
        Different companies look for different things. These guides cover typical hiring expectations, keywords, and resume strategies so you can tailor your application to each employer.
      </p>
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
