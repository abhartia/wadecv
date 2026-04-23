import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoCta } from "@/components/seo/seo-cta";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://wadecv.com");

export const metadata = {
  title: "WadeCV vs JobCopilot: AI Resume & Job Application Tools Compared (2026) | WadeCV",
  description:
    "WadeCV vs JobCopilot compared: AI resume tailoring, automated job applications, ATS optimization, cover letters, and pricing. Find out which AI tool fits your job search.",
  openGraph: {
    title: "WadeCV vs JobCopilot: AI Resume & Job Application Tools Compared (2026)",
    description:
      "WadeCV vs JobCopilot feature-by-feature comparison for AI resume tools, job automation, and pricing.",
  },
  twitter: {
    card: "summary" as const,
    title: "WadeCV vs JobCopilot: AI Resume & Job Application Tools Compared (2026)",
    description:
      "WadeCV vs JobCopilot: resume tailoring, job automation, pricing, and features compared.",
  },
};

const ROWS: {
  feature: string;
  jobcopilot: string;
  wadecv: string;
  verdict: "wadecv" | "jobcopilot" | "tie";
}[] = [
  {
    feature: "Core approach",
    jobcopilot:
      "AI-powered auto-apply platform that submits job applications on your behalf. Focuses on volume — applying to hundreds of jobs automatically across multiple job boards.",
    wadecv:
      "Takes your existing CV and a specific job URL, runs a gap analysis, then rewrites the entire resume tailored to that role. Focuses on quality — every resume is customized per application.",
    verdict: "tie",
  },
  {
    feature: "Job description input",
    jobcopilot:
      "Connects to job boards and applies to matching roles automatically based on your preferences and filters.",
    wadecv:
      "Paste a LinkedIn, Indeed, Greenhouse, or Lever URL and the job description is scraped automatically. You choose exactly which jobs to target.",
    verdict: "tie",
  },
  {
    feature: "Resume tailoring depth",
    jobcopilot:
      "Generates variations of your resume for different applications, but optimized for speed across many applications rather than deep per-job customization.",
    wadecv:
      "Full section-by-section rewrite — summary, experience bullets, and skills — all aligned to the specific job description. Each resume is deeply tailored to one role.",
    verdict: "wadecv",
  },
  {
    feature: "Fit / gap analysis",
    jobcopilot:
      "Job matching based on your profile preferences. Shows how well jobs match your criteria.",
    wadecv:
      "Detailed gap analysis before tailoring — identifies missing skills, experience gaps, and keyword mismatches. You see your fit score before committing a credit.",
    verdict: "wadecv",
  },
  {
    feature: "Application automation",
    jobcopilot:
      "Fully automated — applies to jobs on your behalf, fills out application forms, and submits. Can apply to hundreds of jobs per day.",
    wadecv:
      "Not automated. You choose each job, review the tailored resume, and submit applications yourself. Designed for targeted, high-quality applications.",
    verdict: "jobcopilot",
  },
  {
    feature: "Cover letter generation",
    jobcopilot: "AI-generated cover letters included with automated applications.",
    wadecv:
      "Generates a tailored cover letter alongside every tailored resume, matched to the same job description — included free with every tailoring.",
    verdict: "tie",
  },
  {
    feature: "ATS optimization",
    jobcopilot: "Basic ATS-friendly formatting across automated applications.",
    wadecv:
      "Generates an ATS-safe DOCX with correct headings, bullet structure, and keyword placement — optimization is built into the generation process.",
    verdict: "wadecv",
  },
  {
    feature: "Section-by-section editing",
    jobcopilot:
      "Limited editing since the focus is on automated submission rather than manual review.",
    wadecv:
      "Edit any section independently — summary, experience, skills — after the AI tailors the full resume. Regenerate individual sections without redoing the whole CV.",
    verdict: "wadecv",
  },
  {
    feature: "Application tracking",
    jobcopilot:
      "Built-in dashboard tracking all auto-applied jobs, responses, and interview invitations across platforms.",
    wadecv:
      "Built-in application tracker to manage jobs you have applied to and track your tailored resumes.",
    verdict: "jobcopilot",
  },
  {
    feature: "Physical mail delivery",
    jobcopilot: "Not available.",
    wadecv:
      "Send a printed resume via USPS directly from the app — useful for high-priority applications where a physical copy stands out.",
    verdict: "wadecv",
  },
  {
    feature: "Pricing model",
    jobcopilot:
      "Subscription-based — monthly plans starting around $15-30/month depending on features and application volume.",
    wadecv:
      "Pay-per-use credits — no subscription. Starter: 20 credits for $10 ($0.50/resume). No monthly commitment.",
    verdict: "wadecv",
  },
];

