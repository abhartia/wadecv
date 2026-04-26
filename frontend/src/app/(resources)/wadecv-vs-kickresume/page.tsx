import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoCta } from "@/components/seo/seo-cta";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";
import { InlineCta } from "@/components/seo/inline-cta";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://wadecv.com");

export const metadata = {
  title: "WadeCV vs Kickresume: Job-Tailored AI vs Template Builder (2026) | WadeCV",
  description:
    "WadeCV vs Kickresume compared: AI job tailoring, fit analysis, cover letters, templates, AI Writer pricing ($7-19/mo), download paywall and ATS output. See which tool fits your 2026 job search — and when each one is worth the money.",
  openGraph: {
    title: "WadeCV vs Kickresume: Job-Tailored AI vs Template Builder (2026)",
    description:
      "WadeCV vs Kickresume compared: AI tailoring, templates, pricing, ATS output, and cover letters side-by-side.",
  },
  twitter: {
    card: "summary" as const,
    title: "WadeCV vs Kickresume: Job-Tailored AI vs Template Builder (2026)",
    description:
      "WadeCV vs Kickresume: job-tailored AI, templates, AI Writer pricing, and ATS output compared.",
  },
};

const ROWS: {
  feature: string;
  kickresume: string;
  wadecv: string;
  verdict: "wadecv" | "kickresume" | "tie";
}[] = [
  {
    feature: "Core approach",
    kickresume:
      "Template-led resume and cover letter builder with an AI Writer add-on. You pick a template, fill sections through a wizard, and the GPT-powered AI Writer suggests bullet phrasing as you go.",
    wadecv:
      "Job-specific tailoring engine. Upload your existing CV, paste a job URL, and WadeCV rewrites the full resume — summary, every bullet, and skills — against that specific posting in one pass.",
    verdict: "wadecv",
  },
  {
    feature: "Job description input",
    kickresume:
      "No job URL input. The AI Writer suggests bullets based on your job title and industry, not against a specific employer's posting. You reuse one master resume across applications.",
    wadecv:
      "Paste any LinkedIn, Indeed, Greenhouse, Lever, Workday, or Ashby URL — the job is scraped automatically and every bullet, keyword, and seniority cue is calibrated against it.",
    verdict: "wadecv",
  },
  {
    feature: "Templates & design",
    kickresume:
      "35+ professionally designed templates with strong visual variety, colour variants, and creative layouts (multi-column, sidebar, photo-friendly). One of the best template libraries in the freemium tier.",
    wadecv:
      "Works from your existing CV structure; does not provide a template library. Output is a clean ATS-safe DOCX — design lives in the document you bring, not in a cosmetic theme.",
    verdict: "kickresume",
  },
  {
    feature: "ATS compatibility",
    kickresume:
      "Templates are marketed as ATS-friendly, but multi-column and icon-heavy designs (which dominate the most-popular set) confuse Workday, Taleo, and iCIMS parsers. Single-column 'Vienna' or 'Brussels' templates pass cleanly; visual ones are riskier.",
    wadecv:
      "Single-column, ATS-tested DOCX only. No icons, no columns, no graphics — exactly the format Workday, Greenhouse, Lever, and SAP SuccessFactors parse cleanly. Keyword density calibrated to the posted job.",
    verdict: "wadecv",
  },
  {
    feature: "AI writing quality",
    kickresume:
      "GPT-4-class AI Writer suggests bullet phrasing by job title and industry. Output is polished but generic — it doesn't read your target role's posting or the specific employer's screening criteria.",
    wadecv:
      "Every bullet is rewritten against the job URL you paste — quantification style, vocabulary, and keyword weighting all shift to match that posting. Reads like it was written for the role because it was.",
    verdict: "wadecv",
  },
  {
    feature: "Fit / gap analysis",
    kickresume:
      "Not a fit-analysis tool. Kickresume builds and styles resumes — it does not score your CV against a job description or flag missing hard skills and knockout requirements.",
    wadecv:
      "Structured gap analysis before tailoring — reports missing hard skills, must-haves you don't mention, and knockout requirements (years, certifications, clearance) specific to the posting.",
    verdict: "wadecv",
  },
  {
    feature: "Cover letter generation",
    kickresume:
      "Separate cover letter builder with matching template designs and AI Writer support. Pairing to a specific job posting is manual — the AI suggests opener phrasing but doesn't read the URL.",
    wadecv:
      "Matched cover letter generated alongside every tailored resume, against the same scraped job description. Free with every tailoring — not a separate product or tier.",
    verdict: "wadecv",
  },
  {
    feature: "Pricing model",
    kickresume:
      "Freemium with download paywall. Building is free; downloading PDF/DOCX, accessing premium templates, removing the Kickresume logo, and using the AI Writer beyond a small free quota requires a subscription — typically $7-19/month, or roughly $60-140/year prepaid.",
    wadecv:
      "Pay-per-use credits — $10 for 20 tailored resumes ($0.50/resume), no subscription, no download paywall. First credit is free on signup; tailoring is free after a fit analysis.",
    verdict: "wadecv",
  },
  {
    feature: "Free-tier scope",
    kickresume:
      "The free plan is genuinely usable for building a resume, but the AI Writer free quota is small (a few suggestions per month) and download / no-watermark requires upgrading. Many users hit the paywall before they get a usable export.",
    wadecv:
      "1 free fit-analysis credit on signup, no card required. Tailored resume + matched cover letter generation is unlocked for free after the fit analysis. You can fully evaluate the output before paying anything.",
    verdict: "wadecv",
  },
  {
    feature: "Value for high-volume applicants",
    kickresume:
      "You pay the subscription once, then reuse one polished resume across many applications. Cheap per application if you don't tailor — but that's exactly the workflow recruiters increasingly screen against.",
    wadecv:
      "$0.50 per tailored resume. Twenty applications costs $10 and each resume is calibrated to its specific posting — dramatically higher recruiter response rate than a reused generic resume.",
    verdict: "wadecv",
  },
  {
    feature: "Career-changer & senior use cases",
    kickresume:
      "Templates and AI suggestions are optimised around conventional career narratives. Career-changers fight the wizard's assumptions about industry-to-industry transferability; senior ICs get generic exec phrasing.",
    wadecv:
      "Dedicated prompting paths for career-change (see /career-change), senior IC, exec, consulting and banking tracks. Job URL sets the seniority bar, so a VP-level posting gets VP-level rewriting automatically.",
    verdict: "wadecv",
  },
  {
    feature: "International / UK CV support",
    kickresume:
      "Templates lean US-resume-oriented, though the EU origin (Slovak founders) means several templates work for European CV conventions. UK-specific (no photo, 2-page standard, British English) requires manual tweaking.",
    wadecv:
      "Detects UK job postings and produces UK CV conventions automatically — British English, 2-page standard, no photo, UK education format. See /free-cv-builder-uk for the UK-specific workflow.",
    verdict: "wadecv",
  },
  {
    feature: "Time per application",
    kickresume:
      "~25-45 minutes for the first resume via the wizard. Subsequent applications reuse that resume; tailoring per posting is a manual copy-paste-edit pass against each job description.",
    wadecv:
      "~60 seconds per application after initial CV upload. Paste URL → fit analysis → tailored resume + cover letter. Built for volume without sacrificing per-job specificity.",
    verdict: "wadecv",
  },
];

