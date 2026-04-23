import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoCta } from "@/components/seo/seo-cta";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://wadecv.com");

export const metadata = {
  title: "WadeCV vs ResumeAI by Wonsulting: Full-Tailor AI vs Bullet Rewriter (2026) | WadeCV",
  description:
    "WadeCV vs ResumeAI by Wonsulting compared: bullet rewriting, job-specific tailoring, fit analysis, cover letters, and pricing. See which AI resume tool actually tailors your resume per job.",
  openGraph: {
    title: "WadeCV vs ResumeAI by Wonsulting: Full-Tailor AI vs Bullet Rewriter (2026)",
    description:
      "WadeCV vs ResumeAI by Wonsulting compared: job-specific tailoring, cover letters, pricing, and features side-by-side.",
  },
  twitter: {
    card: "summary" as const,
    title: "WadeCV vs ResumeAI by Wonsulting: Full-Tailor AI vs Bullet Rewriter (2026)",
    description:
      "WadeCV vs ResumeAI by Wonsulting: job-specific AI tailoring, cover letters, pricing, and features compared.",
  },
};

const ROWS: {
  feature: string;
  resumeai: string;
  wadecv: string;
  verdict: "wadecv" | "resumeai" | "tie";
}[] = [
  {
    feature: "Core approach",
    resumeai:
      "Bullet-level AI rewriter. You paste one resume bullet at a time and ResumeAI suggests a stronger version — framed around the Wonsulting WOWS (Work, Opportunity, Way, Story) coaching method for new grads.",
    wadecv:
      "Full-resume tailoring. You upload your existing CV and paste a job URL; WadeCV rewrites the entire resume — summary, every experience bullet, and the skills section — against that specific job in one pass.",
    verdict: "wadecv",
  },
  {
    feature: "Job description input",
    resumeai:
      "Free tier does not tailor to a specific job — it rewrites bullets generically. Paid tiers let you paste job description text and regenerate bullets against it one at a time.",
    wadecv:
      "Paste a LinkedIn, Indeed, Greenhouse, Lever, Workday, or Ashby URL and the full job description is scraped automatically — no copy-paste, no bullet-at-a-time workflow.",
    verdict: "wadecv",
  },
  {
    feature: "Target audience",
    resumeai:
      "Built for university students and new grads — tightly integrated with Wonsulting's coaching ecosystem (NextPlay, Wonsulting Academy, YouTube content from Jerry Lee and Jonathan Javier).",
    wadecv:
      "Built for anyone applying to real job postings — new grads, career-changers, senior ICs, execs, and UK/US job seekers. Not tied to a specific coaching brand.",
    verdict: "tie",
  },
  {
    feature: "Fit / gap analysis",
    resumeai:
      "Not a fit-analysis tool. ResumeAI rewrites language but does not tell you which skills you're missing relative to a specific job description or flag hard knockouts.",
    wadecv:
      "Runs a structured gap analysis before tailoring — identifies missing hard skills, knockout requirements, and weak sections, then closes those gaps during generation.",
    verdict: "wadecv",
  },
  {
    feature: "Cover letter generation",
    resumeai:
      "Cover letter generator is a separate Wonsulting product (sold as part of higher-tier plans) — not bundled with the free bullet rewriter.",
    wadecv:
      "A tailored cover letter is generated alongside every tailored resume, matched to the same job description — included free with every tailoring.",
    verdict: "wadecv",
  },
  {
    feature: "ATS optimization",
    resumeai:
      "Resume builder produces ATS-safe templates. But because tailoring is bullet-level against generic language, keyword density is only as strong as the individual bullets you rewrite.",
    wadecv:
      "ATS-safe DOCX output with keyword density calibrated to the actual job description — hard keywords, must-haves, and role-specific vocabulary placed in the right sections automatically.",
    verdict: "wadecv",
  },
  {
    feature: "Resume builder & templates",
    resumeai:
      "Full resume builder with Wonsulting-branded templates. Useful if you're starting from scratch and want a consistent new-grad format.",
    wadecv:
      "Works from your existing CV — imports and tailors rather than rebuilding. Does not offer a library of cosmetic templates.",
    verdict: "resumeai",
  },
  {
    feature: "Speed per application",
    resumeai:
      "You rewrite bullets one at a time, then reassemble them into the resume. For a typical 4-role CV with 3–5 bullets each, that's 12–20 generations plus manual reassembly per application.",
    wadecv:
      "One generation per application. Upload once, paste the URL, get a fully tailored resume plus cover letter in under 60 seconds.",
    verdict: "wadecv",
  },
  {
    feature: "Section-by-section editing",
    resumeai:
      "Bullet-by-bullet editing inside the Wonsulting resume builder. Each suggestion is independent — no cross-section coherence check.",
    wadecv:
      "Edit any section (summary, experience, skills) independently after full tailoring — with one-click regenerate per section if you want to try a different angle.",
    verdict: "tie",
  },
  {
    feature: "Senior / career-changer use case",
    resumeai:
      "Optimised for university-to-first-job resumes. Works less well for 10+ year senior ICs, career-changers crossing industries, or exec-level narratives where the story spans multiple roles.",
    wadecv:
      "Designed for any stage — dedicated prompting paths for career-change (see /career-change), senior IC, and exec-level resumes. Job URL lets the AI calibrate seniority against the target role.",
    verdict: "wadecv",
  },
  {
    feature: "Physical mail delivery",
    resumeai: "Not available.",
    wadecv:
      "Send a printed resume via USPS directly from WadeCV — useful for high-priority applications, dream-company mailers, or executive outreach.",
    verdict: "wadecv",
  },
  {
    feature: "Pricing model",
    resumeai:
      "Free tier with limited bullet rewrites; paid plans are credit / subscription based and part of the broader Wonsulting bundle (often sold alongside coaching or access to NextPlay).",
    wadecv:
      "Pay-per-use credits — no subscription, no bundled coaching. Starter: 20 credits for $10 ($0.50/resume). One credit runs a fit analysis; tailoring is free after that. 1 free credit on signup.",
    verdict: "wadecv",
  },
];

