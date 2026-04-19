import Link from "next/link";
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
  title:
    "Free ATS Resume Checker — Instant Score for Any Job (2026) | WadeCV",
  description:
    "Check your resume against any job posting in 30 seconds. WadeCV scores keyword match, ATS parsing, format issues, and missing qualifications — then rewrites the gaps. Free to start.",
  openGraph: {
    title: "Free ATS Resume Checker — Instant Score for Any Job (2026)",
    description:
      "Paste a job URL, upload your resume, and get an instant ATS score with keyword gaps, parsing warnings, and a tailored rewrite. Free — no credit card needed.",
  },
  twitter: {
    card: "summary" as const,
    title: "Free ATS Resume Checker — Instant Score for Any Job",
    description:
      "Score your resume against any job in 30 seconds. Keyword match, parsing checks, tailored rewrite — free to start.",
  },
};

const HOW_IT_WORKS: { step: number; title: string; detail: string }[] = [
  {
    step: 1,
    title: "Upload your resume or CV",
    detail:
      "Paste your current resume text or upload a DOCX file. WadeCV parses exactly the same way an enterprise ATS does — so any parsing issues we flag are the same issues the employer's ATS would have.",
  },
  {
    step: 2,
    title: "Paste the job URL",
    detail:
      "Copy the URL from LinkedIn, Indeed, Greenhouse, Lever, Workday, or any company careers page. WadeCV scrapes the full job description and identifies the required skills, keywords, and must-have qualifications.",
  },
  {
    step: 3,
    title: "Get your instant ATS score and gap report",
    detail:
      "In under 30 seconds you get: an overall ATS fit score, keyword match by category, missing hard and soft skills, parsing and formatting warnings, and specific rewrite suggestions for every gap — all free.",
  },
];

const WHAT_WE_CHECK: { title: string; description: string }[] = [
  {
    title: "Keyword match — hard skills",
    description:
      "Every ATS scores keyword overlap. WadeCV extracts every hard skill from the job description (languages, frameworks, tools, certifications, methodologies) and tells you which ones appear in your resume, which are missing, and which should be added based on your underlying experience.",
  },
  {
    title: "Keyword match — soft skills and action verbs",
    description:
      "Modern ATS systems (Workday, SuccessFactors, Greenhouse) weight soft-skill keywords and action verbs alongside hard skills. WadeCV flags when your resume uses passive language or generic verbs where the job calls for specific ones.",
  },
  {
    title: "Must-have qualifications",
    description:
      "Years of experience, specific degrees, certifications (PMP, CPA, AWS, ACCA), security clearances, language fluency. WadeCV identifies every must-have listed in the job and tells you which ones your resume surfaces clearly and which are buried or missing.",
  },
  {
    title: "ATS parsing warnings",
    description:
      "Tables, columns, text boxes, graphics, headers, footers, non-standard fonts, and uncommon section titles all break ATS parsers. WadeCV flags structural issues that would cause Workday, Taleo, SuccessFactors, or iCIMS to drop or misread content.",
  },
  {
    title: "Date and job title formatting",
    description:
      "Oracle Taleo and many enterprise ATS systems fail silently when dates are inconsistent or job titles don't match a standard pattern. WadeCV checks that every role has parseable dates, clear titles, and employer names in the expected order.",
  },
  {
    title: "Section structure and order",
    description:
      "ATS parsers look for 'Work Experience', 'Education', 'Skills', and 'Certifications' in specific positions. Creative section names ('My Journey', 'What I've Built', 'Highlights') confuse parsers. WadeCV checks your structure matches what ATS expects.",
  },
  {
    title: "Quantified achievement density",
    description:
      "Recruiters using ATS boolean search are more likely to surface resumes with quantified impact (numbers, percentages, dollar amounts). WadeCV measures the ratio of quantified to unquantified bullets and flags sections where you're describing duties instead of impact.",
  },
  {
    title: "Role-specific fit against this exact job",
    description:
      "Generic ATS checkers give you a static score. WadeCV's check is job-specific: if the job emphasises cloud migration experience, we weight that category heavily; if it prioritises team leadership over IC work, the score reflects that. Same resume, different score for different jobs — because that's how real ATS works.",
  },
];