const FAQ = [
  {
    question: "Is Kickresume free? What's the catch?",
    answer:
      "Building a resume in Kickresume is free, but downloading without a watermark, using premium templates, and unlocking the AI Writer beyond a small monthly quota all require a paid plan — typically $7-19/month depending on tier and billing cadence ($60-140/year prepaid). Many users get to the export step and only then realise the download is paywalled. WadeCV is pay-per-use ($10 = 20 tailored resumes) with one free credit on signup, so you can evaluate the output end-to-end before paying.",
  },
  {
    question: "Are Kickresume reviews accurate? Is it actually good?",
    answer:
      "Kickresume's reviews trend positive on template design and the wizard UX — it has one of the strongest visual libraries in the freemium tier and a more polished editing experience than many competitors. The negative reviews cluster around the surprise download paywall, the small free AI quota, and the fact that the AI Writer suggestions are generic by job title rather than calibrated against a specific job posting. If you want one beautiful master resume to reuse, the positive reviews are accurate. If you want a different ATS-tailored resume per job, those reviews understate WadeCV's category gap.",
  },
  {
    question: "Is WadeCV better than Kickresume for tailoring a resume to a specific job?",
    answer:
      "Yes, when tailoring is the goal. Kickresume is a polished template-based builder — it produces one visually strong master resume that you reuse across applications. WadeCV solves a different problem: it takes your existing CV plus a job URL and rewrites the entire resume against that specific posting in a single pass, including keyword density, summary phrasing, ATS-safe formatting, and seniority calibration. If you want one beautiful master resume, Kickresume wins on templates. If you want a tailored resume for every job, WadeCV wins decisively.",
  },
  {
    question: "Do Kickresume templates pass ATS screening?",
    answer:
      "The minimal single-column templates (Vienna, Brussels, the entry-level free templates) usually pass. The multi-column, sidebar, and icon-heavy templates — which are the visually strongest and therefore the most popular — can confuse older ATS parsers like Workday, Taleo, and iCIMS, sometimes causing jumbled text extraction or dropped sections. If you use Kickresume, pick the simplest template you can tolerate. WadeCV skips the problem entirely: output is a clean single-column DOCX tested against Workday, Greenhouse, Lever, Ashby, and SAP SuccessFactors.",
  },
  {
    question: "Does Kickresume's AI Writer read job postings?",
    answer:
      "No. Kickresume's AI Writer (powered by GPT-4-class models) generates bullet suggestions based on your job title, industry, and the section you're filling — not against a specific employer's posting. The suggestions are a step above blank-page writing but remain generic relative to the actual screening criteria of the role you're targeting. WadeCV's tailoring is job-URL-specific: it scrapes the URL, identifies hard requirements and nice-to-haves, and rewrites every section to match that posting.",
  },
  {
    question: "Should I use Kickresume if I'm applying to 20+ jobs a week?",
    answer:
      "It's not the efficient tool for that volume. Kickresume is optimised for building one polished resume; tailoring it to 20 different jobs per week means 20 rounds of manual copy-paste-editing against each job description. WadeCV is built for this exact workflow — one upload, then ~60 seconds per application for a fully tailored resume plus matched cover letter. Campus recruiting cycles, career pivots, and post-layoff searches are the use cases where the volume difference compounds fastest.",
  },
  {
    question: "Which is better for career changers — Kickresume or WadeCV?",
    answer:
      "WadeCV. Career-changers need the AI to re-frame transferable experience into the vocabulary of the target industry — healthcare-to-tech, teacher-to-L&D, military-to-corporate, etc. Kickresume's wizard assumes you know how to describe your experience; the AI Writer suggests bullets within the role you've already entered, not for the role you're targeting. WadeCV has dedicated prompting paths for career-change tracks and uses the job URL to set the target vocabulary for the whole rewrite.",
  },
  {
    question: "Can I use Kickresume and WadeCV together?",
    answer:
      "Yes, this is a sensible workflow. Use Kickresume to build your polished master CV with the visual template you want and download it once (paying the trial month). Then upload that master to WadeCV as your base document. From there every application gets a tailored rewrite in WadeCV — keeping the original Kickresume design as a fallback for roles where a styled PDF is explicitly requested. You get the design library of Kickresume with the per-job specificity of WadeCV.",
  },
  {
    question: "How does Kickresume compare to Resume.io, Zety, and Novoresume?",
    answer:
      "They're all template-first builders in the same category — each optimises for polished design, freemium entry with a download paywall, and AI suggestions that are generic by job title rather than calibrated to a specific posting. Resume.io has the largest template library and most mature UX; Zety has the most aggressive AI bullet suggestions; Novoresume is the most minimalist; Kickresume sits between them with strong design + GPT-powered AI Writer. None of them do URL-based job tailoring, which is the category WadeCV occupies. See our full Best AI Resume Builders 2026 guide for the head-to-head.",
  },
];

