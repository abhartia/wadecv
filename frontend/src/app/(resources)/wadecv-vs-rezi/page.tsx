import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoCta } from "@/components/seo/seo-cta";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://wadecv.com");

export const metadata = {
  title: "WadeCV vs Rezi: AI Resume Tailoring vs AI Resume Builder (2026) | WadeCV",
  description:
    "WadeCV vs Rezi compared: AI resume tailoring per-job vs AI resume builder with ATS scoring. Features, pricing, and which tool gets you more interviews.",
  openGraph: {
    title: "WadeCV vs Rezi: AI Resume Tailoring vs AI Resume Builder (2026)",
    description:
      "WadeCV vs Rezi feature-by-feature comparison for AI resume building, tailoring, and ATS optimization.",
  },
  twitter: {
    card: "summary" as const,
    title: "WadeCV vs Rezi: AI Resume Tailoring vs AI Resume Builder (2026)",
    description:
      "WadeCV vs Rezi: AI resume tailoring vs AI resume builder compared on features, pricing, and ATS.",
  },
};

const ROWS: {
  feature: string;
  rezi: string;
  wadecv: string;
  verdict: "wadecv" | "rezi" | "tie";
}[] = [
  {
    feature: "Core approach",
    rezi: "AI resume builder that helps you create a resume from scratch using AI-generated content, ATS keyword scoring, and built-in templates.",
    wadecv:
      "AI resume tailoring tool that imports your existing CV, analyzes a specific job description, and rewrites your resume to match each role.",
    verdict: "tie",
  },
  {
    feature: "Job-specific tailoring",
    rezi: "AI content suggestions can be informed by job descriptions, but each edit is a separate action. No one-click per-job tailoring.",
    wadecv:
      "Paste a job URL and the AI rewrites your entire resume — summary, bullets, and skills — to match the specific role. One-click tailoring per application.",
    verdict: "wadecv",
  },
  {
    feature: "Job description input",
    rezi: "Manual paste of job description text for keyword analysis. No automatic job URL scraping.",
    wadecv:
      "Scrapes job descriptions from LinkedIn, Indeed, Greenhouse, Lever, and other job boards automatically from a URL.",
    verdict: "wadecv",
  },
  {
    feature: "Fit / gap analysis",
    rezi: "ATS keyword score that shows how well your resume matches a job description. Highlights missing keywords.",
    wadecv:
      "Full gap analysis showing missing skills, keyword mismatches, and experience gaps — then closes them automatically during tailoring.",
    verdict: "wadecv",
  },
  {
    feature: "AI content generation",
    rezi: "AI generates resume bullet points, summaries, and skills sections. Content is generated for your overall profile, not per-job.",
    wadecv:
      "AI rewrites your actual experience to align with each specific job description. Content is tailored per-application, not generic.",
    verdict: "wadecv",
  },
  {
    feature: "Resume templates & design",
    rezi: "Multiple ATS-optimized templates with customizable sections, fonts, and formatting. Visual editor with real-time preview.",
    wadecv:
      "Focuses on content over design — imports your existing format and outputs a clean, ATS-safe DOCX. No template gallery.",
    verdict: "rezi",
  },
  {
    feature: "ATS optimization",
    rezi: "ATS keyword scoring with percentage match. Highlights missing keywords. Templates designed for ATS compatibility.",
    wadecv:
      "Every resume is generated with ATS-safe formatting and keywords from the specific job description embedded naturally in your experience bullets.",
    verdict: "tie",
  },
  {
    feature: "Cover letter generation",
    rezi: "AI cover letter builder available. Generated separately from resume content.",
    wadecv:
      "AI-generated cover letter tailored to each job description, included free with every resume tailoring.",
    verdict: "wadecv",
  },
  {
    feature: "Application tracking",
    rezi: "Not available. Rezi focuses on resume creation and optimization.",
    wadecv:
      "Built-in application tracker to manage jobs and keep track of tailored resumes for each application.",
    verdict: "wadecv",
  },
  {
    feature: "Resume import",
    rezi: "Can import existing resumes, but primarily designed for building from scratch using their editor and AI tools.",
    wadecv:
      "Built around importing your existing CV. Upload once, then tailor for every application. Your real experience is the foundation.",
    verdict: "wadecv",
  },
  {
    feature: "Pricing model",
    rezi: "Free tier with limited features. Pro plan at a monthly subscription for full AI access and unlimited resumes.",
    wadecv:
      "Pay-per-use credits — no subscription. Starter: 20 credits for $10 ($0.50/resume). 1 free credit on signup.",
    verdict: "tie",
  },
];

