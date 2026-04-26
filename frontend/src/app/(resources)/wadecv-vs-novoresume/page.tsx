import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoCta } from "@/components/seo/seo-cta";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";
import { InlineCta } from "@/components/seo/inline-cta";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://wadecv.com");

export const metadata = {
  title: "WadeCV vs Novoresume: Job-Tailored AI vs Minimalist Builder (2026) | WadeCV",
  description:
    "WadeCV vs Novoresume compared: AI job tailoring, fit analysis, cover letters, templates, Premium pricing ($16-30/mo) and ATS output. See which tool fits your 2026 job search — and when each one is worth the money.",
  openGraph: {
    title: "WadeCV vs Novoresume: Job-Tailored AI vs Minimalist Builder (2026)",
    description:
      "WadeCV vs Novoresume compared: AI tailoring, templates, pricing, ATS output, and cover letters side-by-side.",
  },
  twitter: {
    card: "summary" as const,
    title: "WadeCV vs Novoresume: Job-Tailored AI vs Minimalist Builder (2026)",
    description:
      "WadeCV vs Novoresume: job-tailored AI, minimalist templates, Premium pricing, and ATS output compared.",
  },
};

const ROWS: {
  feature: string;
  novoresume: string;
  wadecv: string;
  verdict: "wadecv" | "novoresume" | "tie";
}[] = [
  {
    feature: "Core approach",
    novoresume:
      "Minimalist template-based resume builder. You pick from a small set of clean templates and fill content via a structured wizard. Strong on visual restraint and 'less is more' design philosophy.",
    wadecv:
      "Job-specific tailoring engine. Upload your existing CV, paste a job URL, and WadeCV rewrites the full resume — summary, every bullet, and skills — against that specific posting in one pass.",
    verdict: "wadecv",
  },
  {
    feature: "Job description input",
    novoresume:
      "No job URL input. The builder produces one polished resume that you reuse across applications. AI-style content suggestions are limited compared to GPT-powered competitors.",
    wadecv:
      "Paste any LinkedIn, Indeed, Greenhouse, Lever, Workday, or Ashby URL — the job is scraped automatically and every bullet, keyword, and seniority cue is calibrated against it.",
    verdict: "wadecv",
  },
  {
    feature: "Templates & design",
    novoresume:
      "Smaller library of ~10 templates with strong minimalist design — single-column, double-column, modern, and creative variants. Quality over quantity. The design philosophy reads as European-clean and works well for design-conscious applicants.",
    wadecv:
      "Works from your existing CV structure; does not provide a template library. Output is a clean ATS-safe DOCX — design lives in the document you bring, not in a cosmetic theme.",
    verdict: "novoresume",
  },
  {
    feature: "ATS compatibility",
    novoresume:
      "The single-column 'Modern' and 'Simple' templates parse cleanly. The double-column templates and creative layouts can confuse Workday, Taleo, and iCIMS — same trade-off as every template builder.",
    wadecv:
      "Single-column, ATS-tested DOCX only. No icons, no columns, no graphics — exactly the format Workday, Greenhouse, Lever, and SAP SuccessFactors parse cleanly. Keyword density calibrated to the posted job.",
    verdict: "wadecv",
  },
  {
    feature: "AI writing quality",
    novoresume:
      "Novoresume's content suggestions are template-driven (pre-written examples by job title) rather than GPT-powered AI generation. Cleaner than blank-page writing but generic relative to the actual job you're targeting.",
    wadecv:
      "Every bullet is rewritten against the job URL you paste — quantification style, vocabulary, and keyword weighting all shift to match that posting. Reads like it was written for the role because it was.",
    verdict: "wadecv",
  },
  {
    feature: "Fit / gap analysis",
    novoresume:
      "Not a fit-analysis tool. Novoresume builds and styles resumes — it does not score your CV against a job description or flag missing hard skills and knockout requirements.",
    wadecv:
      "Structured gap analysis before tailoring — reports missing hard skills, must-haves you don't mention, and knockout requirements (years, certifications, clearance) specific to the posting.",
    verdict: "wadecv",
  },
  {
    feature: "Cover letter generation",
    novoresume:
      "Cover letter builder with matching template designs. You write the content; pairing to a specific job posting is manual.",
    wadecv:
      "Matched cover letter generated alongside every tailored resume, against the same scraped job description. Free with every tailoring — not a separate product or tier.",
    verdict: "wadecv",
  },
  {
    feature: "Pricing model",
    novoresume:
      "Freemium with a hard download paywall. Free plan gets one basic template and limited section variety. Premium ($16-30/month or ~$96/year prepaid) unlocks all templates, downloads, and content suggestions. The paywall is reached almost immediately because the free tier is intentionally narrow.",
    wadecv:
      "Pay-per-use credits — $10 for 20 tailored resumes ($0.50/resume), no subscription, no download paywall. First credit is free on signup; tailoring is free after a fit analysis.",
    verdict: "wadecv",
  },
  {
    feature: "Free-tier scope",
    novoresume:
      "The free tier is the most restrictive in the category. One template, basic sections, and a watermark on every download — designed primarily as a trial to convert to Premium. Many users hit the wall within 5 minutes of starting.",
    wadecv:
      "1 free fit-analysis credit on signup, no card required. Tailored resume + matched cover letter generation is unlocked for free after the fit analysis. You can fully evaluate the output before paying anything.",
    verdict: "wadecv",
  },
  {
    feature: "Value for high-volume applicants",
    novoresume:
      "You pay the subscription once, then reuse one polished resume across many applications. Cheap per application if you don't tailor — but that's exactly the workflow recruiters increasingly screen against.",
    wadecv:
      "$0.50 per tailored resume. Twenty applications costs $10 and each resume is calibrated to its specific posting — dramatically higher recruiter response rate than a reused generic resume.",
    verdict: "wadecv",
  },
  {
    feature: "Career-changer & senior use cases",
    novoresume:
      "Templates and content suggestions are optimised around conventional career narratives. Career-changers fight the wizard's assumptions about industry-to-industry transferability; senior ICs get generic exec phrasing.",
    wadecv:
      "Dedicated prompting paths for career-change (see /career-change), senior IC, exec, consulting and banking tracks. Job URL sets the seniority bar, so a VP-level posting gets VP-level rewriting automatically.",
    verdict: "wadecv",
  },
  {
    feature: "International / EU CV support",
    novoresume:
      "Novoresume's design philosophy and EU origin (Danish-built) means templates work well for European CV conventions out of the box. UK-specific (no photo, 2-page standard, British English) still requires manual tweaking.",
    wadecv:
      "Detects UK and EU job postings and produces the right CV conventions automatically — British English, 2-page standard, no photo, EU CV format where applicable. See /free-cv-builder-uk for the UK-specific workflow.",
    verdict: "tie",
  },
  {
    feature: "Time per application",
    novoresume:
      "~25-40 minutes for the first resume via the wizard. Subsequent applications reuse that resume; tailoring per posting is a manual copy-paste-edit pass against each job description.",
    wadecv:
      "~60 seconds per application after initial CV upload. Paste URL → fit analysis → tailored resume + cover letter. Built for volume without sacrificing per-job specificity.",
    verdict: "wadecv",
  },
];

