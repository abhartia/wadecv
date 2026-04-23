import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoCta } from "@/components/seo/seo-cta";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://wadecv.com");

export const metadata = {
  title: "WadeCV vs Zety: AI Resume Tailoring vs Resume Template Builder (2026) | WadeCV",
  description:
    "WadeCV vs Zety compared: per-job AI resume tailoring vs template-based resume builder. Features, pricing, and which tool fits your job search in 2026.",
  openGraph: {
    title: "WadeCV vs Zety: AI Resume Tailoring vs Resume Template Builder (2026)",
    description:
      "WadeCV vs Zety feature-by-feature comparison for AI resume tailoring vs template-based resume building.",
  },
  twitter: {
    card: "summary" as const,
    title: "WadeCV vs Zety: AI Resume Tailoring vs Resume Template Builder (2026)",
    description:
      "WadeCV vs Zety: per-job AI resume tailoring vs template-based resume builder compared on features and pricing.",
  },
};

const ROWS: {
  feature: string;
  zety: string;
  wadecv: string;
  verdict: "wadecv" | "zety" | "tie";
}[] = [
  {
    feature: "Core approach",
    zety: "Template-based resume builder with 20+ professional templates, drag-and-drop editing, and pre-written content suggestions.",
    wadecv:
      "AI resume tailoring tool that imports your existing CV, analyzes a specific job description, and rewrites your resume to match each role.",
    verdict: "tie",
  },
  {
    feature: "Job-specific tailoring",
    zety: "Not available. Zety helps you build one resume using templates and suggestions, but does not customize per job application.",
    wadecv:
      "Paste a job URL and the AI rewrites your entire resume — summary, bullets, and skills — to match the specific role. One-click tailoring per application.",
    verdict: "wadecv",
  },
  {
    feature: "Templates & design",
    zety: "20+ professional templates with drag-and-drop editor, customizable colors, fonts, and layouts. Strong visual design options.",
    wadecv:
      "Focuses on content over design — imports your existing format and outputs a clean, ATS-safe DOCX. No template gallery.",
    verdict: "zety",
  },
  {
    feature: "AI content suggestions",
    zety: "Pre-written phrases and bullet point suggestions based on job title. Content is generic and not tailored to a specific job posting.",
    wadecv:
      "AI rewrites your actual experience to align with each specific job description. Content is tailored per-application, not generic.",
    verdict: "wadecv",
  },
  {
    feature: "Job description input",
    zety: "No job URL scraping. Resume content is built from templates and pre-written suggestions, not from a specific job posting.",
    wadecv:
      "Scrapes job descriptions from LinkedIn, Indeed, Greenhouse, Lever, and other job boards automatically from a URL.",
    verdict: "wadecv",
  },
  {
    feature: "Fit / gap analysis",
    zety: "Not available. Zety does not analyze how well your resume matches a specific job description.",
    wadecv:
      "Full gap analysis showing missing skills, keyword mismatches, and experience gaps — then closes them automatically during tailoring.",
    verdict: "wadecv",
  },
  {
    feature: "Cover letter",
    zety: "Separate cover letter builder with templates. Built independently from your resume content.",
    wadecv:
      "AI-generated cover letter tailored to each job description, included free with every resume tailoring.",
    verdict: "wadecv",
  },
  {
    feature: "ATS optimization",
    zety: "ATS-friendly templates designed to pass applicant tracking systems. Formatting is optimized, but keywords are not job-specific.",
    wadecv:
      "Every resume is generated with ATS-safe formatting and keywords from the specific job description embedded naturally in your experience bullets.",
    verdict: "tie",
  },
  {
    feature: "Resume import",
    zety: "Can import an existing resume, but primarily designed for building from scratch using their template editor.",
    wadecv:
      "Built around importing your existing CV. Upload once, then tailor for every application. Your real experience is the foundation.",
    verdict: "wadecv",
  },
  {
    feature: "Application tracking",
    zety: "Not available. Zety focuses on resume and cover letter creation.",
    wadecv:
      "Built-in application tracker to manage jobs and keep track of tailored resumes for each application.",
    verdict: "wadecv",
  },
  {
    feature: "Pricing model",
    zety: "Free to create a resume, but downloading or exporting requires a subscription ($24.99/month or approximately $2.70/week billed every 4 weeks).",
    wadecv:
      "Pay-per-use credits — no subscription. Starter: 20 credits for $10 ($0.50/resume). 1 free credit on signup.",
    verdict: "wadecv",
  },
];

