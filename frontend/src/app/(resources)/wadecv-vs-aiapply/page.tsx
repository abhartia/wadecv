import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoCta } from "@/components/seo/seo-cta";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";
import { InlineCta } from "@/components/seo/inline-cta";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://wadecv.com");

export const metadata = {
  title: "WadeCV vs AiApply: AI Resume Tailoring vs Auto-Apply Automation (2026) | WadeCV",
  description:
    "WadeCV vs AiApply compared: per-job AI resume tailoring vs mass auto-apply automation. Features, pricing, and which approach gets more interviews in 2026.",
  openGraph: {
    title: "WadeCV vs AiApply: AI Resume Tailoring vs Auto-Apply Automation (2026)",
    description:
      "WadeCV vs AiApply feature-by-feature comparison for targeted resume tailoring vs automated mass applications.",
  },
  twitter: {
    card: "summary" as const,
    title: "WadeCV vs AiApply: AI Resume Tailoring vs Auto-Apply Automation (2026)",
    description:
      "WadeCV vs AiApply: per-job AI resume tailoring vs auto-apply automation compared on features and pricing.",
  },
};

const ROWS: {
  feature: string;
  aiapply: string;
  wadecv: string;
  verdict: "wadecv" | "aiapply" | "tie";
}[] = [
  {
    feature: "Core approach",
    aiapply:
      "Auto-apply automation that fills out job applications and submits them on your behalf across multiple job boards simultaneously.",
    wadecv:
      "AI resume tailoring tool that imports your existing CV, analyzes a specific job description, and rewrites your resume to match each role.",
    verdict: "tie",
  },
  {
    feature: "Job-specific tailoring",
    aiapply:
      "Generates cover letters and adjusts application responses per job, but resume content stays largely the same across applications.",
    wadecv:
      "Rewrites your entire resume — summary, bullets, and skills — to match the specific job description. Each application gets a uniquely tailored resume.",
    verdict: "wadecv",
  },
  {
    feature: "Application volume",
    aiapply:
      "Designed for high volume. Can submit hundreds of applications per day across LinkedIn, Indeed, and other job boards automatically.",
    wadecv:
      "Designed for targeted quality. Each resume takes seconds to generate, but you submit each application yourself.",
    verdict: "aiapply",
  },
  {
    feature: "ATS optimization",
    aiapply:
      "Basic ATS compatibility. Auto-filled applications use standard formats, but resume content is not rewritten to match job-specific keywords.",
    wadecv:
      "Every resume is generated with ATS-safe formatting and keywords from the specific job description embedded naturally in your experience bullets.",
    verdict: "wadecv",
  },
  {
    feature: "Fit / gap analysis",
    aiapply:
      "Not available. AiApply focuses on submission speed rather than analyzing how well your profile matches each specific role.",
    wadecv:
      "Full gap analysis showing missing skills, keyword mismatches, and experience gaps — then closes them automatically during tailoring.",
    verdict: "wadecv",
  },
  {
    feature: "Cover letter",
    aiapply:
      "Auto-generates cover letters per application, but quality varies since they are produced at scale with less customization per role.",
    wadecv:
      "AI-generated cover letter tailored to each job description, included free with every resume tailoring. One application at a time means higher quality.",
    verdict: "wadecv",
  },
  {
    feature: "Job board integration",
    aiapply:
      "Direct integration with LinkedIn, Indeed, Glassdoor, and other major job boards. Submits applications without leaving the platform.",
    wadecv:
      "Scrapes job descriptions from LinkedIn, Indeed, Greenhouse, Lever, and other job boards via URL. You submit applications yourself on each platform.",
    verdict: "aiapply",
  },
  {
    feature: "Application tracking",
    aiapply: "Tracks all auto-submitted applications with status updates across job boards.",
    wadecv:
      "Built-in application tracker to manage jobs and keep track of tailored resumes for each application.",
    verdict: "tie",
  },
  {
    feature: "Quality vs quantity",
    aiapply:
      "Optimized for quantity — apply to as many jobs as possible with minimal effort per application.",
    wadecv:
      "Optimized for quality — each resume is uniquely tailored to maximize your chances of landing an interview for that specific role.",
    verdict: "wadecv",
  },
  {
    feature: "Recruiter perception",
    aiapply:
      "Mass-applied resumes can appear generic. Some recruiters and ATS systems flag auto-applied candidates, reducing response rates.",
    wadecv:
      "Each tailored resume appears hand-crafted for the role. Recruiters see relevant keywords and aligned experience, improving callback rates.",
    verdict: "wadecv",
  },
  {
    feature: "Pricing model",
    aiapply:
      "Subscription-based plans starting around $29/month for a set number of auto-applications per month.",
    wadecv:
      "Pay-per-use credits — no subscription. Starter: 20 credits for $10 ($0.50/resume). 1 free credit on signup.",
    verdict: "wadecv",
  },
];

