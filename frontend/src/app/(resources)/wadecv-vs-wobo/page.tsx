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
  title: "WadeCV vs Wobo AI: Resume Tailoring Compared (2026) | WadeCV",
  description:
    "WadeCV vs Wobo AI compared: AI resume tailoring, job matching, cover letters, ATS optimization, and pricing. See which tool delivers better tailored resumes.",
  openGraph: {
    title: "WadeCV vs Wobo AI: Resume Tailoring Compared (2026)",
    description:
      "WadeCV vs Wobo AI feature-by-feature comparison for AI resume tailoring, pricing, and ATS optimization.",
  },
  twitter: {
    card: "summary" as const,
    title: "WadeCV vs Wobo AI: Resume Tailoring Compared (2026)",
    description:
      "WadeCV vs Wobo AI: AI resume tailoring, cover letters, pricing, and features compared.",
  },
};

const ROWS: {
  feature: string;
  wobo: string;
  wadecv: string;
  verdict: "wadecv" | "wobo" | "tie";
}[] = [
  {
    feature: "Core approach",
    wobo:
      "AI-powered resume builder that generates resumes from scratch or rewrites existing ones based on job descriptions.",
    wadecv:
      "Takes your existing CV and a job URL, runs a gap analysis, then rewrites the entire resume — bullets, summary, and skills — tailored to that specific role.",
    verdict: "tie",
  },
  {
    feature: "Job description input",
    wobo:
      "Paste job description text or enter keywords manually.",
    wadecv:
      "Paste a LinkedIn, Indeed, Greenhouse, or Lever URL and the job description is scraped automatically — no copy-pasting required.",
    verdict: "wadecv",
  },
  {
    feature: "Fit / gap analysis",
    wobo:
      "Basic keyword matching to show how well your resume aligns with the job.",
    wadecv:
      "Full gap analysis that identifies missing skills, experience gaps, and keyword mismatches — then closes those gaps automatically during tailoring.",
    verdict: "wadecv",
  },
  {
    feature: "Resume tailoring",
    wobo:
      "AI rewrites resume sections to match job descriptions with keyword optimization.",
    wadecv:
      "AI rewrites your entire resume section by section — summary, experience bullets, and skills — preserving your real experience while aligning language to the job.",
    verdict: "tie",
  },
  {
    feature: "Cover letter generation",
    wobo:
      "AI cover letter builder available as a separate feature.",
    wadecv:
      "Generates a tailored cover letter alongside every tailored resume, matched to the same job description — included free with every tailoring.",
    verdict: "wadecv",
  },
  {
    feature: "ATS optimization",
    wobo:
      "ATS-friendly formatting and keyword suggestions built into the resume builder.",
    wadecv:
      "Generates an ATS-safe DOCX with correct headings, bullet structure, and keyword placement — optimization happens during generation, not as an add-on.",
    verdict: "tie",
  },
  {
    feature: "Section-by-section editing",
    wobo:
      "Edit within the builder interface after generation.",
    wadecv:
      "Edit any section independently — summary, experience, skills — after the AI tailors the full resume. Regenerate individual sections without redoing the whole CV.",
    verdict: "wadecv",
  },
  {
    feature: "Resume templates",
    wobo:
      "Multiple professional templates and designs to choose from.",
    wadecv:
      "Works from your existing CV format — imports and tailors rather than building from a template.",
    verdict: "wobo",
  },
  {
    feature: "Application tracking",
    wobo:
      "Basic job application tracking features.",
    wadecv:
      "Built-in application tracker to manage jobs you have applied to and track your tailored resumes.",
    verdict: "tie",
  },
  {
    feature: "Physical mail delivery",
    wobo:
      "Not available.",
    wadecv:
      "Send a printed resume via USPS directly from the app — useful for high-priority applications where a physical copy makes an impression.",
    verdict: "wadecv",
  },
  {
    feature: "Pricing model",
    wobo:
      "Subscription-based pricing with monthly plans.",
    wadecv:
      "Pay-per-use credits — no subscription. Starter: 20 credits for $10 ($0.50/resume). No monthly commitment.",
    verdict: "wadecv",
  },
];