const FAQ = [
  {
    question:
      "Is WadeCV better than ResumeAI by Wonsulting for tailoring a resume to a specific job?",
    answer:
      "For tailoring to a specific job posting, yes. ResumeAI by Wonsulting is a bullet-level rewriter — you paste one bullet at a time and it suggests a stronger version, usually framed around Wonsulting's WOWS coaching method. WadeCV takes a job URL and rewrites the entire resume in one pass, so the summary, every bullet, and the skills section all align to the same job description. If you're a new grad working on a master resume and you want to learn Wonsulting's frameworks, ResumeAI is useful. If you're applying to a specific posting and want a finished, ATS-calibrated resume in under a minute, WadeCV is faster.",
  },
  {
    question: "Does ResumeAI by Wonsulting actually rewrite the whole resume per job?",
    answer:
      "No — not in one step. ResumeAI rewrites individual bullets on demand. If you want a fully tailored resume per application, you have to rewrite each bullet one at a time against the target job and then reassemble them. For a four-role CV with three to five bullets each, that's twelve to twenty separate generations per job. WadeCV does the same output in a single generation.",
  },
  {
    question: "Is ResumeAI by Wonsulting free?",
    answer:
      "ResumeAI has a free tier with limited generations, and paid access is usually sold as part of Wonsulting's broader bundle (NextPlay, coaching, premium templates). Once you scale past the free tier, total cost per tailored resume can be higher than pay-per-use alternatives. WadeCV's Starter pack is $10 for 20 tailored resumes ($0.50 each) with no subscription.",
  },
  {
    question: "I'm a new grad — should I use ResumeAI by Wonsulting or WadeCV?",
    answer:
      "Both work for new grads. ResumeAI is tightly integrated with Wonsulting's new-grad coaching content — if you already follow Jerry Lee and Jonathan Javier's frameworks and want your resume to reflect the WOWS method, ResumeAI will feel native. WadeCV is framework-agnostic: it reads the job URL, identifies what the employer is actually screening for, and rewrites to match that. Many new grads use WadeCV specifically because it lets them apply to 20+ internships or entry-level roles quickly without re-learning a framework.",
  },
  {
    question: "Can I use both ResumeAI by Wonsulting and WadeCV?",
    answer:
      "Yes. One common workflow: use WadeCV to generate a tailored resume per application (fast, full-resume, per-job), then paste individual bullets into ResumeAI if you want a second opinion or want to try Wonsulting's WOWS structure on a specific line. They're complementary — WadeCV gives you the full artifact; ResumeAI helps you stress-test a single bullet.",
  },
  {
    question: "Which tool is better for applying to 20+ jobs in a week?",
    answer:
      "WadeCV. High-volume application is exactly the workflow WadeCV was built for — upload your CV once, paste a job URL, get a fully tailored resume plus cover letter in under 60 seconds. Doing the same volume on a bullet-level rewriter means 200+ individual generations per week plus manual reassembly. For campus recruiting cycles (10–30 applications per week) or career pivots, the time saved is the main reason users switch.",
  },
  {
    question: "Does ResumeAI by Wonsulting run a fit analysis against the job description?",
    answer:
      "Not as a structured step. ResumeAI rewrites bullets using language from your prompt, but it doesn't tell you which hard skills, must-haves, or knockout criteria are missing relative to the posting. WadeCV runs a gap analysis before tailoring — it reports what's missing and then closes those gaps automatically during generation.",
  },
  {
    question: "Is WadeCV better than ChatGPT or Claude for this use case?",
    answer:
      "ChatGPT and Claude can rewrite resumes, but they don't scrape the job URL, don't produce an ATS-safe DOCX, don't track application history, and don't generate a matched cover letter in the same pass. WadeCV is specifically a resume product — job URL scraping, fit analysis, ATS-safe formatting, DOCX export, and cover letter generation are built in. See WadeCV vs Claude for a direct comparison.",
  },
  {
    question: "Does ResumeAI by Wonsulting work for career changers or senior ICs?",
    answer:
      "It works, but it's optimised for university-to-first-job resumes. Career-changers often need the AI to reframe transferable skills into the language of a new industry, and senior ICs need coherent multi-role narratives rather than isolated stronger bullets. WadeCV has dedicated prompting paths for career-change (see /career-change) and senior-level resumes where the job URL sets the seniority bar for the whole rewrite.",
  },
  {
    question: "Will my resume sound AI-generated if I use WadeCV?",
    answer:
      "WadeCV is tuned to avoid the classic AI resume tells — generic leadership clichés, em-dash overuse, inflated adjectives, and filler. If you're worried about detection, our humanize-AI-resume guide walks through what recruiters and AI detectors look for, and every WadeCV generation is built around your real experience with real numbers where you provide them.",
  },
];

