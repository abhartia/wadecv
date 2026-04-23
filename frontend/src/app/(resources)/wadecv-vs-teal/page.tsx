import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoCta } from "@/components/seo/seo-cta";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://wadecv.com");

export const metadata = {
  title: "WadeCV vs Teal: Which AI Resume Builder Is Better in 2026? | WadeCV",
  description:
    "WadeCV vs Teal head-to-head: ATS optimization, job-description tailoring, pricing, and features compared. Find out which AI resume tool is right for your job search.",
  openGraph: {
    title: "WadeCV vs Teal: Which AI Resume Builder Is Better in 2026?",
    description:
      "WadeCV vs Teal head-to-head: ATS optimization, job-description tailoring, pricing, and features compared.",
  },
  twitter: {
    card: "summary" as const,
    title: "WadeCV vs Teal: Which AI Resume Builder Is Better in 2026?",
    description:
      "WadeCV vs Teal: ATS optimization, tailoring, pricing, and features compared side-by-side.",
  },
};

const ROWS: {
  feature: string;
  teal: string;
  wadecv: string;
  verdict: "wadecv" | "teal" | "tie";
}[] = [
  {
    feature: "Job-description tailoring",
    teal: "Highlights keywords from the JD you paste but does not rewrite your resume bullets automatically.",
    wadecv:
      "Paste a job URL or description and WadeCV rewrites your entire resume — bullets, summary, and skills — matched to that specific role.",
    verdict: "wadecv",
  },
  {
    feature: "ATS optimization",
    teal: "Provides an ATS score and keyword suggestions. You apply the changes manually.",
    wadecv:
      "Automatically generates an ATS-safe DOCX with correct headings, bullet structure, and keyword placement — no manual editing required.",
    verdict: "wadecv",
  },
  {
    feature: "Job URL scraping",
    teal: "You copy-paste the job description text manually.",
    wadecv:
      "Paste a LinkedIn, Indeed, Greenhouse, or Lever URL and the job description is scraped automatically.",
    verdict: "wadecv",
  },
  {
    feature: "Fit / gap analysis",
    teal: "Keyword match score shows which JD terms appear in your resume.",
    wadecv:
      "Full gap analysis that identifies missing skills and experience before you tailor, so you know exactly what to highlight.",
    verdict: "wadecv",
  },
  {
    feature: "Resume builder & templates",
    teal: "Built-in resume builder with multiple templates and formatting options.",
    wadecv:
      "Works from your existing CV — imports your resume and tailors it rather than building from scratch.",
    verdict: "teal",
  },
  {
    feature: "Cover letter generation",
    teal: "AI cover letter writer available.",
    wadecv:
      "Generates a tailored cover letter alongside every tailored resume, matched to the same job description.",
    verdict: "tie",
  },
  {
    feature: "Application tracking",
    teal: "Full job tracker with status columns, notes, and contacts — a core Teal feature.",
    wadecv:
      "Built-in application tracker so you can manage jobs and their tailored CVs in one place.",
    verdict: "tie",
  },
  {
    feature: "Section-by-section editing",
    teal: "Edit sections within the resume builder.",
    wadecv:
      "Edit any section independently — summary, experience, skills — after the AI tailors the full resume.",
    verdict: "tie",
  },
  {
    feature: "DOCX export",
    teal: "Export to PDF and Word formats.",
    wadecv:
      "Exports a clean, ATS-tested DOCX file ready to upload to any applicant tracking system.",
    verdict: "tie",
  },
  {
    feature: "Physical mail delivery",
    teal: "Not available.",
    wadecv:
      "Send a printed resume via USPS directly from the app — useful for high-priority applications or companies that still value physical materials.",
    verdict: "wadecv",
  },
  {
    feature: "Pricing model",
    teal: "Free tier with limited features; paid plans starting around $9/month.",
    wadecv:
      "Pay-per-use credits — no subscription. Starter: 20 credits for $10 ($0.50/resume). No monthly commitment.",
    verdict: "tie",
  },
];