const FAQ = [
  {
    question: "Is WadeCV better than Wobo AI for resume tailoring?",
    answer:
      "Both tools use AI to tailor resumes. WadeCV focuses on importing your existing CV and rewriting it for specific jobs via URL scraping — you paste a job link and get a tailored resume back. Wobo AI leans more toward building resumes from templates. If you already have a solid CV and want to tailor it per-application, WadeCV is more streamlined. If you need to create a resume from scratch with design templates, Wobo AI may be a better starting point.",
  },
  {
    question: "Does Wobo AI scrape job URLs automatically?",
    answer:
      "Wobo AI typically requires you to paste job description text manually. WadeCV scrapes job descriptions directly from LinkedIn, Indeed, Greenhouse, Lever, and other job boards — saving time and ensuring the full description is captured.",
  },
  {
    question: "Which is cheaper — WadeCV or Wobo AI?",
    answer:
      "WadeCV uses pay-per-use credits with no monthly commitment — 20 tailored resumes for $10. Wobo AI uses subscription pricing. For most job seekers applying to 10-50 jobs, WadeCV's credit model is typically cheaper since you only pay for what you use.",
  },
  {
    question: "Can I use both Wobo AI and WadeCV?",
    answer:
      "Yes. You could use Wobo AI to design a polished base resume from a template, then import it into WadeCV to tailor that resume for each specific job application. This gives you professional formatting plus per-job customization.",
  },
  {
    question: "Which tool is better for ATS optimization?",
    answer:
      "Both tools produce ATS-compatible output. WadeCV bakes ATS optimization into the tailoring process — keyword placement, heading structure, and formatting are handled during generation. Wobo AI offers ATS-friendly templates and keyword suggestions. The end result is comparable; the difference is workflow.",
  },
];

export default function WoboComparisonPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "WadeCV vs Wobo AI: Resume Tailoring Compared (2026)",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/wadecv-vs-wobo`,
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
        WadeCV vs Wobo AI: Resume Tailoring Compared (2026)
      </h1>

      <p className="text-muted-foreground mb-6">
        Wobo AI is a fast-growing AI resume builder that helps job seekers
        create and optimize resumes using artificial intelligence. WadeCV takes
        a tailoring-first approach: instead of starting from a template, it
        imports your existing CV and rewrites it for each job you apply to.
        Here&apos;s how the two tools stack up across features, pricing, and
        workflow.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Feature comparison: WadeCV vs Wobo AI
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
                  {row.verdict === "wobo" && (
                    <Badge variant="secondary" className="text-xs">
                      Wobo wins
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
                  <p className="font-medium text-foreground mb-1">Wobo AI</p>
                  <p>{row.wobo}</p>
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
          When Wobo AI is the better choice
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You need to build a resume from scratch and want professional
            templates to start from.
          </li>
          <li>
            You prefer a visual resume builder with design customization
            options.
          </li>
          <li>
            You want an all-in-one platform that combines building and
            optimizing in one workflow.
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
            You want automatic job URL scraping instead of copying and pasting
            job descriptions manually.
          </li>
          <li>
            You need a gap analysis that shows exactly what your resume is
            missing for a specific role.
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
            Wobo AI is a strong choice if you need to create a resume from
            scratch with polished templates. It handles the design and
            formatting side well and is growing rapidly as an AI resume builder.
          </p>
          <p>
            WadeCV is built for a different workflow: you already have a
            resume, and you want to tailor it for every job application
            automatically. Paste a job URL, get a rewritten resume and cover
            letter, and download a clean DOCX. For job seekers applying to
            multiple roles, WadeCV&apos;s per-job tailoring and credit-based
            pricing make it faster and more cost-effective.
          </p>
          <p>
            The two tools complement each other — use Wobo AI to build your
            base resume, then use WadeCV to tailor it for each application.
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

      <CrossCategoryLinks currentCategory="/wadecv-vs-wobo" />

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
            slug="wobo-comparison"
          />
        </CardContent>
      </Card>
    </article>
  );
}
