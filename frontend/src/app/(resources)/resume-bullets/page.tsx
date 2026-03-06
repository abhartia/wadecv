import Link from "next/link";
import { getResumeBullets } from "@/lib/seo-content";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Resume Bullet Examples by Role | WadeCV",
  description:
    "Resume bullet point examples and impact formulas for software engineers, sales, project managers, customer service, and more.",
};

export default function ResumeBulletsIndexPage() {
  const bullets = getResumeBullets();
  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">Resume Bullet Examples by Role</h1>
      <p className="text-muted-foreground mb-8">
        Strong resume bullets show impact with clear action and results. Browse examples and formulas by role, then use WadeCV to generate tailored bullets for your target job.
      </p>
      <ul className="space-y-3">
        {bullets.map((b) => (
          <li key={b.slug}>
            <Link href={`/resume-bullets/${b.slug}`} className="block group">
              <Card className="transition-colors group-hover:bg-muted/50">
                <CardContent className="py-4">
                  <h2 className="font-semibold text-lg group-hover:text-primary">{b.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{b.metaDescription}</p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
