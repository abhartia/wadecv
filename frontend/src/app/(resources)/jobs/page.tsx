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
      <div className="text-muted-foreground mb-8 space-y-4">
        <p>
          Understanding a role’s responsibilities, required skills, and the exact keywords hiring managers and ATS look for can make the difference between landing an interview and being filtered out. Job descriptions vary by company, level, and industry—so tailoring your resume to each opportunity is essential.
        </p>
        <p>
          These guides break down real job descriptions by role: what you’ll typically be expected to do, which skills to highlight, salary ranges, career paths, and the resume keywords that get past screening. Use them to align your experience with what employers want, then create a tailored CV with WadeCV so every application speaks directly to the job.
        </p>
        <p>
          Whether you’re targeting a type of role (e.g. product manager, data analyst, customer success, software engineer), you’ll find actionable breakdowns and keyword lists to strengthen your next application.
        </p>
      </div>
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
