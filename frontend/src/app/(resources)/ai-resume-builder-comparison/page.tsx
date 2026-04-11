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
  title:
    "WadeCV vs ChatGPT for Resumes: Which Is Better in 2026? | WadeCV",
  description:
    "Compared: using ChatGPT to write your resume vs. a purpose-built AI resume tailor like WadeCV. ATS parsing, job-description matching, and formatting side-by-side.",
  openGraph: {
    title: "WadeCV vs ChatGPT for Resumes: Which Is Better in 2026?",
    description:
      "Compared: using ChatGPT to write your resume vs. a purpose-built AI resume tailor like WadeCV. ATS parsing, job-description matching, and formatting side-by-side.",
  },
  twitter: {
    card: "summary" as const,
    title: "WadeCV vs ChatGPT for Resumes: Which Is Better in 2026?",
    description:
      "Compared: using ChatGPT to write your resume vs. a purpose-built AI resume tailor like WadeCV.",
  },
};

const ROWS: {
  feature: string;
  chatgpt: string;
  wadecv: string;
  verdict: "wadecv" | "chatgpt" | "tie";
}[] = [
  {
    feature: "Job-description keyword matching",
    chatgpt:
      "Manual — you paste the JD and ask it to match keywords. Results vary by prompt.",
    wadecv:
      "Automatic — paste a job URL or description and WadeCV extracts keywords and maps them to your experience.",
    verdict: "wadecv",
  },
  {
    feature: "ATS-safe formatting",
    chatgpt:
      "Outputs plain text or Markdown. You have to format it yourself in Word or Google Docs.",
    wadecv:
      "Generates a clean, ATS-tested DOCX with proper headings, bullet structure, and date formatting.",
    verdict: "wadecv",
  },
  {
    feature: "Preserves your real experience",
    chatgpt:
      "Tends to hallucinate or embellish bullet points. You need to carefully review every line.",
    wadecv:
      "Works from your existing CV — rewrites and reorders your real experience, does not invent new content.",
    verdict: "wadecv",
  },
  {
    feature: "Section-by-section editing",
    chatgpt:
      "Regenerates the whole resume on each prompt. Keeping one section while changing another is tedious.",
    wadecv:
      "Edit any section independently — summary, experience, skills — while keeping the rest locked.",
    verdict: "wadecv",
  },
  {
    feature: "Cover letter generation",
    chatgpt: "Can generate cover letters with the right prompt.",
    wadecv:
      "Generates a tailored cover letter alongside every CV, matched to the same job description.",
    verdict: "tie",
  },
  {
    feature: "Cost",
    chatgpt:
      "Free tier available; GPT-4 requires $20/month subscription.",
    wadecv:
      "Pay-per-use credits starting at $0.50/resume. No subscription required.",
    verdict: "tie",
  },
  {
    feature: "Fit analysis",
    chatgpt:
      "You can ask it to evaluate your fit, but it has no structured framework.",
    wadecv:
      "Built-in gap analysis that scores your match and highlights missing keywords before you tailor.",
    verdict: "wadecv",
  },
  {
    feature: "Job URL scraping",
    chatgpt:
      "Cannot access URLs — you must copy-paste the full job description.",
    wadecv:
      "Paste a LinkedIn, Indeed, or Greenhouse URL and the job description is extracted automatically.",
    verdict: "wadecv",
  },
];

export default function ComparisonPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "WadeCV vs ChatGPT for Resumes: Which Is Better in 2026?",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/ai-resume-builder-comparison`,
            },
          }),
        }}
      />

      <h1 className="text-3xl font-bold mb-4">
        WadeCV vs ChatGPT for Resumes: Which Should You Use?
      </h1>

      <p className="text-muted-foreground mb-6">
        Millions of job seekers now use ChatGPT to write or improve their resumes. It works — to a point. But a general-purpose chatbot and a purpose-built resume tailor solve different problems. This page breaks down the key differences so you can pick the right tool for your situation.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Feature-by-feature comparison
        </h2>
        <div className="space-y-4">
          {ROWS.map((row) => (
            <Card key={row.feature}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {row.feature}
                  {row.verdict === "wadecv" && (
                    <Badge variant="default" className="text-xs">
                      WadeCV
                    </Badge>
                  )}
                  {row.verdict === "chatgpt" && (
                    <Badge variant="secondary" className="text-xs">
                      ChatGPT
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
                  <p className="font-medium text-foreground mb-1">ChatGPT</p>
                  <p>{row.chatgpt}</p>
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
        <h2 className="text-xl font-semibold mb-3">When to use ChatGPT</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You need general career advice or brainstorming help, not a
            production-ready resume.
          </li>
          <li>
            You want to draft a resume from scratch when you have no existing CV
            to start from.
          </li>
          <li>
            You are comfortable manually formatting, checking for hallucinations,
            and handling ATS compliance yourself.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">When to use WadeCV</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You already have a base CV and want to tailor it to a specific job
            description quickly.
          </li>
          <li>
            You need ATS-safe formatting and keyword matching without manual
            work.
          </li>
          <li>
            You are applying to multiple roles and want consistency across
            tailored versions.
          </li>
          <li>
            You want a fit analysis before tailoring, so you know where your
            gaps are.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">The bottom line</h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground">
          <p>
            ChatGPT is a great general-purpose writing tool. But resume tailoring
            is a specific workflow: extract keywords from a job description,
            map them to your experience, rewrite bullets for relevance, and
            output a clean, ATS-safe document. WadeCV does all of that in one
            step because it was built for exactly this workflow.
          </p>
          <p>
            Many users start with ChatGPT and switch to WadeCV when they realize
            how much manual work is involved in getting a production-quality,
            ATS-optimized resume from a chatbot.
          </p>
        </div>
      </section>

      <CrossCategoryLinks
        currentCategory="/ai-resume-builder-comparison"
        contextLinks={[
          { href: "/best-ai-resume-builder-2026", label: "Best AI Resume Builders 2026" },
          { href: "/wadecv-vs-teal", label: "WadeCV vs Teal" },
          { href: "/wadecv-vs-jobscan", label: "WadeCV vs Jobscan" },
          { href: "/wadecv-vs-rezi", label: "WadeCV vs Rezi" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Try WadeCV free</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your CV, paste a job URL, and see how WadeCV tailors your
            resume in seconds — no subscription required.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta variant="job" label="Tailor your resume now" slug="comparison" />
        </CardContent>
      </Card>
    </article>
  );
}
