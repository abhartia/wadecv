import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoCta } from "@/components/seo/seo-cta";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";
import { InlineCta } from "@/components/seo/inline-cta";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://wadecv.com");

export const metadata = {
  title: "WadeCV vs Enhancv: AI Resume Tailoring vs Visual Resume Builder (2026) | WadeCV",
  description:
    "WadeCV vs Enhancv compared: per-job AI resume tailoring vs visual resume templates. Features, pricing, and which tool helps you land more interviews in 2026.",
  openGraph: {
    title: "WadeCV vs Enhancv: AI Resume Tailoring vs Visual Resume Builder (2026)",
    description:
      "WadeCV vs Enhancv feature-by-feature comparison for job-specific tailoring vs design-focused resume building.",
  },
  twitter: {
    card: "summary" as const,
    title: "WadeCV vs Enhancv: AI Resume Tailoring vs Visual Resume Builder (2026)",
    description:
      "WadeCV vs Enhancv: per-job AI resume tailoring vs visual resume templates compared on features and pricing.",
  },
};

const ROWS: {
  feature: string;
  enhancv: string;
  wadecv: string;
  verdict: "wadecv" | "enhancv" | "tie";
}[] = [
  {
    feature: "Core approach",
    enhancv:
      "Visual resume builder with professionally designed templates. You fill in your details and choose a layout, colour scheme, and section order to create a polished resume.",
    wadecv:
      "AI resume tailoring tool that imports your existing CV, analyses a specific job description, and rewrites your resume content to match each role.",
    verdict: "tie",
  },
  {
    feature: "Job-specific tailoring",
    enhancv:
      "Enhancv offers an AI content analyser that scores your resume against a job description and suggests improvements, but you make the edits manually.",
    wadecv:
      "Fully automated: paste a job URL, and WadeCV rewrites your summary, bullets, and skills to match the specific job description. Each application gets a uniquely tailored resume.",
    verdict: "wadecv",
  },
  {
    feature: "Template design",
    enhancv:
      "Wide selection of modern, visually distinctive templates with custom colours, fonts, icons, and layout options. Strong suit for creative and design-focused roles.",
    wadecv:
      "Clean, ATS-optimised formatting focused on readability and parsing accuracy. Professional but less visually customisable than Enhancv.",
    verdict: "enhancv",
  },
  {
    feature: "ATS compatibility",
    enhancv:
      "Most templates are ATS-compatible, but highly visual layouts with columns, icons, or graphics can cause parsing issues with older ATS systems.",
    wadecv:
      "Every resume uses ATS-safe formatting by default. Keywords from the job description are embedded naturally in your experience bullets to maximise ATS match scores.",
    verdict: "wadecv",
  },
  {
    feature: "Fit / gap analysis",
    enhancv:
      "Content analyser gives a score and highlights missing keywords, but does not rewrite your content or close the gaps automatically.",
    wadecv:
      "Full gap analysis showing missing skills, keyword mismatches, and experience gaps — then closes them automatically during the tailoring process.",
    verdict: "wadecv",
  },
  {
    feature: "Cover letter",
    enhancv:
      "Cover letter builder with matching templates. You write the content or use basic AI suggestions, styled to match your resume design.",
    wadecv:
      "AI-generated cover letter tailored to each specific job description, included free with every resume tailoring. Fully automated.",
    verdict: "wadecv",
  },
  {
    feature: "Visual customisation",
    enhancv:
      "Extensive: custom colours, fonts, section layouts, icons, profile photos, infographics, and skill bars. Best-in-class for visual resume design.",
    wadecv:
      "Minimal visual customisation — the focus is on content quality and ATS optimisation rather than design flexibility.",
    verdict: "enhancv",
  },
  {
    feature: "Content sections",
    enhancv:
      "Offers unique sections like My Time (timeline), Strengths chart, Languages bar, and custom sections. Good for portfolios and creative roles.",
    wadecv:
      "Standard professional sections (summary, experience, skills, education) optimised for each job. Section-by-section editor for fine-tuning after AI generation.",
    verdict: "enhancv",
  },
  {
    feature: "AI writing quality",
    enhancv:
      "Basic AI suggestions for bullet points and summaries. Helps with phrasing but does not deeply analyse job descriptions or rewrite content per role.",
    wadecv:
      "GPT-5-mini powered rewriting that analyses the full job description and rewrites every section to match. Each resume reads as if hand-crafted for the role.",
    verdict: "wadecv",
  },
  {
    feature: "Export format",
    enhancv:
      "PDF export with high-fidelity design rendering. DOCX available on paid plans. Design accuracy is a priority.",
    wadecv:
      "DOCX export (industry standard for ATS). Clean formatting that parses reliably across all applicant tracking systems.",
    verdict: "tie",
  },
  {
    feature: "Pricing model",
    enhancv:
      "Free tier with limited features. Pro plan starts at $19.99/month (billed annually) or $24.99/month billed monthly for full template access and features.",
    wadecv:
      "Pay-per-use credits — no subscription. Starter: 20 credits for $10 ($0.50/resume). 1 free credit on signup to try before buying.",
    verdict: "wadecv",
  },
];

