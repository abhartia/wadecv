import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobBySlug, getJobs } from "@/lib/seo-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SeoCta } from "@/components/seo/seo-cta";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) return { title: "Job Not Found | WadeCV" };
  return {
    title: `${job.title} | WadeCV`,
    description: job.metaDescription,
    openGraph: { title: job.title, description: job.metaDescription },
    twitter: { card: "summary", title: job.title, description: job.metaDescription },
  };
}

export async function generateStaticParams() {
  return getJobs().map((j) => ({ slug: j.slug }));
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) notFound();

  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <p className="text-muted-foreground mb-6">{job.intro}</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Responsibilities</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          {job.responsibilities.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Required skills</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          {job.requiredSkills.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      {job.salaryRange && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Salary range</h2>
          <p className="text-muted-foreground">{job.salaryRange}</p>
        </section>
      )}

      {job.careerPath && job.careerPath.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Typical career path</h2>
          <p className="text-muted-foreground">{job.careerPath.join(" → ")}</p>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Top resume keywords for this job</h2>
        <div className="flex flex-wrap gap-2">
          {job.resumeKeywords.map((k) => (
            <Badge key={k} variant="secondary">{k}</Badge>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="prose dark:prose-invert max-w-none text-muted-foreground">
          <p className="whitespace-pre-wrap">{job.body}</p>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Ready to tailor your CV for this role?</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your CV and paste a job description—WadeCV will highlight your fit and generate a tailored resume.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta variant="job" label="Generate a resume optimized for this job" />
        </CardContent>
      </Card>
    </article>
  );
}
