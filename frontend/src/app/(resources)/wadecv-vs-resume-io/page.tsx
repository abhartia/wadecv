import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoCta } from "@/components/seo/seo-cta";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://wadecv.com");

export const metadata = {
  title: "WadeCV vs Resume.io: Job-Tailored AI vs Template Builder (2026) | WadeCV",
  description:
    "WadeCV vs Resume.io compared: AI job tailoring, fit analysis, cover letters, templates, pricing, and ATS output. See which tool fits your job search in 2026 — and when each one is worth the money.",
  openGraph: {
    title: "WadeCV vs Resume.io: Job-Tailored AI vs Template Builder (2026)",
    description:
      "WadeCV vs Resume.io compared: AI tailoring, templates, pricing, ATS output, and cover letters side-by-side.",
  },
  twitter: {
    card: "summary" as const,
    title: "WadeCV vs Resume.io: Job-Tailored AI vs Template Builder (2026)",
    description:
      "WadeCV vs Resume.io: job-tailored AI, templates, pricing, and ATS output compared.",
  },
};

const ROWS: {
  feature: string;
  resumeio: string;
  wadecv: string;
  verdict: "wadecv" | "resumeio" | "tie";
}[] = [
  {
    feature: "Core approach",
    resumeio:
      "Guided resume builder. You pick a template, fill in sections through a step-by-step wizard, and Resume.io assembles a polished resume from pre-written examples and AI-generated bullet suggestions.",
    wadecv:
      "Job-specific tailoring engine. You upload your existing CV and paste a job URL; WadeCV rewrites the full resume — summary, every bullet, and skills — against that specific posting in one pass.",
    verdict: "wadecv",
  },
  {
    feature: "Job description input",
    resumeio:
      "No job URL input. The builder produces one polished resume that you reuse across applications; AI suggestions are generic by job title, not calibrated against a specific posting.",
    wadecv:
      "Paste any LinkedIn, Indeed, Greenhouse, Lever, Workday, or Ashby URL — the job is scraped automatically and every bullet, keyword, and seniority cue is calibrated against it.",
    verdict: "wadecv",
  },
  {
    feature: "Templates & design",
    resumeio:
      "20+ professionally designed templates with strong typography, colour variants, and multi-column layouts. Real-time preview as you edit. One of the best visual experiences in the category.",
    wadecv:
      "Works from your existing CV structure; does not provide a template library. Output is a clean, ATS-safe DOCX — style lives in the document you bring, not in a cosmetic theme.",
    verdict: "resumeio",
  },
  {
    feature: "ATS compatibility",
    resumeio:
      "Templates are marketed as ATS-friendly, but the multi-column and icon-heavy designs can confuse older ATS parsers (Taleo, iCIMS). Single-column templates pass reliably; visual ones are riskier.",
    wadecv:
      "Single-column, ATS-tested DOCX only. No icons, no columns, no graphics — exactly the format Workday, Greenhouse, Lever, and SAP SuccessFactors parse cleanly. Keyword density calibrated to the posted job.",
    verdict: "wadecv",
  },
  {
    feature: "AI writing quality",
    resumeio:
      "Recent AI Writer add-on suggests bullet phrasing based on your job title and industry. Output is polished but generic — it doesn't know your target role or what the specific employer is screening for.",
    wadecv:
      "Every bullet is rewritten against the job you paste — quantification style, vocabulary, and keyword weighting all shift to match that posting. Reads like it was written for the role because it was.",
    verdict: "wadecv",
  },
  {
    feature: "Fit / gap analysis",
    resumeio:
      "Not a fit-analysis tool. Resume.io builds and styles resumes — it does not score your CV against a job description or flag missing hard skills and knockout requirements.",
    wadecv:
      "Structured gap analysis before tailoring — reports missing hard skills, must-haves you don't mention, and knockout requirements (years, certifications, clearance) specific to the posting.",
    verdict: "wadecv",
  },
  {
    feature: "Cover letter generation",
    resumeio:
      "Separate cover letter builder with matching template designs. You write the content (with AI suggestions); pairing to a specific job posting is manual.",
    wadecv:
      "Matched cover letter generated alongside every tailored resume, against the same scraped job description. Free with every tailoring — not a separate product or tier.",
    verdict: "wadecv",
  },
  {
    feature: "Pricing model",
    resumeio:
      "Freemium with a paywall at download. Creating a resume is free; downloading as PDF/DOCX, accessing premium templates, or removing the Resume.io logo requires a subscription — usually $7–10/month trial jumping to $25+/month, or roughly $96/year prepaid.",
    wadecv:
      "Pay-per-use credits — $10 for 20 tailored resumes ($0.50/resume), no subscription, no download paywall. Your first credit is free on signup; tailoring is free after a fit analysis.",
    verdict: "wadecv",
  },
  {
    feature: "Value for high-volume applicants",
    resumeio:
      "You pay the subscription once, then reuse one polished resume across hundreds of applications. Cheap per application if you don't tailor — but that's exactly the workflow recruiters increasingly screen against.",
    wadecv:
      "$0.50 per tailored resume. Twenty applications costs $10 and each resume is calibrated to its specific posting — dramatically higher recruiter response rate than a reused generic resume.",
    verdict: "wadecv",
  },
  {
    feature: "Career-changer & senior use cases",
    resumeio:
      "Templates and AI suggestions are optimised around conventional career narratives. Career-changers often fight the wizard's assumptions about industry-to-industry transferability; senior ICs get generic exec phrasing.",
    wadecv:
      "Dedicated prompting paths for career-change (see /career-change), senior IC, exec, and consulting / banking tracks. Job URL sets the seniority bar, so a VP-level posting gets VP-level rewriting automatically.",
    verdict: "wadecv",
  },
  {
    feature: "International / UK CV support",
    resumeio:
      "Templates are US-resume-oriented; UK-CV formatting (2-page, no photo, British English conventions) requires manual tweaking of a US template.",
    wadecv:
      "Detects UK job postings and produces UK CV conventions automatically — British English, 2-page standard, no photo, UK education format. See /free-cv-builder-uk for the UK-specific workflow.",
    verdict: "wadecv",
  },
  {
    feature: "Time per application",
    resumeio:
      "~25–45 minutes to build the first resume via the wizard. Subsequent applications reuse that resume; tailoring per posting is a manual copy-paste-edit pass against each job description.",
    wadecv:
      "~60 seconds per application after initial CV upload. Paste URL → fit analysis → tailored resume + cover letter. Built for volume without sacrificing per-job specificity.",
    verdict: "wadecv",
  },
];

