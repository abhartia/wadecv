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
  title: "WadeCV vs FlowCV: AI Resume Tailoring vs Resume Design (2026) | WadeCV",
  description:
    "WadeCV vs FlowCV compared: AI resume tailoring vs visual resume builder. Features, pricing, ATS optimization, and which tool fits your job search workflow.",
  openGraph: {
    title: "WadeCV vs FlowCV: AI Resume Tailoring vs Resume Design (2026)",
    description:
      "WadeCV vs FlowCV feature-by-feature comparison for resume building, tailoring, and ATS optimization.",
  },
  twitter: {
    card: "summary" as const,
    title: "WadeCV vs FlowCV: AI Resume Tailoring vs Resume Design (2026)",
    description:
      "WadeCV vs FlowCV: AI resume tailoring vs visual resume builder compared on features, pricing, and ATS.",
  },
};

const ROWS: {
  feature: string;
  flowcv: string;
  wadecv: string;
  verdict: "wadecv" | "flowcv" | "tie";
}[] = [
  {
    feature: "Core approach",
    flowcv:
      "Visual resume builder with beautiful templates and real-time preview. Drag-and-drop editing with focus on design and formatting.",
    wadecv:
      "AI resume tailoring tool that imports your existing CV, analyzes job descriptions, and rewrites your resume to match each role you apply to.",
    verdict: "tie",
  },
  {
    feature: "Job-specific tailoring",
    flowcv:
      "Manual editing — you adjust your resume yourself for each application. No automatic job description analysis.",
    wadecv:
      "Paste a job URL and the AI rewrites your resume — summary, bullets, and skills — to match the specific role. Fully automated tailoring.",
    verdict: "wadecv",
  },
  {
    feature: "Job description input",
    flowcv:
      "No job scraping — FlowCV is a builder, not a tailoring tool.",
    wadecv:
      "Scrapes job descriptions from LinkedIn, Indeed, Greenhouse, Lever, and other job boards automatically.",
    verdict: "wadecv",
  },
  {
    feature: "Fit / gap analysis",
    flowcv:
      "Not available. FlowCV focuses on formatting, not content optimization.",
    wadecv:
      "Full gap analysis showing missing skills, keyword mismatches, and experience gaps — then closes them automatically during tailoring.",
    verdict: "wadecv",
  },
  {
    feature: "Resume templates & design",
    flowcv:
      "Wide selection of modern, professionally designed templates with customizable colors, fonts, and layouts. Real-time visual preview as you edit.",
    wadecv:
      "Focuses on content over design — imports your existing format and outputs a clean, ATS-safe DOCX. No template gallery.",
    verdict: "flowcv",
  },
  {
    feature: "Cover letter generation",
    flowcv:
      "Cover letter builder with templates, but no AI tailoring to specific job descriptions.",
    wadecv:
      "AI-generated cover letter tailored to each job description, included free with every resume tailoring.",
    verdict: "wadecv",
  },
  {
    feature: "ATS optimization",
    flowcv:
      "ATS-friendly templates available. Some templates may use formatting that does not parse well in older ATS systems.",
    wadecv:
      "Every resume is generated with ATS-safe formatting — standard headings, clean bullet structure, and keyword placement optimized for ATS parsing.",
    verdict: "wadecv",
  },
  {
    feature: "Multi-language support",
    flowcv:
      "Supports multiple languages and alphabets. Good for international job seekers.",
    wadecv:
      "Primarily English-focused. Supports English-language resumes and job descriptions.",
    verdict: "flowcv",
  },
  {
    feature: "PDF export",
    flowcv:
      "Free PDF downloads with high-quality formatting and design preservation.",
    wadecv:
      "DOCX export (preferred for ATS). Clean formatting that recruiters and ATS systems handle well.",
    verdict: "tie",
  },
  {
    feature: "Application tracking",
    flowcv:
      "Not available. FlowCV is focused on resume creation.",
    wadecv:
      "Built-in application tracker to manage jobs and keep track of tailored resumes.",
    verdict: "wadecv",
  },
  {
    feature: "Pricing model",
    flowcv:
      "Free tier with core features. Pro plan with premium templates and features at a monthly subscription.",
    wadecv:
      "Pay-per-use credits — no subscription. Starter: 20 credits for $10 ($0.50/resume). 1 free credit on signup.",
    verdict: "tie",
  },
];

