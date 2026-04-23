import Link from "next/link";
import { getPhysicalMailEntries } from "@/lib/seo-content";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Mail Your CV: Physical Resume Mailing Guides | WadeCV",
  description:
    "Learn how to mail a physical copy of your resume and cover letter directly to companies. Guides on formatting, addressing, timing, and standing out.",
};

export default function PhysicalMailIndexPage() {
  const entries = getPhysicalMailEntries();
  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">Mail Your CV</h1>
      <div className="text-muted-foreground mb-8 space-y-4">
        <p>
          In a job market dominated by online applications and overflowing recruiter inboxes,
          sending a physical copy of your resume can be a powerful way to stand out. A tangible,
          well-presented application signals effort, professionalism, and genuine interest in the
          role.
        </p>
        <p>
          These guides cover everything you need to know about mailing your CV and cover letter to
          companies: when it makes sense, how to format and address your materials, what to expect
          from USPS delivery, and common mistakes to avoid. Whether you&apos;re supplementing an
          online application or making a direct approach, physical mail can give you an edge that
          digital submissions alone cannot.
        </p>
        <p>
          WadeCV is the only platform that lets you generate a tailored CV and mail a printed copy
          directly to any US company — all from one workflow.
        </p>
      </div>
      <ul className="space-y-3">
        {entries.map((entry) => (
          <li key={entry.slug}>
            <Link href={`/physical-mail/${entry.slug}`} className="block group">
              <Card className="transition-colors group-hover:bg-muted/50">
                <CardContent className="py-4">
                  <h2 className="font-semibold text-lg group-hover:text-primary">{entry.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {entry.metaDescription}
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