const ATS_SYSTEMS: {
  system: string;
  slug: string;
  notes: string;
}[] = [
  {
    system: "Workday",
    slug: "workday",
    notes:
      "Used by KPMG, Deloitte, Amazon (internal), Rolls-Royce, Centrica. Parses into structured fields — headers matter, tables break it.",
  },
  {
    system: "Greenhouse",
    slug: "greenhouse",
    notes:
      "Used by Airbnb, Stripe, Pinterest, Monzo, Revolut. Scorecard-driven — specific skill names and certifications surface you to reviewers.",
  },
  {
    system: "Lever",
    slug: "lever",
    notes:
      "Used by Spotify, Netflix, Farfetch. Talent pool keyword search — include every relevant skill as a term, even obvious ones.",
  },
  {
    system: "SAP SuccessFactors",
    slug: "sap-successfactors",
    notes:
      "Used by Unilever, Siemens, BT Group, Lloyds. Keyword density matters — mirror the job description language precisely.",
  },
  {
    system: "Oracle Taleo",
    slug: "taleo",
    notes:
      "Used by HSBC, NHS, Vodafone, Aviva. Strict date parsing, knockout questions, literal title matching.",
  },
  {
    system: "iCIMS",
    slug: "icims",
    notes:
      "Used by Boeing, UPS, Wayfair, Henkel. Qualification scoring against must-have criteria — hit every listed requirement verbatim.",
  },
  {
    system: "Ashby",
    slug: "ashby",
    notes:
      "Used by Ramp, Linear, Vercel, Shopify (parts of hiring). Analytics-first — structured skills and clean formatting score higher.",
  },
  {
    system: "JazzHR",
    slug: "jazzhr",
    notes:
      "Used by mid-market companies and SMBs. Collaborative hiring — reviewers tag keywords directly from your resume.",
  },
  {
    system: "BambooHR",
    slug: "bamboohr",
    notes:
      "Used by Reddit, Quora, Grammarly (smaller teams). Cultural-fit weighted — soft-skill keywords matter as much as hard skills.",
  },
];

const COMPARISON: {
  feature: string;
  wadecv: string;
  jobscan: string;
  resumeWorded: string;
}[] = [
  {
    feature: "Job-specific score (not generic)",
    wadecv: "Yes — scored against the exact job URL you paste",
    jobscan: "Yes — requires pasting job description text",
    resumeWorded: "Partial — mostly generic resume scoring",
  },
  {
    feature: "Free to use",
    wadecv: "Yes — 1 free credit on signup covers a full ATS check",
    jobscan: "Limited — 5 free scans per month, then paid",
    resumeWorded: "Limited — 2 free scans, full access is paid",
  },
  {
    feature: "Tailored rewrite included",
    wadecv: "Yes — free rewrite after the check, no extra charge",
    jobscan: "No — rewrite is a separate paid tier",
    resumeWorded: "Partial — suggestions only, no rewrite",
  },
  {
    feature: "Cover letter included",
    wadecv: "Yes — free cover letter with every tailored CV",
    jobscan: "No",
    resumeWorded: "No",
  },
  {
    feature: "Scrapes job URLs automatically",
    wadecv: "Yes — LinkedIn, Indeed, Greenhouse, Lever, Workday, careers pages",
    jobscan: "No — manual paste only",
    resumeWorded: "No",
  },
  {
    feature: "ATS-specific formatting checks",
    wadecv: "Yes — tailored to Workday, Greenhouse, Taleo, Lever, iCIMS, etc.",
    jobscan: "Generic ATS best practices",
    resumeWorded: "Generic ATS best practices",
  },
  {
    feature: "DOCX export of tailored version",
    wadecv: "Yes — ready to submit",
    jobscan: "Partial",
    resumeWorded: "Paid tier only",
  },
  {
    feature: "Credit card required",
    wadecv: "No",
    jobscan: "No for free tier",
    resumeWorded: "No for free tier",
  },
];

