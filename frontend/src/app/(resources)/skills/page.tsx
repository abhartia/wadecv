import Link from "next/link";
import { getSkills } from "@/lib/seo-content";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Skills for Resume by Role | WadeCV",
  description:
    "Skills to put on your resume by role: software engineer, product manager, customer service, data analyst, and more.",
};

export default function SkillsIndexPage() {
  const skills = getSkills();
  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">Skills for Your Resume by Role</h1>
      <p className="text-muted-foreground mb-8">
        Different roles emphasise different skill clusters. Use these guides to see which skills and bullet examples fit your target job—then tailor your CV with WadeCV.
      </p>
      <ul className="space-y-3">
        {skills.map((s) => (
          <li key={s.slug}>
            <Link href={`/skills/${s.slug}`} className="block group">
              <Card className="transition-colors group-hover:bg-muted/50">
                <CardContent className="py-4">
                  <h2 className="font-semibold text-lg group-hover:text-primary">{s.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.metaDescription}</p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
