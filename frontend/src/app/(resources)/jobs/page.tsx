import Link from "next/link";
import { getJobs } from "@/lib/seo-content";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Job Description Guides | WadeCV",
  description:
    "Browse job description breakdowns by role: responsibilities, required skills, salary ranges, and resume keywords to tailor your CV.",
};

export default function JobsIndexPage() {
  const jobs = getJobs();
  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">Job Description Guides</h1>
      <p className="text-muted-foreground mb-8">
        Understanding a role’s responsibilities, skills, and keywords helps you tailor your resume and cover letter.
        Use these guides to see what employers look for and how to align your experience—then create a tailored CV with WadeCV.
      </p>
      <ul className="space-y-3">
        {jobs.map((job) => (
          <li key={job.slug}>
            <Link href={`/jobs/${job.slug}`} className="block group">
              <Card className="transition-colors group-hover:bg-muted/50">
                <CardContent className="py-4">
                  <h2 className="font-semibold text-lg group-hover:text-primary">{job.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{job.metaDescription}</p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