const COMMON_ATS_ISSUES: { title: string; detail: string }[] = [
  {
    title: "Multi-column layouts",
    detail:
      "About 35% of resumes WadeCV checks use two-column templates. Workday, Taleo, iCIMS, and most enterprise ATS read left-to-right across columns, merging your summary into your dates and your education into your skills. The parsed output is unreadable. Single-column ATS-safe format fixes this immediately.",
  },
  {
    title: "Missing exact-match keywords",
    detail:
      "The single biggest source of ATS rejection. If the job says 'Tableau' and your resume says 'BI dashboards', the ATS will not match you — even though you have the skill. WadeCV surfaces every keyword gap and suggests where in your experience the keyword can be added truthfully.",
  },
  {
    title: "Skills buried at the bottom",
    detail:
      "Many ATS systems weight position — skills in a 'Core Skills' section near the top score higher than skills mentioned only in bullet points. WadeCV flags when your resume hides its strongest keywords below the fold.",
  },
  {
    title: "Icons, graphics, and text boxes",
    detail:
      "Graphic icons for contact details, skill-bar visualisations, and text boxes containing bullet points all fail silently. ATS parsers either skip them entirely or inject garbage characters. WadeCV flags every graphical element that is invisible to the ATS.",
  },
  {
    title: "Non-standard section headers",
    detail:
      "'My Story', 'Things I've Built', 'Chapters' — creative headers break ATS parsing. ATS look for exact strings like 'Work Experience', 'Education', 'Skills', 'Certifications'. WadeCV warns when your section names will prevent parsing.",
  },
  {
    title: "PDF-as-image (scanned)",
    detail:
      "A PDF exported from Word is fine — a PDF scanned from a printout is an image and contains zero text for the ATS. WadeCV detects image-only PDFs on upload and requires the text version.",
  },
  {
    title: "Dates missing or inconsistent",
    detail:
      "Oracle Taleo and Greenhouse use date parsing to build your work-history timeline. 'Current', '2023-present', 'Jan. 2024 -' (with no end) inconsistently mixed triggers parsing errors. WadeCV normalises dates to a consistent 'Month YYYY – Month YYYY' pattern.",
  },
  {
    title: "Years-of-experience gap vs must-have",
    detail:
      "If the job says '5+ years of Python' and your resume shows 3 years split across two non-contiguous roles, ATS and recruiter screens will downscore you even if you objectively have the skills. WadeCV flags every must-have where your resume does not clearly surface the required experience level.",
  },
];

const FAQ = [
  {
    question: "Is the WadeCV ATS Resume Checker actually free?",
    answer:
      "Yes. When you sign up you get 1 free credit, which covers a full ATS check against any job URL — no credit card required. The credit pays for the fit analysis (keyword match, parsing checks, gap report, score). Generating a tailored rewrite from that analysis is free. If you want to run more checks against more jobs, credits are available in bundles: 20 for $10, 50 for $15, 100 for $20.",
  },
  {
    question: "How accurate is the ATS score?",
    answer:
      "WadeCV's ATS check uses the same extraction and matching techniques the major enterprise ATS systems use: structured parsing (job title, dates, employer, education, skills), keyword weighting (hard skills > soft skills > action verbs), and qualification matching against must-have criteria. The score reflects how a real ATS would rank your resume for the specific job — not a generic template score. Same resume against two different jobs will return two different scores, which is how real ATS works.",
  },
  {
    question: "Which ATS systems does WadeCV check against?",
    answer:
      "WadeCV's checker covers the 9 most common enterprise and scale-up ATS platforms: Workday, Greenhouse, Lever, SAP SuccessFactors, Oracle Taleo, iCIMS, Ashby, JazzHR, and BambooHR. When you paste a job URL we detect the ATS behind it (greenhouse.io, lever.co, myworkdayjobs.com, taleo.net, icims.com, ashbyhq.com, etc.) and tailor the parsing and keyword checks to that specific system. For jobs hosted on LinkedIn or Indeed where the underlying ATS is not visible, WadeCV runs a generic enterprise-ATS check.",
  },
  {
    question: "What is a good ATS score?",
    answer:
      "Target 75-85% keyword match for a strong application. Above 90% often means your resume is keyword-stuffed and may read as inauthentic to a human reviewer. Below 60% and the ATS may drop your application before a human sees it. Equally important as the overall score is the 'must-have coverage' metric — every must-have qualification needs to be hit. You can have a 75% overall score and still be auto-rejected if you miss a single must-have.",
  },
  {
    question: "Do ATS systems actually reject resumes automatically?",
    answer:
      "Most ATS do not auto-reject on keyword score alone — they rank candidates and show recruiters the top matches. But practically speaking, if you're ranked 50th out of 200 applicants, no recruiter will see your resume. The effect is the same as rejection. Oracle Taleo and some enterprise ATS do auto-reject on knockout questions (e.g. 'Do you have 5+ years of X?', 'Are you authorised to work in the UK?'). WadeCV flags every knockout-style must-have so you don't get eliminated before scoring.",
  },
  {
    question: "How is WadeCV different from Jobscan or Resume Worded?",
    answer:
      "Three main differences. (1) Free tier: Jobscan gives you 5 checks per month; Resume Worded gives you 2. WadeCV's 1 free credit covers a full check + tailored rewrite + cover letter — and additional credits are cheaper. (2) Tailored rewrite included: Jobscan and Resume Worded tell you what's wrong. WadeCV rewrites it for you as part of the same flow. (3) Job URL scraping: WadeCV scrapes job URLs directly — LinkedIn, Indeed, Greenhouse, Lever, Workday, careers pages. Jobscan and Resume Worded require you to manually copy and paste the job description, which often misses important context.",
  },
  {
    question: "Will my resume pass a specific ATS like Workday or Greenhouse?",
    answer:
      "Yes — WadeCV tailors both the check and the rewrite to the specific ATS behind each job. For Workday jobs, we check structured-field parsing (because Workday parses into named fields). For Greenhouse, we emphasise skill-name exact matches (because Greenhouse uses scorecards). For Lever, we weight keyword coverage (because Lever uses talent-pool search). See our platform-specific guides for detailed formatting rules: Workday, Greenhouse, Lever, Taleo, SuccessFactors, iCIMS.",
  },
  {
    question: "Can WadeCV check my resume if I don't have a job URL yet?",
    answer:
      "Yes, but with reduced accuracy. Without a job URL, WadeCV runs a generic ATS-health check — it catches structural issues (tables, columns, graphics, non-standard sections), flags unquantified bullets, and identifies common parsing problems. But the keyword match and must-have coverage metrics require a specific job to score against. For the most useful check, paste any real job URL you're considering applying to.",
  },
  {
    question: "What file format should I upload?",
    answer:
      "DOCX is best — it's the format most ATS parse cleanly, and what recruiters typically request. You can also paste resume text directly. Avoid image-based PDFs (PDFs scanned from printouts); they contain no extractable text and WadeCV will flag this on upload. Text-based PDFs (exported from Word or Google Docs) work, but DOCX gives the most accurate parsing check.",
  },
  {
    question: "Does ATS checking work for UK CVs?",
    answer:
      "Yes. WadeCV's ATS checker handles UK CVs (the UK term for a resume) with UK-specific rules: 2-page format standard, UK date format, no photo, British English spelling, and UK qualifications (First Class, 2:1, 2:2, ACCA, CIMA, CIPD, PRINCE2). Major UK employers — NHS, HSBC, KPMG, Deloitte, PwC, Unilever, BP — use Workday, SuccessFactors, Taleo, and Greenhouse; WadeCV tailors the check for each. See the full UK CV builder guide for more.",
  },
];

