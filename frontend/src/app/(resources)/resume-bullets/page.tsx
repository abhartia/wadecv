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
      <div className="text-muted-foreground mb-8 space-y-4">
        <p>
          Strong resume bullets show impact: what you did, for whom, and what improved. Vague task
          lists get skipped; concrete outcomes with numbers and scope get noticed. The right
          structure and action verbs also help your resume pass ATS and stick in a recruiter’s mind.
        </p>
        <p>
          These guides give you bullet examples and impact formulas by role—software engineering,
          sales, project management, customer service, and more. Use them to rewrite your experience
          bullets, then let WadeCV generate tailored bullets for your target job and company.
        </p>
        <p>
          Whether you’re early in your career or senior, you’ll find patterns you can adapt so every
          bullet works harder for you.
        </p>
      </div>
      <ul className="space-y-3">
        {bullets.map((b) => (
          <li key={b.slug}>
            <Link href={`/resume-bullets/${b.slug}`} className="block group">
              <Card className="transition-colors group-hover:bg-muted/50">
                <CardContent className="py-4">
                  <h2 className="font-semibold text-lg group-hover:text-primary">{b.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {b.metaDescription}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
