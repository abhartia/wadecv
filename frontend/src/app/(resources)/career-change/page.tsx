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
      <p className="text-muted-foreground mb-8">
        Switching careers means reframing your experience so hiring managers see the fit. These guides cover common transitions and how to structure your resume—then use WadeCV to build a tailored CV that highlights your transferable strengths.
      </p>
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