const FAQ = [
  {
    question: "Is WadeCV better than Teal for tailoring resumes to specific jobs?",
    answer:
      "For active job seekers applying to multiple specific roles, WadeCV is purpose-built for tailoring: paste a job URL, get a fully rewritten resume matched to that description, plus a cover letter. Teal's keyword highlighting requires more manual effort to apply changes.",
  },
  {
    question: "Does Teal rewrite your resume automatically?",
    answer:
      "Teal shows you which keywords from a job description are missing from your resume, but the rewriting is done manually by you. WadeCV rewrites your bullets and summary automatically using AI, matched to the job.",
  },
  {
    question: "Which tool is better if I'm starting from scratch?",
    answer:
      "If you have no existing resume, Teal's resume builder with templates is a good starting point. Once you have a base resume, WadeCV can tailor it to any specific job description.",
  },
  {
    question: "Does WadeCV have an ATS score like Teal?",
    answer:
      "WadeCV runs a gap analysis before tailoring that shows your fit against the job description. Rather than just scoring your current resume, it then rewrites it to close those gaps — so you get the improvement, not just the diagnosis.",
  },
  {
    question: "Can I use both Teal and WadeCV together?",
    answer:
      "Yes. Many job seekers use Teal to track applications and manage their job pipeline, and WadeCV to generate the tailored resume and cover letter for each specific role they're serious about.",
  },
];

export default function TealComparisonPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "WadeCV vs Teal: Which AI Resume Builder Is Better in 2026?",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/wadecv-vs-teal`,
            },
            datePublished: "2026-04-06",
            dateModified: "2026-04-06",
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
        WadeCV vs Teal: Which AI Resume Builder Is Better in 2026?
      </h1>

      <p className="text-muted-foreground mb-6">
        Teal and WadeCV are both AI-powered tools for job seekers — but they solve different
        problems. Teal is built around resume creation, keyword tracking, and job pipeline
        management. WadeCV is built for one specific high-value task: taking your existing resume
        and tailoring it to a specific job description, automatically. Here&apos;s the side-by-side
        breakdown.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Feature comparison: WadeCV vs Teal</h2>
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
                  {row.verdict === "teal" && (
                    <Badge variant="secondary" className="text-xs">
                      Teal wins
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
                  <p className="font-medium text-foreground mb-1">Teal</p>
                  <p>{row.teal}</p>
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
        <h2 className="text-xl font-semibold mb-3">When Teal is the better choice</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>You need to build a resume from scratch and want templates and a visual editor.</li>
          <li>You want a full job tracker (pipeline, contacts, notes) as part of the same tool.</li>
          <li>You prefer a monthly subscription model with unlimited access to all features.</li>
          <li>You want to manually review and apply every keyword suggestion yourself.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">When WadeCV is the better choice</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You already have a base resume and want to tailor it to a specific job fast — without
            manual editing.
          </li>
          <li>
            You want the AI to actually rewrite your resume, not just highlight gaps for you to fix.
          </li>
          <li>
            You need a clean, ATS-safe DOCX output ready to upload — not a PDF from a drag-and-drop
            builder.
          </li>
          <li>
            You prefer paying per resume (no monthly commitment) and are applying to a focused set
            of roles.
          </li>
          <li>
            You want a fit analysis before committing to tailoring, so you know if the role is worth
            pursuing.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">The verdict</h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            Teal is strong if you&apos;re at the start of your job search and need to build a resume
            and track your pipeline. WadeCV wins decisively on the tailoring workflow: it goes
            further than keyword highlighting by rewriting your entire resume for each role,
            outputting an ATS-safe DOCX, and generating a matched cover letter — all from a single
            job URL.
          </p>
          <p>
            If you already have a resume and are actively applying, WadeCV&apos;s pay-per-tailoring
            model is more cost-effective than a monthly subscription — especially when you&apos;re
            targeting a specific set of roles rather than a broad spray-and-pray approach.
          </p>
          <p>
            The two tools can also be complementary: use Teal to manage your job pipeline and track
            applications, and WadeCV to generate the tailored resume and cover letter for each role
            you&apos;re serious about.
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
        currentCategory="/wadecv-vs-teal"
        contextLinks={[
          { href: "/best-ai-resume-builder-2026", label: "Best AI Resume Builders 2026" },
          { href: "/wadecv-vs-jobscan", label: "WadeCV vs Jobscan" },
          { href: "/wadecv-vs-rezi", label: "WadeCV vs Rezi" },
          { href: "/ai-resume-builder-comparison", label: "AI Resume Builder Comparison" },
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
          <SeoCta variant="job" label="Tailor your resume now" slug="teal-comparison" />
        </CardContent>
      </Card>
    </article>
  );
}
