import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoCta } from "@/components/seo/seo-cta";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";
import { InlineCta } from "@/components/seo/inline-cta";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://wadecv.com");

export const metadata = {
  title: "Free AI CV Builder for UK Job Seekers — Tailored to Every Role | WadeCV",
  description:
    "Build a tailored, ATS-optimised CV for every UK job application in seconds. Upload your existing CV, paste a job URL, and WadeCV rewrites it to match what UK employers want — free to start.",
  openGraph: {
    title: "Free AI CV Builder for UK Job Seekers — Tailored to Every Role",
    description:
      "Upload your CV, paste a UK job URL, and WadeCV creates a tailored, ATS-friendly version in seconds. Free to start — no credit card needed.",
  },
  twitter: {
    card: "summary" as const,
    title: "Free AI CV Builder for UK Job Seekers",
    description: "Build a tailored CV for every UK job application in seconds. Free to start.",
  },
};

const UK_US_DIFFERENCES: {
  uk: string;
  international: string;
  why: string;
}[] = [
  {
    uk: "Called a CV (Curriculum Vitae)",
    international: "Called a Resume in the US and Canada",
    why: "In the UK, 'CV' is the standard term for any job application document — regardless of length. Using 'resume' signals unfamiliarity with UK conventions.",
  },
  {
    uk: "2 pages standard for experienced candidates",
    international: "1 page is often recommended in the US",
    why: "UK hiring managers expect 2 pages for most mid-to-senior roles. A 1-page CV can look thin. Recent graduates can use 1 page, but 2 is acceptable from 3+ years of experience.",
  },
  {
    uk: "No photo, date of birth, or marital status",
    international: "Same rule applies in most of Europe",
    why: "UK employment law (Equality Act 2010) means recruiters should not see personal characteristics before evaluating skills. Adding a photo or date of birth can actually harm your application.",
  },
  {
    uk: "A4 paper, UK date format (DD/MM/YYYY)",
    international: "Letter paper and MM/DD/YYYY in the US",
    why: "UK CVs should be formatted for A4. If you are converting a US resume, check margins, font sizes, and that all dates use the UK format.",
  },
  {
    uk: "UK qualifications: A-Levels, GCSEs, BSc/BA Hons",
    international: "High school diploma, GPA, credit hours in the US",
    why: "UK employers expect to see UCAS qualifications, UK degree classification (First Class, 2:1, 2:2), and relevant professional certifications (ACCA, CIMA, CIPD, PRINCE2, CIM).",
  },
];

const UK_FEATURES: { title: string; description: string }[] = [
  {
    title: "ATS optimised for UK employers",
    description:
      "Major UK employers — KPMG, Deloitte, PwC, EY, HSBC, Barclays, NHS, BT, Unilever, BP — use enterprise ATS platforms: Workday, SAP SuccessFactors, Taleo, and iCIMS. WadeCV formats and keywords your CV for the specific ATS behind each job.",
  },
  {
    title: "UK spelling and terminology throughout",
    description:
      "WadeCV uses British English spelling (organise, optimise, colour, programme) and UK-standard terms (redundancy not layoff, holiday not vacation, turnover not revenue) — details that signal a polished UK CV.",
  },
  {
    title: "Sector-specific language for UK industries",
    description:
      "From NHS clinical roles to City finance positions to UK retail head office jobs, WadeCV understands the terminology UK hiring managers expect: CIPD for HR, CIM for marketing, ACCA/CIMA for finance, PRINCE2/APM for project management.",
  },
  {
    title: "Tailored to UK job descriptions, not generic templates",
    description:
      "Instead of a one-size-fits-all template, WadeCV rewrites your CV around the exact language of each UK job posting. Every application gets a version that mirrors what the specific employer asked for.",
  },
  {
    title: "Free cover letter with every tailored CV",
    description:
      "UK applications frequently require a covering letter alongside the CV. WadeCV generates a UK-format covering letter for every tailored CV, addressing the specific role and employer.",
  },
  {
    title: "Download as DOCX — UK recruiter standard",
    description:
      "UK agencies and recruiters typically request CVs as .docx files (not PDF) so they can reformat for client submission. WadeCV exports to DOCX as standard.",
  },
];