const FAQ = [
  {
    question: "Is Novoresume free? What's the catch?",
    answer:
      "Building a basic resume in Novoresume is free, but the free tier is the most restrictive in the category — one template, limited sections, and a watermark on every download. Removing the watermark, accessing all templates, and unlocking content suggestions requires Premium ($16-30/month or roughly $96/year prepaid). Many users hit the paywall within 5 minutes. WadeCV is pay-per-use ($10 = 20 tailored resumes) with one free credit on signup, so you can evaluate the output end-to-end before paying.",
  },
  {
    question: "Are Novoresume templates ATS-friendly?",
    answer:
      "The single-column 'Modern' and 'Simple' templates parse cleanly through Workday, Greenhouse, Lever, and most modern ATS platforms. The double-column and creative templates can confuse older parsers like Taleo and iCIMS — the same trade-off every template builder makes between visual design and parser compatibility. If you use Novoresume, pick the simplest single-column template you can tolerate. WadeCV skips the problem entirely: output is a clean single-column DOCX tested against Workday, Greenhouse, Lever, Ashby, and SAP SuccessFactors.",
  },
  {
    question: "Is WadeCV better than Novoresume for tailoring a resume to a specific job?",
    answer:
      "Yes, when tailoring is the goal. Novoresume is a polished minimalist template builder — it produces one visually clean master resume that you reuse across applications. WadeCV solves a different problem: it takes your existing CV plus a job URL and rewrites the entire resume against that specific posting in a single pass, including keyword density, summary phrasing, ATS-safe formatting, and seniority calibration. If you want one beautiful master resume, Novoresume wins on minimalist design. If you want a tailored resume for every job, WadeCV wins decisively.",
  },
  {
    question: "Does Novoresume have AI resume tailoring?",
    answer:
      "Novoresume's content suggestions are template-driven — pre-written examples by job title and section — rather than GPT-powered AI generation. The suggestions are cleaner than starting from a blank page, but they don't read a specific job posting or calibrate the whole resume against the actual employer's screening criteria. WadeCV's tailoring is job-URL-specific: it scrapes the URL, identifies hard requirements and nice-to-haves, and rewrites every section to match that posting.",
  },
  {
    question: "Should I use Novoresume if I'm applying to 20+ jobs a week?",
    answer:
      "It's not the efficient tool for that volume. Novoresume is optimised for building one clean polished resume; tailoring it to 20 different jobs per week means 20 rounds of manual copy-paste-editing against each job description. WadeCV is built for this exact workflow — one upload, then ~60 seconds per application for a fully tailored resume plus matched cover letter. Campus recruiting cycles, career pivots, and post-layoff searches are the use cases where the volume difference compounds fastest.",
  },
  {
    question: "Which is better for career changers — Novoresume or WadeCV?",
    answer:
      "WadeCV. Career-changers need the AI to re-frame transferable experience into the vocabulary of the target industry — healthcare-to-tech, teacher-to-L&D, military-to-corporate, etc. Novoresume's wizard assumes you know how to describe your experience; the content library suggests bullets within the role you've already entered, not for the role you're targeting. WadeCV has dedicated prompting paths for career-change tracks and uses the job URL to set the target vocabulary for the whole rewrite.",
  },
  {
    question: "Can I use Novoresume and WadeCV together?",
    answer:
      "Yes, this is a sensible workflow. Use Novoresume to build your polished minimalist master CV with the visual template you prefer and download it once (paying the trial month if needed). Then upload that master to WadeCV as your base document. From there every application gets a tailored rewrite — keeping the original Novoresume design as a fallback for roles where a styled PDF is explicitly requested. You get the design of Novoresume with the per-job specificity of WadeCV.",
  },
  {
    question: "How does Novoresume compare to Resume.io, Zety, and Kickresume?",
    answer:
      "They're all template-first builders in the same category — each optimises for polished design, freemium entry with a download paywall, and content suggestions that are generic by job title rather than calibrated to a specific posting. Resume.io has the largest template library and most mature UX; Zety has the most aggressive AI bullet suggestions; Kickresume sits between them with strong design + GPT-powered AI Writer; Novoresume is the most minimalist with the most restrictive free tier. None of them do URL-based job tailoring, which is the category WadeCV occupies. See our full Best AI Resume Builders 2026 guide for the head-to-head.",
  },
];

