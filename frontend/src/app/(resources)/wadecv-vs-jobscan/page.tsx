import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoCta } from "@/components/seo/seo-cta";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://wadecv.com");

export const metadata = {
  title: "WadeCV vs Jobscan: AI Resume Tailoring vs ATS Scanning (2026) | WadeCV",
  description:
    "WadeCV vs Jobscan compared: ATS optimization, resume tailoring, keyword matching, and pricing. See which resume tool actually rewrites your CV for each job.",
  openGraph: {
    title: "WadeCV vs Jobscan: AI Resume Tailoring vs ATS Scanning (2026)",
    description:
      "WadeCV vs Jobscan compared: ATS optimization, resume tailoring, keyword matching, and pricing side-by-side.",
  },
  twitter: {
    card: "summary" as const,
    title: "WadeCV vs Jobscan: AI Resume Tailoring vs ATS Scanning (2026)",
    description:
      "WadeCV vs Jobscan: resume tailoring, ATS optimization, pricing, and features compared.",
  },
};

const ROWS: {
  feature: string;
  jobscan: string;
  wadecv: string;
  verdict: "wadecv" | "jobscan" | "tie";
}[] = [
  {
    feature: "Core approach",
    jobscan:
      "Scans your resume against a job description and gives you a match score with keyword suggestions. You make the edits yourself.",
    wadecv:
      "Takes your existing resume and a job URL, then rewrites the entire resume — bullets, summary, and skills — to match that specific role.",
    verdict: "wadecv",
  },
  {
    feature: "ATS optimization",
    jobscan:
      "Industry-leading ATS scanner that checks formatting, keywords, and section headings against known ATS rules.",
    wadecv:
      "Generates an ATS-safe DOCX with correct headings, bullet structure, and keyword placement built in — optimization happens during generation, not as an afterthought.",
    verdict: "tie",
  },
  {
    feature: "Resume rewriting",
    jobscan:
      "Does not rewrite your resume. Shows you which keywords to add and where, but you do the writing.",
    wadecv:
      "AI rewrites your entire resume section by section, tailored to the specific job description. No manual keyword insertion required.",
    verdict: "wadecv",
  },
  {
    feature: "Job URL scraping",
    jobscan:
      "You paste the job description text into a text box manually.",
    wadecv:
      "Paste a LinkedIn, Indeed, Greenhouse, or Lever URL and the job description is scraped automatically.",
    verdict: "wadecv",
  },
  {
    feature: "Fit / gap analysis",
    jobscan:
      "Match rate percentage with hard skills, soft skills, and keyword frequency analysis.",
    wadecv:
      "Full gap analysis that identifies missing skills and experience, then closes those gaps automatically during tailoring.",
    verdict: "tie",
  },
  {
    feature: "Cover letter generation",
    jobscan:
      "AI cover letter builder available on paid plans.",
    wadecv:
      "Generates a tailored cover letter alongside every tailored resume, matched to the same job description — included free with every tailoring.",
    verdict: "wadecv",
  },
  {
    feature: "LinkedIn optimization",
    jobscan:
      "Scans your LinkedIn profile against job descriptions and suggests improvements — a unique Jobscan feature.",
    wadecv:
      "Focused on resume and cover letter output. No LinkedIn profile optimization.",
    verdict: "jobscan",
  },
  {
    feature: "Resume builder & templates",
    jobscan:
      "Built-in resume builder with ATS-friendly templates.",
    wadecv:
      "Works from your existing CV — imports and tailors rather than building from scratch.",
    verdict: "jobscan",
  },
  {
    feature: "Section-by-section editing",
    jobscan:
      "Edit within the resume builder interface.",
    wadecv:
      "Edit any section independently — summary, experience, skills — after the AI tailors the full resume.",
    verdict: "tie",
  },
  {
    feature: "Physical mail delivery",
    jobscan:
      "Not available.",
    wadecv:
      "Send a printed resume via USPS directly from the app — useful for high-priority applications.",
    verdict: "wadecv",
  },
  {
    feature: "Pricing model",
    jobscan:
      "Free tier with limited scans; paid plans from ~$50/month (billed quarterly) for unlimited scans.",
    wadecv:
      "Pay-per-use credits — no subscription. Starter: 20 credits for $10 ($0.50/resume). No monthly commitment.",
    verdict: "wadecv",
  },
];