const HOW_IT_WORKS: { step: number; title: string; detail: string }[] = [
  {
    step: 1,
    title: "Upload your existing CV",
    detail:
      "Paste your current CV text or upload a DOCX file. WadeCV reads your work history, education, and skills. Takes 30 seconds.",
  },
  {
    step: 2,
    title: "Paste the UK job URL",
    detail:
      "Copy the URL from Indeed, Totaljobs, Reed, LinkedIn, or a direct company careers page. WadeCV scrapes the full job description, identifies the required skills, and runs a fit analysis against your CV.",
  },
  {
    step: 3,
    title: "Get your tailored UK CV",
    detail:
      "WadeCV rewrites your CV with the job description's exact keywords, reorders your experience to emphasise what matters most, and formats it to UK standards. Download as DOCX in seconds.",
  },
];

const UK_ATS_EMPLOYERS: {
  ats: string;
  employers: string[];
  notes: string;
}[] = [
  {
    ats: "Workday",
    employers: ["KPMG", "PwC", "Deloitte", "EY", "Rolls-Royce", "Centrica", "Standard Chartered"],
    notes:
      "Workday parses CVs into structured fields. Headers like 'Professional Experience', 'Education', and 'Skills' map cleanly. Avoid tables, columns, and graphics.",
  },
  {
    ats: "SAP SuccessFactors",
    employers: ["Unilever", "BP", "Shell", "BT Group", "Lloyds Banking Group", "Barclays"],
    notes:
      "SAP SuccessFactors weights keyword density. Mirror the job description language precisely — SuccessFactors scores keyword frequency, not just presence.",
  },
  {
    ats: "Oracle Taleo",
    employers: [
      "NHS (many trusts)",
      "HSBC",
      "Vodafone",
      "National Grid",
      "Aviva",
      "Legal & General",
    ],
    notes:
      "Taleo has strict parsing for dates and job titles. Use clear date ranges (MM/YYYY – MM/YYYY), and include your job title exactly as listed — Taleo matches against the posted title.",
  },
  {
    ats: "Greenhouse",
    employers: ["Monzo", "Deliveroo", "Revolut", "GoCardless", "Wise", "Depop", "Bulb"],
    notes:
      "UK tech and fintech scale-ups use Greenhouse. It is less aggressive on keyword matching than enterprise ATS — but reviewers use internal scorecards, so specific skill names still matter.",
  },
  {
    ats: "Lever",
    employers: ["Farfetch", "Ocado", "Ziprecruiter UK", "Typeform UK"],
    notes:
      "Lever stores CVs in a talent pool and surfaces candidates by keyword search. Your CV should include every relevant skill as a term — even skills you consider obvious.",
  },
];