const FAQ = [
  {
    question: "Is WadeCV better than Rezi?",
    answer:
      "They serve different workflows. Rezi is an AI resume builder — ideal for creating a resume from scratch with AI-generated content and ATS keyword scoring. WadeCV is a tailoring tool — it takes your existing resume and rewrites it for each specific job application. If you need to build a resume, Rezi helps. If you already have a resume and want to customize it per-job efficiently, WadeCV automates that process.",
  },
  {
    question: "Does Rezi tailor resumes to specific job descriptions?",
    answer:
      "Rezi offers ATS keyword scoring that compares your resume against a job description and highlights missing keywords. However, it does not automatically rewrite your resume for each application. WadeCV takes the next step — paste a job URL, and the AI rewrites your entire resume (summary, bullets, skills) to match the specific role in one click.",
  },
  {
    question: "Which has better ATS optimization — Rezi or WadeCV?",
    answer:
      "Both tools prioritize ATS compatibility. Rezi provides an ATS score and keyword analysis, giving you visibility into how well your resume matches. WadeCV embeds job-specific keywords directly into your experience bullets during tailoring, so every resume is optimized for the specific ATS and job posting. The approaches are complementary — Rezi scores, WadeCV tailors.",
  },
  {
    question: "Can I use Rezi and WadeCV together?",
    answer:
      "Yes. You can use Rezi to build a strong base resume with AI-generated content, then upload it to WadeCV to tailor it for each job application. Rezi gives you a polished starting point; WadeCV customizes it per-job so you do not have to manually edit for every application.",
  },
  {
    question: "Is Rezi free?",
    answer:
      "Rezi offers a free tier with limited access to AI features and templates. Full AI content generation and advanced features require a Pro subscription. WadeCV gives you 1 free credit on signup (enough to tailor one resume), then uses pay-per-use pricing — no monthly subscription required.",
  },
];

export default function ReziComparisonPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "WadeCV vs Rezi: AI Resume Tailoring vs AI Resume Builder (2026)",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/wadecv-vs-rezi`,
            },
            datePublished: "2026-04-11",
            dateModified: "2026-04-11",
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
        WadeCV vs Rezi: AI Resume Tailoring vs AI Resume Builder (2026)
      </h1>

      <p className="text-muted-foreground mb-6">
        Rezi is a popular AI resume builder known for its ATS keyword scoring and AI-generated
        content. WadeCV takes a different approach: instead of building a resume from scratch, it
        imports your existing CV and uses AI to rewrite it for each specific job application.
        Here&apos;s how the two tools compare across features, pricing, and workflow.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Feature comparison: WadeCV vs Rezi</h2>
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
                  {row.verdict === "rezi" && (
                    <Badge variant="secondary" className="text-xs">
                      Rezi wins
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
                  <p className="font-medium text-foreground mb-1">Rezi</p>
                  <p>{row.rezi}</p>
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
        <h2 className="text-xl font-semibold mb-3">When Rezi is the better choice</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You need to build a resume from scratch and want AI-generated content suggestions for
            bullet points and summaries.
          </li>
          <li>
            You want an ATS keyword score to see how well your resume matches a job description
            before applying.
          </li>
          <li>You prefer a visual resume editor with multiple templates and formatting options.</li>
          <li>
            You are early in your career and need help writing resume content for the first time.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">When WadeCV is the better choice</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You already have a resume and want to tailor it for each job you apply to without manual
            editing.
          </li>
          <li>
            You want automated job URL scraping — paste a link and get a tailored resume in seconds.
          </li>
          <li>
            You want a full gap analysis that identifies missing skills and experience, then fixes
            them automatically.
          </li>
          <li>
            You want a tailored cover letter generated alongside each resume at no extra cost.
          </li>
          <li>You prefer pay-per-use pricing instead of a monthly subscription.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">The verdict</h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            Rezi and WadeCV represent two different approaches to the same problem. Rezi helps you
            build a strong resume with AI-generated content and gives you visibility into ATS
            keyword matching through its scoring system. WadeCV assumes you already have a resume
            and focuses on the per-application tailoring that makes each submission unique.
          </p>
          <p>
            For job seekers applying to many roles, WadeCV&apos;s one-click tailoring saves
            significant time compared to manually adjusting content for each application. For those
            starting from scratch or wanting a visual editor, Rezi provides a more complete resume
            creation experience.
          </p>
          <p>
            The best workflow combines both: build your base resume with Rezi, then use WadeCV to
            tailor it for every application.
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
        currentCategory="/wadecv-vs-rezi"
        contextLinks={[
          { href: "/best-ai-resume-builder-2026", label: "Best AI Resume Builders 2026" },
          { href: "/wadecv-vs-teal", label: "WadeCV vs Teal" },
          { href: "/wadecv-vs-jobscan", label: "WadeCV vs Jobscan" },
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
          <SeoCta variant="job" label="Tailor your resume now" slug="rezi-comparison" />
        </CardContent>
      </Card>
    </article>
  );
}