const FAQ = [
  {
    question: "Is WadeCV better than Resume.io for tailoring a resume to a specific job?",
    answer:
      "Yes, when tailoring is the goal. Resume.io is a polished template-based resume builder — it helps you produce one visually strong resume that you then reuse across applications. WadeCV solves a different problem: it takes your existing CV plus a job URL and rewrites the whole resume against that specific posting in a single pass, including keyword density, summary phrasing, and seniority calibration. If you want one beautiful master resume to reuse, Resume.io wins on templates. If you want a different, ATS-calibrated resume for every job, WadeCV wins decisively.",
  },
  {
    question: "Is Resume.io actually free?",
    answer:
      "It is free to build a resume, but not free to download one. Resume.io paywalls the PDF and DOCX export behind a subscription — typically a $7-10 trial period that renews to $24.95 or more per month, or around $96 billed annually. People are often surprised after spending 30 minutes in the builder that the download requires card entry. WadeCV is pay-per-use: $10 for 20 tailored resumes, with no subscription and one free credit on signup so you can fully test the output before paying anything.",
  },
  {
    question: "Do Resume.io templates pass ATS screening?",
    answer:
      "The single-column, minimal-design templates usually pass. The multi-column and icon-heavy templates — which are the best-looking ones and therefore the most popular — can confuse older ATS parsers like Taleo and iCIMS, sometimes causing jumbled text extraction or dropped sections. If you use Resume.io, pick the simplest template you can tolerate. WadeCV skips the problem entirely: output is a clean single-column DOCX tested against Workday, Greenhouse, Lever, Ashby, and SAP SuccessFactors.",
  },
  {
    question: "Does Resume.io have AI resume tailoring?",
    answer:
      "Resume.io added an AI Writer that suggests bullet phrasing based on your job title and industry, but it does not read a specific job posting or calibrate the whole resume against one. The suggestions are a step above blank-page writing but remain generic relative to the actual employer's screening criteria. WadeCV's tailoring is job-specific — it scrapes the URL, identifies hard requirements and nice-to-haves, and rewrites every section to match that posting.",
  },
  {
    question: "Should I use Resume.io if I'm applying to 20+ jobs a week?",
    answer:
      "It's not the efficient tool for that volume. Resume.io is optimised for building one polished resume; tailoring it to 20 different jobs per week means 20 rounds of manual copy-paste-editing against each job description. WadeCV is built for this exact workflow — one upload, then ~60 seconds per application for a fully tailored resume plus matched cover letter. Campus recruiting cycles, career pivots, and post-layoff searches are the three use cases where the volume difference compounds.",
  },
  {
    question: "Which is better for career changers?",
    answer:
      "WadeCV. Career-changers need the AI to re-frame transferable experience into the vocabulary of the target industry — healthcare-to-tech, teacher-to-L&D, military-to-corporate, etc. Resume.io's wizard assumes you know how to describe your experience; it doesn't translate it across industries. WadeCV has dedicated prompting paths for career-change tracks and uses the job URL to set the target vocabulary for the whole rewrite.",
  },
  {
    question: "Can I use Resume.io and WadeCV together?",
    answer:
      "Yes, and this is a common workflow. Use Resume.io to build your polished master CV with the visual template you want. Download it, then upload that master to WadeCV as your base document. From there, every application gets a tailored rewrite in WadeCV — keeping the original formatting as a fallback if a recruiter specifically asks for a designed PDF. You get the design of Resume.io with the per-job specificity of WadeCV.",
  },
  {
    question: "How does Resume.io compare to Zety, Novoresume, and Kickresume?",
    answer:
      "They're all template-first builders in the same category — each optimises for polished design, freemium entry with a paywall at download, and AI suggestions that are generic by job title rather than calibrated to a specific posting. Resume.io has the largest template library and the most mature UX; Kickresume is cheapest; Novoresume is stripped-down; Zety has the most AI bullet suggestions. None of them do URL-based job tailoring, which is the category WadeCV occupies. See our full Best AI Resume Builders 2026 guide for the head-to-head.",
  },
  {
    question: "Is Resume.io worth it for international or UK applicants?",
    answer:
      "Resume.io's templates are US-resume-oriented. UK CV conventions (2-page standard, British English, no photo, UK qualifications formatting, month/year date style) require manual adjustment of a US template. WadeCV auto-detects UK job postings and produces CV conventions correctly, and has a dedicated UK workflow at /free-cv-builder-uk. For UK, Canada, or Australia applicants, WadeCV is the more natural fit.",
  },
];