export default function ResumeAiComparisonPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "WadeCV vs ResumeAI by Wonsulting: Full-Tailor AI vs Bullet Rewriter (2026)",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/wadecv-vs-resumeai`,
            },
            datePublished: "2026-04-22",
            dateModified: "2026-04-22",
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
        WadeCV vs ResumeAI by Wonsulting: Full-Tailor AI vs Bullet Rewriter (2026)
      </h1>

      <p className="text-muted-foreground mb-6">
        ResumeAI by Wonsulting is one of the most talked-about free AI resume tools on the market —
        built by Jerry Lee and Jonathan Javier of Wonsulting, tightly integrated with their new-grad
        coaching ecosystem, and designed around the WOWS (Work, Opportunity, Way, Story) bullet
        framework. WadeCV takes a fundamentally different approach: instead of rewriting one bullet
        at a time, it takes your existing CV plus a job URL and rewrites the entire resume —
        summary, experience, and skills — against that specific posting in a single pass.
        Here&apos;s how the two tools compare feature by feature, including when each one is
        actually the right choice.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Feature comparison: WadeCV vs ResumeAI by Wonsulting
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
                  {row.verdict === "resumeai" && (
                    <Badge variant="secondary" className="text-xs">
                      ResumeAI wins
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
                  <p className="font-medium text-foreground mb-1">ResumeAI by Wonsulting</p>
                  <p>{row.resumeai}</p>
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
          When ResumeAI by Wonsulting is the better choice
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You&apos;re a university student or new grad already inside the Wonsulting ecosystem
            (NextPlay, Wonsulting Academy, YouTube coaching) and you want your resume to reflect the
            WOWS method.
          </li>
          <li>
            You&apos;re building a master resume from scratch and want a library of cosmetic
            templates rather than tailoring an existing CV.
          </li>
          <li>
            You want to stress-test individual bullets one at a time against multiple coaching
            frameworks rather than generate a complete resume.
          </li>
          <li>
            You&apos;re not applying in high volume yet and one resume plus occasional bullet tweaks
            is enough.
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
          <li>You need a matched cover letter generated in the same pass, not sold separately.</li>
          <li>
            You&apos;re a career-changer, senior IC, or executive where a bullet-level rewriter
            can&apos;t hold the full narrative together.
          </li>
          <li>
            You want pay-per-use pricing ($0.50 per tailored resume) with no subscription and no
            bundled coaching.
          </li>
          <li>
            You want a structured fit / gap analysis before tailoring so you know which hard skills
            and knockout requirements are missing.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">The verdict</h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            ResumeAI by Wonsulting is one of the strongest free AI resume tools for new grads —
            especially if you already trust Wonsulting&apos;s coaching brand and want to learn the
            WOWS framework as you rewrite. As a bullet-level rewriter, it&apos;s effective for
            polishing individual lines on a master resume.
          </p>
          <p>
            WadeCV solves a different problem. It&apos;s not a bullet rewriter and it&apos;s not a
            coaching-branded tool. It&apos;s a job-application workflow: upload your CV once, paste
            a job URL, and get a fully tailored resume plus a matched cover letter in under a
            minute. For job seekers applying to 10+ roles a week — campus recruiting, career pivots,
            layoff searches — the volume difference is the whole point.
          </p>
          <p>
            The two tools can work together. Many users generate a tailored base in WadeCV, then
            paste individual bullets into ResumeAI when they want a second opinion or want to try
            Wonsulting&apos;s framework on a specific line. If you have to pick one, the question is
            simple: are you editing one resume, or shipping many? ResumeAI wins the first; WadeCV
            wins the second.
          </p>
          <p>
            Either way, if you&apos;re evaluating this category, it&apos;s worth reading our broader{" "}
            <a href="/best-ai-resume-builder-2026" className="text-primary underline">
              Best AI Resume Builders 2026
            </a>{" "}
            guide and our{" "}
            <a href="/ai-resume-builder-comparison" className="text-primary underline">
              full AI resume builder comparison
            </a>
            , which benchmark WadeCV against ChatGPT, Claude, Jobscan, Teal, Rezi, Enhancv, FlowCV,
            Zety, and others on the same dimensions.
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
        currentCategory="/wadecv-vs-resumeai"
        contextLinks={[
          {
            href: "/best-ai-resume-builder-2026",
            label: "Best AI Resume Builders 2026",
          },
          { href: "/wadecv-vs-jobscan", label: "WadeCV vs Jobscan" },
          { href: "/wadecv-vs-teal", label: "WadeCV vs Teal" },
          { href: "/wadecv-vs-wobo", label: "WadeCV vs Wobo AI" },
          { href: "/wadecv-vs-claude", label: "WadeCV vs Claude" },
          {
            href: "/ai-resume-builder-comparison",
            label: "AI Resume Builder Comparison",
          },
          { href: "/humanize-ai-resume", label: "Humanize AI Resume" },
          {
            href: "/ats-resume-checker",
            label: "Free ATS Resume Checker",
          },
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
          <SeoCta variant="job" label="Tailor your resume now" slug="resumeai-comparison" />
        </CardContent>
      </Card>
    </article>
  );
}
