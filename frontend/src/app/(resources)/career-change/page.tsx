import Link from "next/link";
import { getCareerChanges } from "@/lib/seo-content";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Career Change Resume Guides | WadeCV",
  description:
    "How to write a resume when changing careers: teacher to PM, consulting to tech, finance to data science, and more.",
};

export default function CareerChangeIndexPage() {
  const list = getCareerChanges();
  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">Career Change Resume Guides</h1>
      <div className="text-muted-foreground mb-8 space-y-4">
        <p>
          Switching careers means reframing your experience so hiring managers in your new field see the relevance. Your resume shouldn’t read like a straight continuation of your old role; it should highlight transferable skills, outcomes, and motivation in language that resonates in the target industry.
        </p>
        <p>
          These guides cover common transitions—teacher to product manager, consulting to tech, finance to data science, military to civilian, and more—with concrete tips on how to structure your resume, which skills to lead with, and what to avoid. Use them to position yourself for a pivot, then build a tailored CV with WadeCV that speaks to your new direction.
        </p>
        <p>
          A well-framed career change resume turns perceived gaps into a clear story of transferable impact.
        </p>
      </div>
      <ul className="space-y-3">
        {list.map((c) => (
          <li key={c.slug}>
            <Link href={`/career-change/${c.slug}`} className="block group">
              <Card className="transition-colors group-hover:bg-muted/50">
                <CardContent className="py-4">
                  <h2 className="font-semibold text-lg group-hover:text-primary">{c.title}</h2>
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