const FAQ = [
  {
    question: "Is WadeCV better than Enhancv?",
    answer:
      "They solve different problems. Enhancv is a visual resume builder — it excels at creating beautifully designed resumes with custom templates, colours, and layouts. WadeCV is a resume tailoring tool — it rewrites your resume content to match each specific job description. If you need a stunning design, Enhancv is strong. If you need each application to be keyword-optimised and ATS-ready for the specific role, WadeCV is more effective.",
  },
  {
    question: "Does Enhancv tailor resumes to each job?",
    answer:
      "Enhancv offers a content analyser that scores your resume against a job description and suggests improvements, but it does not automatically rewrite your content. You still make the edits manually. WadeCV fully automates the tailoring process — paste a job URL and it rewrites your summary, experience bullets, and skills to match.",
  },
  {
    question: "Are Enhancv templates ATS-friendly?",
    answer:
      "Many Enhancv templates are ATS-compatible, but their most visually distinctive templates (with columns, icons, graphics, or infographics) can cause parsing issues with older ATS systems. If you are applying through ATS portals, stick to their simpler layouts. WadeCV uses ATS-safe formatting by default on every resume.",
  },
  {
    question: "Can I use Enhancv and WadeCV together?",
    answer:
      "Yes. You could use WadeCV to generate job-specific content (tailored bullets, keywords, and skills for each role), then paste that content into an Enhancv template for visual polish. This gives you both tailored content and professional design — though it adds an extra step to your workflow.",
  },
  {
    question: "Which tool is better for creative roles?",
    answer:
      "For creative roles where visual presentation matters (design, marketing, UX), Enhancv's template variety is an advantage. For roles where ATS parsing and keyword matching matter more (corporate, enterprise, government), WadeCV's automated tailoring is more impactful. Many creative roles still use ATS, so content quality matters regardless of design.",
  },
];

export default function EnhancvComparisonPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "WadeCV vs Enhancv: AI Resume Tailoring vs Visual Resume Builder (2026)",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/wadecv-vs-enhancv`,
            },
            datePublished: "2026-04-16",
            dateModified: "2026-04-16",
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
        WadeCV vs Enhancv: AI Resume Tailoring vs Visual Resume Builder (2026)
      </h1>

      <p className="text-muted-foreground mb-6">
        Enhancv is a popular visual resume builder known for its modern templates
        and design customisation. WadeCV takes a different approach: instead of
        helping you design a resume, it rewrites your content for each specific
        job description so every application is ATS-optimised and targeted.
        Here&apos;s how the two tools compare across features, design, and
        results.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Feature comparison: WadeCV vs Enhancv
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
                  {row.verdict === "enhancv" && (
                    <Badge variant="secondary" className="text-xs">
                      Enhancv wins
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
                  <p className="font-medium text-foreground mb-1">Enhancv</p>
                  <p>{row.enhancv}</p>
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

      <InlineCta variant="job" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          When Enhancv is the better choice
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You want a visually striking resume with custom colours, fonts,
            icons, and unique section layouts.
          </li>
          <li>
            You are applying for creative or design-focused roles where
            presentation is part of the evaluation.
          </li>
          <li>
            You want to build one polished resume and use it across multiple
            applications with minor tweaks.
          </li>
          <li>
            You prefer to manually control every aspect of your resume design
            and layout.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          When WadeCV is the better choice
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You want each application to have a resume rewritten to match the
            specific job description and keywords.
          </li>
          <li>
            You are applying through ATS portals where keyword matching and
            parsing accuracy determine whether your resume gets seen.
          </li>
          <li>
            You want automated gap analysis that identifies missing skills and
            closes them during tailoring.
          </li>
          <li>
            You want a tailored cover letter generated alongside each resume at
            no extra cost.
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
            Enhancv and WadeCV solve different parts of the resume problem.
            Enhancv helps you design a beautiful resume — it&apos;s a layout and
            template tool with AI suggestions on top. WadeCV helps you write a
            targeted resume — it&apos;s a content tailoring engine that rewrites
            your experience for each role.
          </p>
          <p>
            If your resume&apos;s biggest weakness is design, Enhancv is the
            right tool. If your resume&apos;s biggest weakness is generic
            content that doesn&apos;t match specific job descriptions, WadeCV
            solves that directly.
          </p>
          <p>
            For most job seekers applying through ATS portals, content relevance
            matters more than visual design. A well-tailored resume with the
            right keywords in a clean format outperforms a beautifully designed
            resume with generic content. The best approach may be to use WadeCV
            for content tailoring and then format the result in a clean template.
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
        currentCategory="/wadecv-vs-enhancv"
        contextLinks={[
          { href: "/best-ai-resume-builder-2026", label: "Best AI Resume Builders 2026" },
          { href: "/wadecv-vs-flowcv", label: "WadeCV vs FlowCV" },
          { href: "/wadecv-vs-rezi", label: "WadeCV vs Rezi" },
          { href: "/wadecv-vs-zety", label: "WadeCV vs Zety" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Try WadeCV free — content that converts</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your CV, paste a job URL, and get a fully tailored resume
            plus cover letter in seconds. 1 free credit included on signup.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta
            variant="job"
            label="Tailor your resume now"
            slug="enhancv-comparison"
          />
        </CardContent>
      </Card>
    </article>
  );
}