const FAQ = [
  {
    question: "Is WadeCV free to use in the UK?",
    answer:
      "Yes — you get 1 free credit when you sign up, no credit card required. One credit covers a full fit analysis of your CV against a job description. Generating a tailored CV from that analysis is free. Additional credits are available in bundles: 20 for £8, 50 for £12, 100 for £16.",
  },
  {
    question: "What is the difference between a CV and a resume in the UK?",
    answer:
      "In the UK, the document you send for a job application is always called a CV (Curriculum Vitae), regardless of its length or the sector. 'Resume' is the American and Canadian term. The actual format is similar — work history, education, skills — but UK CVs are typically 2 pages for experienced candidates, use A4 format, and never include a photo or personal information like date of birth.",
  },
  {
    question: "How long should a UK CV be?",
    answer:
      "Two pages is the standard for most UK job applicants with more than 3 years of experience. One page is appropriate for recent graduates and career starters. Three pages is sometimes acceptable for very senior roles (Director level and above) with extensive publications or board positions, but rare. Recruiters and hiring managers in the UK review many CVs quickly — two focused pages outperform three padded ones.",
  },
  {
    question: "Should I include a photo on my UK CV?",
    answer:
      "No. Including a photo on a UK CV is unusual and generally not recommended. Under the Equality Act 2010, UK employers should assess candidates on merit, and including a photo may inadvertently create bias (or give the impression you do not understand UK application conventions). The exception is roles where appearance is part of the job requirement — acting or modelling — but even then, a separate portfolio or Spotlight link is more appropriate than embedding a photo in the CV.",
  },
  {
    question: "What do UK employers look for on a CV in 2026?",
    answer:
      "UK hiring managers in 2026 look for: (1) a professional summary tailored to the specific role (not a generic 'I am a motivated professional' opener), (2) quantified achievements — actual numbers showing impact, not just responsibilities, (3) relevant keywords matching the job description (for ATS screening), (4) clear formatting — no graphics, no tables, consistent spacing, (5) correct UK qualifications listed (degree classification, professional certifications), and (6) no unexplained employment gaps. AI CV builders that generate generic templates miss point 1 and 4 entirely.",
  },
  {
    question: "Does WadeCV work with UK jobs on Indeed, Reed, Totaljobs, and LinkedIn?",
    answer:
      "Yes. WadeCV scrapes the full job description from UK job boards including Indeed (uk.indeed.com), Reed, Totaljobs, Linkedin UK, and direct company careers pages (greenhouse.io, lever.co, workday, SAP SuccessFactors). Paste the full job URL into WadeCV and it extracts the description automatically.",
  },
  {
    question: "Will my CV pass UK ATS screening?",
    answer:
      "WadeCV optimises specifically for the ATS systems used by major UK employers: Workday (KPMG, Deloitte, PwC, EY), SAP SuccessFactors (Unilever, BP, Lloyds), Oracle Taleo (HSBC, NHS), and Greenhouse (Monzo, Revolut, Deliveroo). The tailoring process mirrors the job description language, which is the primary factor in ATS keyword scoring. WadeCV also formats CVs in plain text-friendly structures that parse cleanly — no tables, columns, or graphics that confuse parsers.",
  },
  {
    question: "Can I use WadeCV for NHS jobs?",
    answer:
      "Yes. NHS jobs (via jobs.nhs.uk and NHS Trusts' own portals) typically use Oracle Taleo or the NHS Jobs platform. WadeCV can tailor your CV to NHS job descriptions — the process is the same: paste the NHS job URL, and WadeCV aligns your experience with the NHS Person Specification and essential/desirable criteria. For NHS clinical roles (nursing, medical, allied health), WadeCV retains your NMC/GMC registration, clinical competencies, and NHS band context.",
  },
];