const FAQ = [
  {
    question: "Is WadeCV better than AiApply?",
    answer:
      "They serve different strategies. AiApply is for high-volume job applications — it automates filling out and submitting applications across job boards. WadeCV is for targeted applications — it rewrites your resume for each specific job so your application stands out. If you want to apply to 100+ jobs quickly, AiApply helps with speed. If you want each application to be highly competitive, WadeCV produces better results per application.",
  },
  {
    question: "Does AiApply tailor resumes to each job?",
    answer:
      "AiApply focuses on auto-submitting applications rather than deeply tailoring resume content. It may adjust cover letters and application responses, but your core resume stays largely unchanged across applications. WadeCV rewrites your entire resume — summary, bullets, and skills — for each specific job description.",
  },
  {
    question: "Can auto-applying hurt my job search?",
    answer:
      "It can. Some recruiters flag candidates who appear to have mass-applied with generic resumes. ATS systems may also deprioritize applications that lack job-specific keywords. A targeted approach with tailored resumes typically yields higher callback rates per application, though it takes more time per submission.",
  },
  {
    question: "Can I use AiApply and WadeCV together?",
    answer:
      "Yes, strategically. You could use WadeCV to tailor resumes for your top-priority roles (where a strong, customized application matters most), and use AiApply for lower-priority roles where volume is more important than per-application quality. This hybrid approach balances quality and reach.",
  },
  {
    question: "Which approach gets more interviews?",
    answer:
      "Targeted, tailored applications consistently outperform mass-applied generic resumes in interview callback rates. However, the math depends on your strategy: 5 highly tailored applications may generate more interviews than 50 generic ones, but AiApply's volume approach works for roles where the competition is lower. For competitive positions at desirable companies, a tailored resume is significantly more effective.",
  },
];

export default function AiApplyComparisonPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "WadeCV vs AiApply: AI Resume Tailoring vs Auto-Apply Automation (2026)",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/wadecv-vs-aiapply`,
            },
            datePublished: "2026-04-15",
            dateModified: "2026-04-15",
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
        WadeCV vs AiApply: AI Resume Tailoring vs Auto-Apply Automation (2026)
      </h1>

      <p className="text-muted-foreground mb-6">
        AiApply is a fast-rising AI tool that automates job applications across multiple job boards
        — filling out forms and submitting on your behalf. WadeCV takes the opposite approach:
        instead of mass-applying, it rewrites your resume for each specific job so every application
        is targeted and competitive. Here&apos;s how the two tools compare across features,
        philosophy, and results.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Feature comparison: WadeCV vs AiApply</h2>
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
                  {row.verdict === "aiapply" && (
                    <Badge variant="secondary" className="text-xs">
                      AiApply wins
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
                  <p className="font-medium text-foreground mb-1">AiApply</p>
                  <p>{row.aiapply}</p>
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
        <h2 className="text-xl font-semibold mb-3">When AiApply is the better choice</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You want to maximise application volume and apply to as many roles as possible with
            minimal effort.
          </li>
          <li>
            You are targeting a broad range of similar roles where a generic resume is acceptable.
          </li>
          <li>Speed matters more than per-application quality — you want to cast a wide net.</li>
          <li>
            You want direct job board integration that submits applications without manual form
            filling.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">When WadeCV is the better choice</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You want each application to stand out with a resume tailored to the specific job
            description.
          </li>
          <li>
            You are targeting competitive roles where keyword matching and ATS optimization make the
            difference.
          </li>
          <li>
            You want a gap analysis before applying — understanding exactly how your profile fits
            each role.
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
            AiApply and WadeCV represent two fundamentally different job search strategies. AiApply
            bets on volume — apply to as many jobs as possible and let the numbers work in your
            favour. WadeCV bets on quality — make every application count by tailoring your resume
            to match the exact role.
          </p>
          <p>
            For most job seekers, the targeted approach yields better results. A resume customised
            to the job description gets through ATS filters more reliably and impresses recruiters
            who can immediately see your relevance. Mass-applied generic resumes often get lost in
            the volume.
          </p>
          <p>
            The smart strategy is to combine both: use WadeCV for your top-choice roles where
            standing out matters most, and consider AiApply for secondary applications where speed
            is the priority.
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
        currentCategory="/wadecv-vs-aiapply"
        contextLinks={[
          { href: "/best-ai-resume-builder-2026", label: "Best AI Resume Builders 2026" },
          { href: "/wadecv-vs-wobo", label: "WadeCV vs Wobo AI" },
          { href: "/wadecv-vs-jobcopilot", label: "WadeCV vs JobCopilot" },
          { href: "/wadecv-vs-teal", label: "WadeCV vs Teal" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Try WadeCV free — quality over quantity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your CV, paste a job URL, and get a fully tailored resume plus cover letter in
            seconds. 1 free credit included on signup.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta variant="job" label="Tailor your resume now" slug="aiapply-comparison" />
        </CardContent>
      </Card>
    </article>
  );
}