const FAQ = [
  {
    question: "Is WadeCV better than Zety?",
    answer:
      "They are different tools for different needs. Zety is a template-based resume builder — ideal for creating a polished resume from scratch with professional designs and pre-written content. WadeCV is a tailoring tool — it takes your existing resume and rewrites it for each specific job application. If you need beautiful templates, Zety helps. If you already have a resume and want to customize it per-job, WadeCV automates that process.",
  },
  {
    question: "Does Zety tailor resumes to job descriptions?",
    answer:
      "No. Zety helps you build one resume using templates and pre-written content suggestions. It does not analyze job descriptions or customize your resume for each application. WadeCV takes the opposite approach — paste a job URL, and the AI rewrites your entire resume (summary, bullets, skills) to match the specific role in one click.",
  },
  {
    question: "Is Zety really free?",
    answer:
      "Zety is free to create a resume using their editor, but downloading or exporting your finished resume requires a paid subscription. WadeCV gives you 1 free credit on signup (enough to tailor one resume and cover letter), then uses pay-per-use pricing with no recurring subscription.",
  },
  {
    question: "Can I use Zety and WadeCV together?",
    answer:
      "Yes. You can use Zety to build a strong, visually polished base resume with their templates and editor, then upload it to WadeCV to tailor it for each job application. Zety gives you a great starting point; WadeCV customizes it per-job so you do not have to manually edit for every application.",
  },
  {
    question: "Which has better resume templates?",
    answer:
      "Zety wins on templates and visual design. They offer 20+ professional templates with drag-and-drop customization. WadeCV does not compete on templates — it focuses on content tailoring, rewriting your resume to match each specific job description. If visual design is your priority, Zety is the better choice for that.",
  },
];

export default function ZetyComparisonPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "WadeCV vs Zety: AI Resume Tailoring vs Resume Template Builder (2026)",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/wadecv-vs-zety`,
            },
            datePublished: "2026-04-13",
            dateModified: "2026-04-13",
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
        WadeCV vs Zety: AI Resume Tailoring vs Resume Template Builder (2026)
      </h1>

      <p className="text-muted-foreground mb-6">
        Zety is a popular online resume builder known for its 20+ professional templates and
        drag-and-drop editor. WadeCV takes a different approach: instead of building a resume from
        scratch, it imports your existing CV and uses AI to rewrite it for each specific job
        application. Here&apos;s how the two tools compare across features, pricing, and workflow.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Feature comparison: WadeCV vs Zety</h2>
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
                  {row.verdict === "zety" && (
                    <Badge variant="secondary" className="text-xs">
                      Zety wins
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
                  <p className="font-medium text-foreground mb-1">Zety</p>
                  <p>{row.zety}</p>
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
        <h2 className="text-xl font-semibold mb-3">When Zety is the better choice</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You need to build a resume from scratch and want professional templates with
            drag-and-drop editing.
          </li>
          <li>
            You are a first-time resume creator and want pre-written content suggestions to get
            started quickly.
          </li>
          <li>Visual design is a priority and you want to choose from 20+ polished layouts.</li>
          <li>You also need a cover letter builder with matching templates.</li>
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
          <li>You prefer pay-per-use pricing instead of a recurring subscription.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">The verdict</h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            Zety and WadeCV solve different problems in the job application process. Zety helps you
            create a visually polished resume from scratch with professional templates and
            pre-written content suggestions. WadeCV assumes you already have a resume and focuses on
            the per-application tailoring that makes each submission unique.
          </p>
          <p>
            For job seekers applying to many roles, WadeCV&apos;s one-click tailoring saves
            significant time compared to sending the same generic resume to every application. For
            those starting from scratch or wanting a template-driven design experience, Zety
            provides a more complete resume creation workflow.
          </p>
          <p>
            The best workflow combines both: build your base resume with Zety, then use WadeCV to
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
        currentCategory="/wadecv-vs-zety"
        contextLinks={[
          { href: "/best-ai-resume-builder-2026", label: "Best AI Resume Builders 2026" },
          { href: "/wadecv-vs-teal", label: "WadeCV vs Teal" },
          { href: "/wadecv-vs-rezi", label: "WadeCV vs Rezi" },
          { href: "/wadecv-vs-flowcv", label: "WadeCV vs FlowCV" },
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
          <SeoCta variant="job" label="Tailor your resume now" slug="zety-comparison" />
        </CardContent>
      </Card>
    </article>
  );
}