export default function ResumeIoComparisonPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "WadeCV vs Resume.io: Job-Tailored AI vs Template Builder (2026)",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/wadecv-vs-resume-io`,
            },
            datePublished: "2026-04-24",
            dateModified: "2026-04-24",
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
        WadeCV vs Resume.io: Job-Tailored AI vs Template Builder (2026)
      </h1>

      <p className="text-muted-foreground mb-6">
        Resume.io is one of the largest template-based resume builders on the web — 20+ professional
        templates, a polished guided wizard, and an AI Writer that suggests bullet phrasing as you
        fill in sections. It excels at producing one visually strong resume you reuse across
        applications. WadeCV takes a fundamentally different approach: you upload your existing CV,
        paste a job URL, and the whole resume — summary, every bullet, and the skills section — gets
        rewritten against that specific posting in a single pass. Here&apos;s how the two tools
        compare feature by feature, and when each one is actually the right choice.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Feature comparison: WadeCV vs Resume.io</h2>
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
                  {row.verdict === "resumeio" && (
                    <Badge variant="secondary" className="text-xs">
                      Resume.io wins
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
                  <p className="font-medium text-foreground mb-1">Resume.io</p>
                  <p>{row.resumeio}</p>
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
        <h2 className="text-xl font-semibold mb-3">When Resume.io is the better choice</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You don&apos;t have an existing CV and want a wizard to walk you through
            section-by-section with polished design from day one.
          </li>
          <li>
            You prioritise visual design and are applying to roles where a styled PDF matters more
            than ATS parsing (creative, hospitality, small-business direct submissions).
          </li>
          <li>
            You plan to build one resume and reuse it across applications rather than tailor per
            job.
          </li>
          <li>
            You&apos;re comfortable with the subscription pricing and download paywall once you
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
            Workday, Ashby) and calibrate the entire resume against it — not a generic rewrite.
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
            Resume.io is one of the strongest template-based resume builders on the market — 20M+
            users, mature UX, and genuinely polished design. If you need a visually striking master
            CV and don&apos;t mind the monthly subscription, it&apos;s a credible choice in its
            category.
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
            Resume.io, download it once (paying the one-time trial), then upload that master to
            WadeCV. From there every application gets a tailored rewrite — keeping the visual design
            as a fallback for roles where a styled PDF is explicitly requested. You get the design
            of Resume.io with the per-job specificity of WadeCV.
          </p>
          <p>
            If you have to pick one and you&apos;re actively job searching, the question is: are you
            building one resume, or shipping many? Resume.io wins the first. WadeCV wins the second
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
        currentCategory="/wadecv-vs-resume-io"
        contextLinks={[
          {
            href: "/best-ai-resume-builder-2026",
            label: "Best AI Resume Builders 2026",
          },
          { href: "/wadecv-vs-zety", label: "WadeCV vs Zety" },
          { href: "/wadecv-vs-flowcv", label: "WadeCV vs FlowCV" },
          { href: "/wadecv-vs-enhancv", label: "WadeCV vs Enhancv" },
          { href: "/wadecv-vs-jobscan", label: "WadeCV vs Jobscan" },
          { href: "/wadecv-vs-teal", label: "WadeCV vs Teal" },
          {
            href: "/ats-resume-checker",
            label: "Free ATS Resume Checker",
          },
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
          <SeoCta variant="job" label="Tailor your resume now" slug="resume-io-comparison" />
        </CardContent>
      </Card>
    </article>
  );
}
