import Link from "next/link";
import { getAtsList } from "@/lib/seo-content";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "ATS Resume Guides | WadeCV",
  description:
    "How to optimize your resume for Workday, Greenhouse, Lever, and other ATS. Parsing rules, formatting tips, and keyword matching.",
};

export default function AtsIndexPage() {
  const list = getAtsList();
  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">ATS Resume Guides</h1>
      <p className="text-muted-foreground mb-8">
        Many employers use applicant tracking systems to screen resumes. These guides explain how specific ATS platforms parse and rank applications so you can format and keyword your resume effectively—then use WadeCV to create an optimized, tailored CV.
      </p>
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