const FAQ = [
  {
    question: "Is WadeCV better than JobCopilot?",
    answer:
      "It depends on your job search strategy. WadeCV is better for targeted applications — it deeply tailors each resume to a specific job, giving you the highest quality per application. JobCopilot is better for high-volume applications — it automates the submission process so you can apply to many jobs quickly. If quality matters more than quantity, choose WadeCV. If speed and volume are your priority, JobCopilot may suit you better.",
  },
  {
    question: "Can JobCopilot tailor resumes like WadeCV?",
    answer:
      "JobCopilot generates resume variations for different applications, but its focus is automation speed rather than deep per-job customization. WadeCV rewrites your entire resume section by section for each specific job description, with a gap analysis showing exactly what was changed and why. The tailoring depth is significantly different.",
  },
  {
    question: "Is auto-applying with JobCopilot effective?",
    answer:
      "Auto-applying can help you cast a wider net, but it comes with trade-offs. Many recruiters and ATS systems can detect mass-applied resumes, and response rates per application tend to be lower with volume-based approaches. A smaller number of deeply tailored applications often outperforms a large number of generic ones — especially for competitive roles.",
  },
  {
    question: "Which is cheaper — WadeCV or JobCopilot?",
    answer:
      "WadeCV uses pay-per-use credits with no subscription — 20 tailored resumes for $10. JobCopilot uses monthly subscription pricing, typically $15-30/month. For job seekers applying to 10-30 targeted roles, WadeCV is usually cheaper. For those wanting to auto-apply to hundreds of jobs, JobCopilot's subscription may offer better value per application.",
  },
  {
    question: "Can I use both JobCopilot and WadeCV?",
    answer:
      "Yes. A common strategy is to use WadeCV for your top-priority applications — roles you really want — where a deeply tailored resume makes the difference. Then use JobCopilot for broader applications where volume matters more. This gives you the best of both approaches: quality where it counts, and coverage for everything else.",
  },
];

export default function JobCopilotComparisonPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "WadeCV vs JobCopilot: AI Resume & Job Application Tools Compared (2026)",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/wadecv-vs-jobcopilot`,
            },
            datePublished: "2026-04-12",
            dateModified: "2026-04-12",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />

      <h1 className="text-3xl font-bold mb-4">
        WadeCV vs JobCopilot: AI Resume &amp; Job Application Tools Compared (2026)
      </h1>

      <p className="text-muted-foreground mb-6">
        JobCopilot is a fast-growing AI job application tool that automates the process of applying
        to jobs at scale. WadeCV takes a different approach: instead of automating submissions, it
        focuses on deeply tailoring your resume for each specific role. One prioritizes volume, the
        other prioritizes quality. Here&apos;s how they compare across features, workflow, and
        pricing.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Feature comparison: WadeCV vs JobCopilot</h2>
        <div className="space-y-4">
          {ROWS.map((row) => (
            <Card key={row.feature}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {row.feature}
                  {row.verdict === "wadecv" && (
                    <Badge variant="default" className="text-xs">
                      WadeCV wins
                    </Badge>
                  )}
                  {row.verdict === "jobcopilot" && (
                    <Badge variant="secondary" className="text-xs">
                      JobCopilot wins
                    </Badge>
                  )}
                  {row.verdict === "tie" && (
                    <Badge variant="outline" className="text-xs">
                      Tie
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground mb-1">JobCopilot</p>
                  <p>{row.jobcopilot}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">WadeCV</p>
                  <p>{row.wadecv}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">When JobCopilot is the better choice</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You want to maximize the number of applications you send — casting a wide net across
            many job boards.
          </li>
          <li>
            You prefer a hands-off approach where the tool handles application submission
            automatically.
          </li>
          <li>
            You are applying to roles where volume matters more than deep customization — such as
            entry-level positions or broad job searches.
          </li>
          <li>
            You want a centralized dashboard tracking all your auto-applied jobs and responses.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">When WadeCV is the better choice</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You want each resume deeply tailored to a specific job — not just keyword-swapped, but
            rewritten section by section.
          </li>
          <li>
            You want a gap analysis showing exactly what your resume is missing before you tailor
            it.
          </li>
          <li>
            You are applying to competitive roles where a generic resume will not get past the first
            screen.
          </li>
          <li>
            You want a tailored cover letter generated alongside each resume at no extra cost.
          </li>
          <li>
            You prefer pay-per-use pricing instead of a monthly subscription — only pay when you
            apply.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">The verdict</h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            JobCopilot and WadeCV solve different problems. JobCopilot is an application automation
            tool — it gets your resume in front of as many hiring managers as possible, as quickly
            as possible. WadeCV is a resume tailoring tool — it makes sure each resume you send is
            precisely matched to the job you are applying for.
          </p>
          <p>
            For competitive roles at companies you genuinely want to work at, the quality of your
            resume matters more than the number of applications you send. A deeply tailored resume
            that addresses the specific requirements of a job description will consistently
            outperform a mass-applied generic one.
          </p>
          <p>
            The strongest strategy combines both: use WadeCV for your high-priority applications
            where a tailored resume makes the difference, and use JobCopilot for broader coverage
            where volume helps you discover opportunities.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Frequently asked questions</h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <Card key={f.question}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{f.question}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{f.answer}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <CrossCategoryLinks
        currentCategory="/wadecv-vs-jobcopilot"
        contextLinks={[
          {
            href: "/best-ai-resume-builder-2026",
            label: "Best AI Resume Builders 2026",
          },
          { href: "/wadecv-vs-teal", label: "WadeCV vs Teal" },
          { href: "/wadecv-vs-jobscan", label: "WadeCV vs Jobscan" },
          { href: "/wadecv-vs-wobo", label: "WadeCV vs Wobo AI" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Try WadeCV free — no subscription needed</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your CV, paste a job URL, and get a fully tailored resume plus cover letter in
            seconds. 1 free credit included on signup.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta variant="job" label="Tailor your resume now" slug="jobcopilot-comparison" />
        </CardContent>
      </Card>
    </article>
  );
}