const FAQ = [
  {
    question: "Is WadeCV better than FlowCV?",
    answer:
      "They solve different problems. FlowCV is a visual resume builder — ideal for creating a polished resume from scratch with professional templates. WadeCV is a tailoring tool — it takes your existing resume and rewrites it for each job application using AI. If you need to design a resume, start with FlowCV. If you already have a resume and want to tailor it per-application, WadeCV is more efficient.",
  },
  {
    question: "Does FlowCV tailor resumes to job descriptions?",
    answer:
      "No. FlowCV is a resume builder focused on design and formatting. You edit content manually. WadeCV automates the tailoring process — paste a job URL, and the AI rewrites your resume to match the specific role, including keyword alignment, skills matching, and bullet rewriting.",
  },
  {
    question: "Which is better for ATS — FlowCV or WadeCV?",
    answer:
      "WadeCV generates resumes specifically optimized for ATS parsing — standard headings, clean structure, and keywords from the job description. FlowCV offers ATS-friendly templates, but some of its design-heavy templates may not parse well in older ATS systems. For maximum ATS compatibility, WadeCV is the safer choice.",
  },
  {
    question: "Can I use FlowCV and WadeCV together?",
    answer:
      "Yes, and it is a great workflow. Use FlowCV to design a visually polished base resume, then upload it to WadeCV to tailor the content for each job application. You get professional design from FlowCV and per-job customization from WadeCV.",
  },
  {
    question: "Is FlowCV free?",
    answer:
      "FlowCV offers a free tier with core resume building features. Premium templates and some advanced features require a Pro subscription. WadeCV gives you 1 free credit on signup (enough to tailor one resume), then uses pay-per-use pricing with no monthly commitment.",
  },
];

export default function FlowcvComparisonPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "WadeCV vs FlowCV: AI Resume Tailoring vs Resume Design (2026)",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/wadecv-vs-flowcv`,
            },
            datePublished: "2026-04-10",
            dateModified: "2026-04-10",
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
        WadeCV vs FlowCV: AI Resume Tailoring vs Resume Design (2026)
      </h1>

      <p className="text-muted-foreground mb-6">
        FlowCV is one of the most popular free resume builders, known for
        beautiful templates and an intuitive visual editor. WadeCV takes a
        different approach: instead of building a resume from scratch, it
        imports your existing CV and uses AI to rewrite it for each job you
        apply to. Here&apos;s how the two tools compare across features,
        pricing, and workflow.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Feature comparison: WadeCV vs FlowCV
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
                  {row.verdict === "flowcv" && (
                    <Badge variant="secondary" className="text-xs">
                      FlowCV wins
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
                  <p className="font-medium text-foreground mb-1">FlowCV</p>
                  <p>{row.flowcv}</p>
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
          When FlowCV is the better choice
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You need to build a resume from scratch and want beautiful,
            professionally designed templates.
          </li>
          <li>
            Design and visual presentation are a priority for your industry
            (creative roles, design, marketing).
          </li>
          <li>
            You need multi-language support or non-Latin alphabet formatting.
          </li>
          <li>
            You want a free resume builder for creating a solid base resume.
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
            apply to without manual editing.
          </li>
          <li>
            You want AI-powered gap analysis that shows exactly what your
            resume is missing for a specific role.
          </li>
          <li>
            ATS compatibility is a priority — WadeCV generates resumes
            specifically optimized for ATS parsing.
          </li>
          <li>
            You want a tailored cover letter generated alongside each resume
            at no extra cost.
          </li>
          <li>
            You prefer pay-per-use pricing instead of a monthly subscription.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">The verdict</h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            FlowCV and WadeCV are fundamentally different tools that serve
            different stages of the job search process. FlowCV excels at
            creating a visually polished resume — its template library and
            real-time editor make it one of the best free resume builders
            available.
          </p>
          <p>
            WadeCV picks up where FlowCV leaves off. Once you have a base
            resume, WadeCV tailors it for each job application automatically.
            Paste a job URL, get a rewritten resume and cover letter, and
            download a clean DOCX ready for ATS submission. For job seekers
            applying to 10, 20, or 50+ roles, this per-job tailoring saves
            hours of manual editing.
          </p>
          <p>
            The ideal workflow: build your base resume in FlowCV, then use
            WadeCV to tailor it for every application.
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
        currentCategory="/wadecv-vs-flowcv"
        contextLinks={[
          { href: "/best-ai-resume-builder-2026", label: "Best AI Resume Builders 2026" },
          { href: "/wadecv-vs-wobo", label: "WadeCV vs Wobo AI" },
          { href: "/wadecv-vs-teal", label: "WadeCV vs Teal" },
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
            slug="flowcv-comparison"
          />
        </CardContent>
      </Card>
    </article>
  );
}