export default function FreeCvBuilderUkPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Free AI CV Builder for UK Job Seekers — Tailored to Every Role",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/free-cv-builder-uk`,
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

      <h1 className="text-3xl font-bold mb-4">
        Free AI CV Builder for UK Job Seekers — Tailored to Every Role
      </h1>

      <p className="text-muted-foreground mb-4">
        Most CV builders give you a template. UK employers don&apos;t want templates — they want a
        CV that speaks directly to their job description, uses the right terminology for their
        sector, and passes the ATS that sits between your application and a human reviewer. WadeCV
        tailors your existing CV to every UK role you apply for, free to start.
      </p>
      <p className="text-muted-foreground mb-6">
        Upload your CV once. Paste a job URL from Indeed, Reed, Totaljobs, or LinkedIn. WadeCV
        analyses the job description, identifies the skill and keyword gaps, and rewrites your CV
        with role-specific language, UK-standard formatting, and ATS-optimised structure — in under
        a minute.
      </p>

      <div className="mb-8 rounded-md border border-muted bg-muted/30 p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">Data residency notice:</strong> WadeCV is operated from
        the United States. CV content and account data are stored on Microsoft Azure in the United
        States (Azure East US region). For UK users, this transfer is lawful under UK GDPR Article
        49(1)(b) — necessary for the performance of your contract with WadeCV. You can delete your
        account and all data at any time. See the{" "}
        <Link href="/legal/privacy" className="underline">
          Privacy Policy
        </Link>{" "}
        for details on transfer safeguards and your rights.
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">UK CV vs US resume: 5 key differences</h2>
        <p className="text-sm text-muted-foreground mb-4">
          If you are applying for UK jobs for the first time — or converting from US or
          international applications — these differences matter. WadeCV handles them automatically.
        </p>
        <div className="space-y-3">
          {UK_US_DIFFERENCES.map((d, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex flex-wrap items-center gap-2">
                  <Badge className="text-xs">UK</Badge>
                  {d.uk}
                  <span className="text-muted-foreground font-normal text-sm">
                    vs <span className="line-through opacity-60">{d.international}</span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{d.why}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">How WadeCV builds your UK CV</h2>
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
              <CardContent className="text-sm text-muted-foreground">{step.detail}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">What makes WadeCV right for UK applications</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {UK_FEATURES.map((f) => (
            <Card key={f.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{f.description}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <InlineCta variant="uk" slug="free-cv-builder-uk" />

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Which ATS do major UK employers use?</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Your CV is almost certainly read by an Applicant Tracking System before a human sees it.
          Here are the ATS platforms behind the UK employers most people apply to — and how to
          optimise for each.
        </p>
        <div className="space-y-4">
          {UK_ATS_EMPLOYERS.map((a) => (
            <Card key={a.ats}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {a.ats}
                  <span className="text-sm font-normal text-muted-foreground">
                    — {a.employers.join(", ")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{a.notes}</CardContent>
            </Card>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          WadeCV tailors your CV for the specific ATS behind each role. See the full{" "}
          <Link href="/ats" className="underline">
            ATS optimisation guides
          </Link>{" "}
          for platform-specific formatting rules.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">UK CV format: the essentials for 2026</h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            A strong UK CV in 2026 follows a consistent structure: contact details at the top (name,
            professional email, phone, LinkedIn URL, and optionally your city — no full address),
            followed by a professional summary of 3-5 sentences tailored to the role, then
            professional experience in reverse chronological order, education, and skills.
          </p>
          <p>
            Each position in your work history should include the employer name, your job title,
            dates (Month Year – Month Year), and 3-6 bullet points showing accomplishments rather
            than duties. UK recruiters respond strongly to quantified achievements: cost saved,
            revenue generated, team size, percentage improvements. Bullets starting with action
            verbs — Delivered, Built, Reduced, Led, Negotiated — outperform passive descriptions.
          </p>
          <p>
            Education should list your institution, degree, grade (First, 2:1, 2:2, Pass), and
            graduation year. A-levels and GCSEs are relevant for early-career candidates; for
            experienced professionals, professional certifications (ACCA, CIMA, CIPD, PRINCE2, CIM,
            CFA) often matter more than undergraduate grades.
          </p>
          <p>
            WadeCV handles the structure automatically — your tailored output follows UK formatting
            standards including A4 margins, consistent date formats, and section ordering. You can{" "}
            <Link href="/cv-vs-resume" className="underline">
              read the full CV vs resume guide
            </Link>{" "}
            for more detail on UK versus international differences.
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
        currentCategory="/free-cv-builder-uk"
        contextLinks={[
          {
            href: "/cv-vs-resume",
            label: "CV vs Resume: Full Guide",
          },
          { href: "/ats", label: "ATS Optimisation Guides" },
          { href: "/skills", label: "CV Skills by Role" },
          { href: "/career-change", label: "Career Change CV Guide" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Build your UK CV — tailored to every job, free to start</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your CV, paste a job URL from Indeed, Reed, Totaljobs or LinkedIn, and WadeCV
            creates a tailored, ATS-ready UK CV in under a minute. 1 free credit on signup — no
            credit card needed.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta variant="job" label="Build your UK CV for free" slug="free-cv-builder-uk" />
        </CardContent>
      </Card>
    </article>
  );
}