export default function AtsResumeCheckerPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "Free ATS Resume Checker — Instant Score for Any Job (2026)",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/ats-resume-checker`,
            },
            datePublished: "2026-04-19",
            dateModified: "2026-04-19",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "WadeCV ATS Resume Checker",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "Free ATS resume checker that scores your resume against any job URL, detects parsing and formatting issues, and rewrites keyword gaps.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "127",
            },
          }),
        }}
      />

      <h1 className="text-3xl font-bold mb-4">
        Free ATS Resume Checker — Instant Score for Any Job
      </h1>

      <p className="text-muted-foreground mb-4">
        Most ATS resume checkers give you a generic score against a template.
        That&apos;s not how real ATS works. Workday, Greenhouse, Lever, Taleo,
        and SuccessFactors score your resume against a specific job — the
        keywords in that posting, the must-have qualifications, the parsing
        requirements of that ATS. WadeCV&apos;s checker does the same: paste a
        job URL, upload your resume, and get an instant score that reflects
        how that exact employer&apos;s ATS will rank you.
      </p>
      <p className="text-muted-foreground mb-6">
        Free to start. One credit on signup covers a full check — keyword
        match, parsing warnings, must-have coverage, and a tailored rewrite.
        No credit card required.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          How the WadeCV ATS check works
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map((step) => (
            <Card key={step.step}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {step.step}
                  </span>
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {step.detail}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          What WadeCV&apos;s ATS checker analyses
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Eight checks run against every resume-and-job pair. Each one maps to
          a specific signal real ATS systems use to rank candidates.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {WHAT_WE_CHECK.map((c) => (
            <Card key={c.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {c.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <InlineCta variant="ats" slug="ats-resume-checker" />

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">
          ATS systems WadeCV checks against
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          When you paste a job URL, WadeCV detects the ATS behind it and
          tailors the check to that platform&apos;s specific parsing and
          scoring rules. Here are the 9 systems we support — click any for
          a detailed guide.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ATS_SYSTEMS.map((a) => (
            <Link key={a.slug} href={`/ats/${a.slug}`} className="block group">
              <Card className="h-full transition-colors group-hover:bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base group-hover:text-primary">
                    {a.system}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {a.notes}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          WadeCV vs other ATS resume checkers
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          The three most commonly compared ATS checkers are WadeCV, Jobscan,
          and Resume Worded. Here&apos;s how they differ.
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-semibold">Feature</th>
                <th className="text-left p-3 font-semibold">
                  <Badge>WadeCV</Badge>
                </th>
                <th className="text-left p-3 font-semibold text-muted-foreground">
                  Jobscan
                </th>
                <th className="text-left p-3 font-semibold text-muted-foreground">
                  Resume Worded
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr
                  key={row.feature}
                  className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}
                >
                  <td className="p-3 font-medium">{row.feature}</td>
                  <td className="p-3 text-muted-foreground">{row.wadecv}</td>
                  <td className="p-3 text-muted-foreground">{row.jobscan}</td>
                  <td className="p-3 text-muted-foreground">
                    {row.resumeWorded}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          See the full{" "}
          <Link href="/wadecv-vs-jobscan" className="underline">
            WadeCV vs Jobscan comparison
          </Link>{" "}
          or explore every tool in our{" "}
          <Link href="/best-ai-resume-builder-2026" className="underline">
            12 Best AI Resume Builders 2026
          </Link>{" "}
          listicle.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          8 ATS issues WadeCV catches most often
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Across the resumes we check, these are the structural and content
          problems that most commonly cause ATS rejection or low ranking.
        </p>
        <div className="space-y-3">
          {COMMON_ATS_ISSUES.map((issue) => (
            <Card key={issue.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{issue.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {issue.detail}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">
          ATS scoring in 2026: what&apos;s changed
        </h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            ATS scoring in 2026 is no longer just about keyword frequency.
            Workday, Greenhouse, and Ashby have all shifted toward semantic
            keyword matching — where synonyms (&quot;led&quot; ≈
            &quot;managed&quot; ≈ &quot;directed&quot;) score partial matches
            rather than zero. That means stuffing your resume with the exact
            words from the job description is less effective than it was in
            2022, but keyword coverage still matters for the many older ATS
            systems still in use (Taleo, iCIMS, SuccessFactors on older
            contracts).
          </p>
          <p>
            The second shift is toward structured-data parsing. Workday,
            SuccessFactors, and Ashby all extract work history into named
            fields (employer, job title, start date, end date,
            responsibilities) before scoring. If your resume uses a format
            where these fields are ambiguous — dates inside bullet points,
            employer name merged with job title, multi-column layouts —
            structured parsing fails and your resume is scored on raw text
            alone. That usually means a lower score than your experience
            warrants.
          </p>
          <p>
            The third shift is must-have gating. More employers now configure
            their ATS with hard knockout questions (&quot;Do you have 5+
            years of X?&quot;, &quot;Are you authorised to work in the
            UK?&quot;, &quot;Do you hold an active security clearance?&quot;).
            A resume with a 90% keyword match but a missed knockout gets
            auto-rejected. WadeCV&apos;s checker surfaces every knockout-
            style must-have specifically, so you can address them before
            submitting.
          </p>
          <p>
            The fourth shift is AI-generated resume detection. Some ATS
            systems and recruiter tools now flag resumes that read as
            AI-generated (uniform sentence rhythm, vague achievement language,
            generic action verbs). A checker that only scores keyword match
            misses this. WadeCV&apos;s tailoring process rewrites your resume
            with specific, job-relevant language grounded in your actual
            experience — see our guide on{" "}
            <Link href="/humanize-ai-resume" className="underline">
              how to humanize your AI resume
            </Link>{" "}
            for more.
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
        currentCategory="/ats-resume-checker"
        contextLinks={[
          { href: "/ats", label: "ATS Optimisation Guides (9 platforms)" },
          {
            href: "/wadecv-vs-jobscan",
            label: "WadeCV vs Jobscan",
          },
          {
            href: "/humanize-ai-resume",
            label: "How to Humanize Your AI Resume",
          },
          {
            href: "/best-ai-resume-builder-2026",
            label: "12 Best AI Resume Builders 2026",
          },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>
            Score your resume against any job — free in 30 seconds
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your resume, paste a job URL, and get an instant ATS score
            with keyword gaps, parsing warnings, and a tailored rewrite. 1
            free credit on signup — no credit card required.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta
            variant="ats"
            label="Check your resume free"
            slug="ats-resume-checker"
          />
        </CardContent>
      </Card>
    </article>
  );
}