export default function KickresumeComparisonPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "WadeCV vs Kickresume: Job-Tailored AI vs Template Builder (2026)",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/wadecv-vs-kickresume`,
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
        WadeCV vs Kickresume: Job-Tailored AI vs Template Builder (2026)
      </h1>

      <p className="text-muted-foreground mb-6">
        Kickresume is one of the most-loved template-based resume builders in the freemium tier —
        35+ professional templates, a polished guided wizard, and a GPT-powered AI Writer that
        suggests bullet phrasing as you fill in sections. It excels at producing one visually strong
        resume you reuse across applications. WadeCV takes a fundamentally different approach: you
        upload your existing CV, paste a job URL, and the whole resume — summary, every bullet, and
        the skills section — gets rewritten against that specific posting in a single pass.
        Here&apos;s how the two tools compare feature by feature, and when each one is actually the
        right choice in 2026.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Feature comparison: WadeCV vs Kickresume</h2>
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
                  {row.verdict === "kickresume" && (
                    <Badge variant="secondary" className="text-xs">
                      Kickresume wins
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
                  <p className="font-medium text-foreground mb-1">Kickresume</p>
                  <p>{row.kickresume}</p>
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

      <InlineCta variant="job" slug="kickresume-comparison" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">When Kickresume is the better choice</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You don&apos;t have an existing CV and want a wizard to walk you through
            section-by-section with polished design from day one.
          </li>
          <li>
            You prioritise visual design and are applying to roles where a styled PDF matters more
            than ATS parsing (creative, hospitality, agency-side, small-business direct
            submissions).
          </li>
          <li>
            You plan to build one resume and reuse it across applications rather than tailor per
            job.
          </li>
          <li>
            You&apos;re comfortable with the subscription pricing and the download paywall once you
            reach the export step.
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
            Workday, Ashby) and calibrate the entire resume against it — not a generic rewrite by
            job title.
          </li>
          <li>You already have a CV and want to tailor it rather than rebuild from scratch.</li>
          <li>
            You want ATS-safe output tested against Workday, Greenhouse, Lever, Ashby, and SAP
            SuccessFactors — no multi-column or icon-rendering surprises.
          </li>
          <li>
            You want pay-per-use pricing ($0.50 per tailored resume) instead of a monthly
            subscription with a download paywall.
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
            Kickresume is one of the strongest template-based resume builders in the freemium tier —
            polished design, mature wizard UX, and a GPT-powered AI Writer that helps with bullet
            phrasing. If you need a visually striking master CV and don&apos;t mind the monthly
            subscription, it&apos;s a credible choice in its category.
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
            Kickresume, download it once (paying the trial month), then upload that master to
            WadeCV. From there every application gets a tailored rewrite — keeping the visual design
            as a fallback for roles where a styled PDF is explicitly requested. You get the design
            library of Kickresume with the per-job specificity of WadeCV.
          </p>
          <p>
            If you have to pick one and you&apos;re actively job searching, the question is: are you
            building one resume, or shipping many? Kickresume wins the first. WadeCV wins the second
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
        currentCategory="/wadecv-vs-kickresume"
        contextLinks={[
          { href: "/best-ai-resume-builder-2026", label: "Best AI Resume Builders 2026" },
          { href: "/wadecv-vs-resume-io", label: "WadeCV vs Resume.io" },
          { href: "/wadecv-vs-zety", label: "WadeCV vs Zety" },
          { href: "/wadecv-vs-enhancv", label: "WadeCV vs Enhancv" },
          { href: "/wadecv-vs-jobscan", label: "WadeCV vs Jobscan" },
          { href: "/wadecv-vs-teal", label: "WadeCV vs Teal" },
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
          <SeoCta variant="job" label="Tailor your resume now" slug="kickresume-comparison" />
        </CardContent>
      </Card>
    </article>
  );
}