const FAQ = [
  {
    question: "Is WadeCV better than Jobscan for optimizing my resume?",
    answer:
      "They solve different problems. Jobscan tells you what to change (keyword gaps, formatting issues), but you make the edits. WadeCV makes the changes for you — it rewrites your resume to match each job description automatically. If you want a hands-off tailoring workflow, WadeCV is faster. If you want to learn ATS rules and optimize manually, Jobscan is more educational.",
  },
  {
    question: "Does Jobscan rewrite your resume?",
    answer:
      "No. Jobscan is a scanning and scoring tool. It shows you your match rate and which keywords are missing, but the actual rewriting is done by you. WadeCV handles the rewriting automatically using AI.",
  },
  {
    question: "Is Jobscan worth the price compared to WadeCV?",
    answer:
      "Jobscan's paid plans start around $50/month (billed quarterly). WadeCV charges per resume — 20 tailored resumes for $10. If you're applying to 10-30 jobs, WadeCV is significantly cheaper. Jobscan's unlimited scanning makes more sense if you're doing very high-volume applications.",
  },
  {
    question: "Can I use both Jobscan and WadeCV?",
    answer:
      "Yes. You could use WadeCV to generate a tailored resume for each job, then run it through Jobscan's scanner to verify the match rate before submitting. This gives you automated tailoring plus a second-opinion ATS check.",
  },
  {
    question: "Which tool is better for someone new to job searching?",
    answer:
      "Jobscan is more educational — it teaches you about ATS systems and keyword optimization. WadeCV is more practical — it just produces a tailored resume without requiring you to understand the underlying mechanics. Both are useful, depending on whether you want to learn the process or get the result.",
  },
];

export default function JobscanComparisonPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "WadeCV vs Jobscan: AI Resume Tailoring vs ATS Scanning (2026)",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/wadecv-vs-jobscan`,
            },
            datePublished: "2026-04-08",
            dateModified: "2026-04-08",
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
        WadeCV vs Jobscan: AI Resume Tailoring vs ATS Scanning (2026)
      </h1>

      <p className="text-muted-foreground mb-6">
        Jobscan is the most popular ATS resume scanner on the market — it tells
        you how well your resume matches a job description and what keywords
        you&apos;re missing. WadeCV takes a different approach: instead of
        scoring your resume and leaving the edits to you, it rewrites your
        entire resume to match each job automatically. Here&apos;s how the two
        tools compare feature by feature.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Feature comparison: WadeCV vs Jobscan
        </h2>
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
                  {row.verdict === "jobscan" && (
                    <Badge variant="secondary" className="text-xs">
                      Jobscan wins
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
                  <p className="font-medium text-foreground mb-1">Jobscan</p>
                  <p>{row.jobscan}</p>
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
        <h2 className="text-xl font-semibold mb-3">
          When Jobscan is the better choice
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You want to learn how ATS systems work and understand exactly why
            your resume is or isn&apos;t passing screening.
          </li>
          <li>
            You need LinkedIn profile optimization alongside resume scanning.
          </li>
          <li>
            You prefer to manually control every edit and keyword placement in
            your resume.
          </li>
          <li>
            You want a resume builder with templates to create a new resume from
            scratch.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          When WadeCV is the better choice
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You already have a resume and want to tailor it for each job you
            apply to — without spending 30 minutes editing per application.
          </li>
          <li>
            You want the AI to actually rewrite your resume, not just tell you
            what to change.
          </li>
          <li>
            You need a tailored cover letter generated alongside each resume.
          </li>
          <li>
            You want to pay per resume instead of committing to a $50+/month
            subscription.
          </li>
          <li>
            You want a clean, ATS-safe DOCX output ready to upload — not a
            score with a to-do list.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">The verdict</h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            Jobscan is the gold standard for ATS scanning and keyword analysis.
            If you want to understand exactly how your resume matches a job
            description and learn the rules of ATS optimization, Jobscan is the
            more educational tool. But it stops at diagnosis — you still have to
            do the work of rewriting.
          </p>
          <p>
            WadeCV picks up where scanning leaves off. It takes your existing
            resume and a job URL, runs a gap analysis, and then rewrites your
            entire resume to close those gaps — all automatically. For job
            seekers who want the result (a tailored resume) rather than the
            process (keyword lists), WadeCV is faster and cheaper.
          </p>
          <p>
            The two tools work well together: use WadeCV to generate tailored
            resumes, then optionally run them through Jobscan for a second-opinion
            ATS check before submitting.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <Card key={f.question}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{f.question}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {f.answer}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <CrossCategoryLinks
        currentCategory="/wadecv-vs-jobscan"
        contextLinks={[
          { href: "/best-ai-resume-builder-2026", label: "Best AI Resume Builders 2026" },
          { href: "/wadecv-vs-teal", label: "WadeCV vs Teal" },
          { href: "/wadecv-vs-rezi", label: "WadeCV vs Rezi" },
          { href: "/ai-resume-builder-comparison", label: "AI Resume Builder Comparison" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Try WadeCV free — no subscription needed</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your CV, paste a job URL, and get a fully tailored resume
            plus cover letter in seconds. 1 free credit included on signup.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta
            variant="job"
            label="Tailor your resume now"
            slug="jobscan-comparison"
          />
        </CardContent>
      </Card>
    </article>
  );
}