export default function NovoresumeComparisonPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "WadeCV vs Novoresume: Job-Tailored AI vs Minimalist Builder (2026)",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/wadecv-vs-novoresume`,
            },
            datePublished: "2026-04-26",
            dateModified: "2026-04-26",
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
        WadeCV vs Novoresume: Job-Tailored AI vs Minimalist Builder (2026)
      </h1>

      <p className="text-muted-foreground mb-6">
        Novoresume is a Danish-built template-based resume builder known for its minimalist design
        philosophy — fewer templates than Resume.io or Kickresume, but each one polished and clean.
        It excels at producing one visually restrained resume you reuse across applications. WadeCV
        takes a fundamentally different approach: you upload your existing CV, paste a job URL, and
        the whole resume — summary, every bullet, and the skills section — gets rewritten against
        that specific posting in a single pass. Here&apos;s how the two tools compare feature by
        feature, and when each one is actually the right choice in 2026.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Feature comparison: WadeCV vs Novoresume</h2>
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
                  {row.verdict === "novoresume" && (
                    <Badge variant="secondary" className="text-xs">
                      Novoresume wins
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
                  <p className="font-medium text-foreground mb-1">Novoresume</p>
                  <p>{row.novoresume}</p>
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

      <InlineCta variant="job" slug="novoresume-comparison" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">When Novoresume is the better choice</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You don&apos;t have an existing CV and want a wizard with strong minimalist design from
            day one.
          </li>
          <li>
            You prefer fewer template choices and a stricter design aesthetic over a large template
            library.
          </li>
          <li>
            You plan to build one resume and reuse it across applications rather than tailor per
            job.
          </li>
          <li>
            You&apos;re comfortable with the Premium subscription and the immediate paywall on the
            free tier.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">When WadeCV is the better choice</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You&apos;re applying to 10+ jobs a week and need a tailored resume per application
            without spending 30 minutes per posting.
          </li>
          <li>
            You want the AI to read the actual job URL (LinkedIn, Indeed, Greenhouse, Lever,
            Workday, Ashby) and calibrate the entire resume against it — not a template-driven
            rewrite.
          </li>
          <li>You already have a CV and want to tailor it rather than rebuild from scratch.</li>
          <li>
            You want ATS-safe output tested against Workday, Greenhouse, Lever, Ashby, and SAP
            SuccessFactors — no double-column or icon-rendering surprises.
          </li>
          <li>
            You want pay-per-use pricing ($0.50 per tailored resume) instead of a Premium
            subscription with a hard free-tier paywall.
          </li>
          <li>
            You&apos;re a UK, Canadian, or Australian applicant and want regional CV conventions
            handled automatically.
          </li>
          <li>
            You want a matched cover letter generated alongside the resume, against the same job
            description.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">The verdict</h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            Novoresume is one of the cleanest minimalist template builders in the freemium tier —
            polished design, restrained aesthetic, and an opinionated &lsquo;less is more&rsquo;
            philosophy. If you need a visually disciplined master CV and don&apos;t mind the Premium
            subscription, it&apos;s a credible choice in its category, particularly for European
            applicants.
          </p>
          <p>
            WadeCV solves a different problem. It&apos;s not a template builder, and it isn&apos;t
            designed for people starting from a blank page. It&apos;s a job-application workflow:
            upload your CV once, paste a job URL, and get a fully tailored resume plus a matched
            cover letter in under 60 seconds. The same master CV gets rewritten differently for a
            Stripe backend engineer posting than for a Meta product manager posting than for a
            Goldman Sachs analyst posting — because the job descriptions themselves are different.
          </p>
          <p>
            The two tools can work together. A common pattern: build your polished master CV in
            Novoresume, download it once (paying the trial month), then upload that master to
            WadeCV. From there every application gets a tailored rewrite — keeping the original
            Novoresume design as a fallback for roles where a styled PDF is explicitly requested.
            You get the design of Novoresume with the per-job specificity of WadeCV.
          </p>
          <p>
            If you have to pick one and you&apos;re actively job searching, the question is: are you
            building one resume, or shipping many? Novoresume wins the first. WadeCV wins the second
            — and most real job searches are the second.
          </p>
          <p>
            Either way, if you&apos;re evaluating this category, it&apos;s worth reading our broader{" "}
            <a href="/best-ai-resume-builder-2026" className="text-primary underline">
              Best AI Resume Builders 2026
            </a>{" "}
            guide, which benchmarks WadeCV against Resume.io, Zety, Kickresume, Novoresume, Teal,
            Jobscan, FlowCV, Enhancv, ChatGPT, and Claude on the same dimensions.
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
        currentCategory="/wadecv-vs-novoresume"
        contextLinks={[
          { href: "/best-ai-resume-builder-2026", label: "Best AI Resume Builders 2026" },
          { href: "/wadecv-vs-resume-io", label: "WadeCV vs Resume.io" },
          { href: "/wadecv-vs-kickresume", label: "WadeCV vs Kickresume" },
          { href: "/wadecv-vs-zety", label: "WadeCV vs Zety" },
          { href: "/wadecv-vs-enhancv", label: "WadeCV vs Enhancv" },
          { href: "/wadecv-vs-jobscan", label: "WadeCV vs Jobscan" },
          { href: "/ats-resume-checker", label: "Free ATS Resume Checker" },
          { href: "/free-cv-builder-uk", label: "Free CV Builder for UK Jobs" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Try WadeCV free — one tailored resume, no subscription</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your CV, paste a job URL, and get a fully tailored resume plus matched cover
            letter in under 60 seconds. 1 free credit on signup — no card required to try.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta variant="job" label="Tailor your resume now" slug="novoresume-comparison" />
        </CardContent>
      </Card>
    </article>
  );
}
