import Link from "next/link";
import { getSkills } from "@/lib/seo-content";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Best Skills for Your Resume by Role (2026) | WadeCV",
  description:
    "Role-specific skill lists for your resume: software engineer, product manager, data analyst, customer service, and more. Copy-paste ready.",
};

export default function SkillsIndexPage() {
  const skills = getSkills();
  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">Skills for Your Resume by Role</h1>
      <div className="text-muted-foreground mb-8 space-y-4">
        <p>
          Every role has a different mix of technical, soft, and domain skills. Listing the right
          skills—and backing them up with strong bullet points—helps ATS and recruiters see you as a
          match. Generic skill lists rarely stand out; role-specific clusters and examples do.
        </p>
        <p>
          These guides break down skills by job type: what to put on your resume, how to group them,
          and bullet examples that show impact. Use them to refine your skills section and
          experience bullets, then tailor your full CV to each role with WadeCV.
        </p>
        <p>
          Whether you’re in tech, customer-facing roles, healthcare, or creative fields, you’ll find
          actionable skill clusters and phrasing that fits your target job.
        </p>
      </div>
      <ul className="space-y-3">
        {skills.map((s) => (
          <li key={s.slug}>
            <Link href={`/skills/${s.slug}`} className="block group">
              <Card className="transition-colors group-hover:bg-muted/50">
                <CardContent className="py-4">
                  <h2 className="font-semibold text-lg group-hover:text-primary">{s.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {s.metaDescription}
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
