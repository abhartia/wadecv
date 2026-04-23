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
  title: "Consulting Resume Guide 2026 — MBB, Big 4 and How to Pass the Screen | WadeCV",
  description:
    "The one-page consulting resume that passes McKinsey, BCG, Bain and Big 4 screens in 2026. Exact structure, quantified bullet formulas, practice-specific keywords, and how MBB differs from Big 4.",
  openGraph: {
    title: "Consulting Resume Guide 2026 — MBB, Big 4 and How to Pass the Screen",
    description:
      "One-page consulting resume structure with quantified bullets and practice-specific keywords. Differences between McKinsey, BCG, Bain and Deloitte / PwC / EY / KPMG.",
  },
  twitter: {
    card: "summary" as const,
    title: "Consulting Resume Guide 2026 — MBB, Big 4",
    description:
      "One-page consulting resume structure with quantified bullets and practice keywords. Free tailoring to any MBB or Big 4 role.",
  },
};

const MBB_VS_BIG4: {
  dimension: string;
  mbb: string;
  big4: string;
}[] = [
  {
    dimension: "Target GPA",
    mbb: "3.7+ / First / 2:1 minimum at target schools; 3.8+ / First at non-target",
    big4: "3.3+ / 2:1 minimum across service lines; 3.7+ for Strategy and Financial Advisory",
  },
  {
    dimension: "Resume length",
    mbb: "One page, no exceptions below Associate Partner / Principal level",
    big4: "One page standard in the US; two pages acceptable in UK / Europe for MBA+",
  },
  {
    dimension: "Bullet quantification bar",
    mbb: "80%+ of bullets have a $, %, time, or scope number",
    big4: "60%+ quantification acceptable; delivery/participation framing allowed for early-career",
  },
  {
    dimension: "Certifications weight",
    mbb: "Optional; Olympiad / patent / publication / athletic spike matters more",
    big4: "CPA, CFA, ACCA, CISA, PMP, SAP / Salesforce / AWS — often effectively required",
  },
  {
    dimension: "Practice vocabulary",
    mbb: "Strategy, operating model, growth, due diligence, digital, transformation",
    big4: "Service-line specific — Audit (SOX, ASC 606), Tax (FIN 48), Tech (SAP, Workday, Salesforce), Risk (ISO 27001)",
  },
  {
    dimension: "'Spike' expectation",
    mbb: "Critical — sustained multi-year commitment, founded venture, Olympiad medal, published research, D1 athletics",
    big4: "Helpful but not required; relevant internship + cert progression replaces spike",
  },
  {
    dimension: "Interview process",
    mbb: "Case interview + Personal Experience Interview (McKinsey PEI); Casey chatbot (BCG); Sova assessment (Bain)",
    big4: "Behavioural + technical (service-line specific) + case for Consulting / Advisory",
  },
];

const RESUME_STRUCTURE: { order: number; section: string; detail: string }[] = [
  {
    order: 1,
    section: "Contact block",
    detail:
      "Name, professional email, phone, LinkedIn URL, city. No full address, no photo, no date of birth, no headshot. For non-US offices, include nationality and work authorisation (e.g. 'UK Citizen', 'EU Blue Card holder', 'OPT eligible through 2027').",
  },
  {
    order: 2,
    section: "Education",
    detail:
      "Institution, degree, classification (First / 2:1 / 3.8 GPA / summa cum laude), relevant coursework, study-abroad term, honours and awards. MBA candidates lead with MBA school, then pre-MBA institution. Experienced hires with 10+ years may move education below professional experience.",
  },
  {
    order: 3,
    section: "Professional experience",
    detail:
      "Reverse chronological. Each role: employer, location, title, dates (Month Year – Month Year or 'Present'). 3-6 bullets per role. Every bullet starts with a strong verb, states scope, describes action, closes with a quantified outcome. MBA and experienced candidates get more bullets per role; undergraduates get fewer.",
  },
  {
    order: 4,
    section: "Leadership & extracurriculars",
    detail:
      "Named role titles (President, VP, Founder, Captain), sustained commitment (multi-year), and measurable outcomes. This is the 'Entrepreneurial Drive' and 'Grit' signal section. Weak: 'Member, Consulting Club.' Strong: 'Co-founded Consulting Club; grew membership from 20 to 180 over 2 years; secured sponsorship from 4 MBB firms for case-prep sessions.'",
  },
  {
    order: 5,
    section: "Additional",
    detail:
      "Languages (with proficiency: native / fluent / professional / conversational), technical skills (specific tools — Stata, Alteryx, Tableau, Python — not generic 'Microsoft Office'), certifications (CFA Level 2, CAIA, Series 7, AWS Solutions Architect), publications, patents, Olympiad medals, athletic achievements, military service. At MBB this is where your 'spike' lives; at Big 4 this is where certifications live.",
  },
];

const BULLET_FORMULAS: {
  title: string;
  formula: string;
  example: string;
}[] = [
  {
    title: "Scope + Action + Quantified Outcome",
    formula:
      "[Strong verb] [engagement type / project scope] for [client description]; [action / methodology]; delivering [quantified outcome].",
    example:
      "Led 4-person workstream on commercial due diligence for £400M PE-backed industrial target; built 3-year revenue build-up across 6 European markets; identified €28M EBITDA upside that informed final investment committee decision.",
  },
  {
    title: "MBB Strategy Bullet",
    formula:
      "[Verb] [strategic output] for [industry / client size]; [analytical methodology]; adopted by [senior stakeholder] and [business outcome].",
    example:
      "Designed three-year go-to-market strategy for $1.2B Fortune 500 healthcare client; synthesised 40+ expert interviews and 12 market analyses into five growth initiatives; plan adopted by CEO and Board and launched across 8 regions.",
  },
  {
    title: "Private Equity Due Diligence Bullet",
    formula:
      "[Supported / led / delivered] [DD type] for [deal size / sector] LBO target; built [model type]; identified [number] value-creation levers worth [£/$ combined].",
    example:
      "Led commercial due diligence on $850M take-private of consumer staples target; built 5-year revenue model across 4 categories; quantified 6 value-creation levers (pricing, SKU rationalisation, digital, private label, logistics, HQ cost) worth $62M EBITDA combined.",
  },
  {
    title: "Technology / Implementation Bullet",
    formula:
      "[Verb] [system / module] [implementation type] for [client scope]; coordinated [team detail]; delivered [outcome with metric].",
    example:
      "Led SAP S/4HANA RISE greenfield go-live for 12,000-user industrial client; coordinated 8-person Deloitte team and 20-person SAP implementation partner; delivered on plan with zero Severity-1 defects in first 30 days and 94% user-satisfaction score.",
  },
  {
    title: "Digital / Analytics Bullet",
    formula:
      "[Verb] [ML model / data product] for [business problem]; [technical approach]; deployed to [production scope] and delivered [business KPI].",
    example:
      "Built XGBoost churn-prediction model for B2B SaaS client with 2M users; engineered 84 features from CRM, product-usage and billing data; deployed to production via AWS SageMaker and drove 18% reduction in logo churn in first two quarters.",
  },
  {
    title: "Audit / Controls Bullet",
    formula:
      "[Verb] [testing type] over [scope] for [client type / industry]; identified [number] [finding type]; delivered [regulatory / remediation outcome].",
    example:
      "Led ICFR testing over revenue and accounts-receivable cycles for $4.2B-revenue NYSE-listed retail client under ASC 606; identified 3 material deficiencies and 7 significant deficiencies; coordinated remediation plan adopted by Audit Committee.",
  },
];

const MBB_FIRMS: {
  slug: string;
  name: string;
  tagline: string;
  distinctive: string;
}[] = [
  {
    slug: "mckinsey",
    name: "McKinsey & Company",
    tagline: "Hypothesis-driven, insight-led, PEI gate",
    distinctive:
      "Distinctive Traits framework (Personal Impact, Entrepreneurial Drive, Inclusive Leadership, Courageous Change), Solve problem-solving game, and the Personal Experience Interview.",
  },
  {
    slug: "bcg",
    name: "BCG",
    tagline: "Impact-oriented, unit-specific (BCG X, Gamma, Platinion)",
    distinctive:
      "Casey chatbot assessment, unit-based recruiting (Strategy, BCG X for digital build, Gamma for AI, Platinion for enterprise architecture), and the Vignette behavioural interview.",
  },
  {
    slug: "bain",
    name: "Bain & Company",
    tagline: "Commercial, PEG-heavy, results-focused",
    distinctive:
      "True North values (Passion, Straight Talk, Outsider Outlook, Grit, Tugboat Spirit), Sova psychometric assessment, and PEG as a separate recruiting pipeline in most offices.",
  },
];

const BIG4_FIRMS: {
  name: string;
  slug?: string;
  serviceLines: string[];
  distinctive: string;
}[] = [
  {
    name: "Deloitte",
    slug: "deloitte",
    serviceLines: [
      "Consulting (Monitor Deloitte, S&A, Human Capital, Tech, Customer)",
      "Audit & Assurance",
      "Tax",
      "Risk & Financial Advisory",
      "Deloitte Digital",
    ],
    distinctive:
      "Largest Big 4 globally; highest Consulting revenue share; Monitor Deloitte competes with MBB for strategy talent.",
  },
  {
    name: "PwC",
    serviceLines: [
      "Advisory / Consulting (Strategy&, Management Consulting, Technology)",
      "Assurance",
      "Tax",
      "Deals (M&A, restructuring, forensics)",
    ],
    distinctive:
      "Strategy& is the former Booz & Company, acquired 2014; strong Deals practice; heavy UK/Europe footprint.",
  },
  {
    name: "EY",
    serviceLines: [
      "Consulting",
      "Assurance",
      "Tax",
      "Strategy and Transactions (SaT)",
      "People Advisory Services",
    ],
    distinctive:
      "Strategy and Transactions is one of the strongest M&A advisory practices in Big 4; EY-Parthenon is the strategy arm.",
  },
  {
    name: "KPMG",
    serviceLines: ["Advisory / Consulting", "Audit", "Tax", "Deal Advisory"],
    distinctive:
      "Audit-heavier revenue mix than other Big 4; strong in regulated industries (banking, insurance, public sector).",
  },
];

const PRACTICES: { name: string; keywords: string[]; bulletSignals: string }[] = [
  {
    name: "Strategy",
    keywords: [
      "market entry",
      "growth strategy",
      "operating model",
      "corporate strategy",
      "portfolio review",
      "competitive positioning",
    ],
    bulletSignals:
      "Three-year plans, C-suite adoption, market-sizing models, strategic-option evaluation.",
  },
  {
    name: "Operations",
    keywords: [
      "cost transformation",
      "zero-based budgeting",
      "lean",
      "supply chain",
      "procurement",
      "footprint optimisation",
    ],
    bulletSignals:
      "£M savings delivered, wave-based implementation, Lean Six Sigma certification, procurement savings %, factory productivity.",
  },
  {
    name: "Digital & Advanced Analytics",
    keywords: [
      "digital transformation",
      "cloud migration",
      "MLOps",
      "advanced analytics",
      "AI / GenAI",
      "data platform",
    ],
    bulletSignals:
      "Production ML models, cloud migration GoLive dates, data-platform adoption %, LLM pilots and ROI.",
  },
  {
    name: "Private Equity / Due Diligence",
    keywords: [
      "commercial due diligence",
      "value-creation plan",
      "LBO",
      "market growth",
      "red-flag issues",
      "synergy",
    ],
    bulletSignals:
      "Deal size, sector, EBITDA value-creation quantified, investment-committee adoption.",
  },
  {
    name: "Customer & Marketing",
    keywords: [
      "customer experience",
      "pricing",
      "revenue growth management",
      "CRM",
      "personalisation",
      "brand strategy",
    ],
    bulletSignals:
      "NPS uplift, conversion-rate improvement, pricing-programme EBITDA, churn reduction.",
  },
  {
    name: "Risk, Cyber & Regulatory",
    keywords: [
      "cyber resilience",
      "ISO 27001",
      "NIST CSF",
      "regulatory compliance",
      "third-party risk",
      "controls assurance",
    ],
    bulletSignals:
      "Framework certifications, audit readiness, breach-response led, regulatory remediation delivered.",
  },
];

const COMMON_MISTAKES = [
  "Two-page resume for any pre-Partner consulting application — automatic screen reject at MBB, dispreferred at Big 4",
  "Responsibility-based bullets ('responsible for', 'managed', 'supported') instead of outcome-based ones with numbers",
  "Missing or absent GPA when it is above 3.7 — screeners interpret absence as sub-threshold",
  "Generic 'consulting' framing when the role is a specific practice (MBB unit: BCG X vs Strategy; Big 4 service line: Monitor Deloitte vs Technology Consulting)",
  "Weak 'spike' section — extracurriculars listed without role title, duration, or outcome",
  "Missing language proficiency levels for non-English-speaking offices (London-EU, Dubai, Singapore, Sao Paulo, Tokyo)",
  "Skills section with generic tools ('Microsoft Office, teamwork') rather than specific fluencies (Alteryx, Tableau, Python for data science, advanced Excel financial modelling)",
  "No certifications for Big 4 Audit, Tax or Risk applications — CPA / CFA / ACCA / CISA / PMP / AWS progression should be visible",
];

const FAQ = [
  {
    question: "How long should a consulting resume be?",
    answer:
      "One page for every MBB application below Associate Partner / Principal level, and standard for Big 4 in the US across all levels. Two pages are accepted in UK / Europe at Big 4 MBA-level and above, and at MBB Partner-and-above level, but only if every additional bullet adds substance. A two-page resume for an Associate, Consultant or Business Analyst role at MBB is an automatic screen reject. Use 10-11pt body text, 0.5-inch margins, and cut ruthlessly.",
  },
  {
    question: "What is the difference between an MBB and Big 4 resume?",
    answer:
      "Structurally almost identical: one page, education first, reverse chronological experience, leadership, additional information. The bar differs: MBB requires 80%+ of bullets to have a $, %, time, or scope number; Big 4 accepts 60%+ quantification with delivery-framing for early-career. Vocabulary differs: MBB favours 'hypothesis', 'framework', 'synthesis', 'impact', 'growth'; Big 4 is service-line specific ('SOX 404' for Audit, 'SAP S/4HANA' for Tech, 'ASC 606' for accounting). And MBB weights 'spike' (Olympiad, D1 athletics, startup, publication) while Big 4 weights certifications (CPA, CFA, ACCA, CISA, AWS).",
  },
  {
    question: "What GPA do I need for MBB?",
    answer:
      "McKinsey, BCG and Bain do not publish cut-offs but in practice competitive resumes from target schools need 3.7+ GPA / First Class / 2:1 minimum. Non-target-school candidates need 3.8+ / First plus a standout spike (Olympiad, patent, venture, D1 athletics, published research). If your GPA is below 3.5 / lower 2:1, emphasise strong standardised test scores (GMAT 730+, GRE 330+), higher major GPA if applicable, or a Master's degree with distinction to compensate. Do not hide your GPA — screeners interpret absence as sub-threshold.",
  },
  {
    question: "How do I tailor a consulting resume for a specific practice?",
    answer:
      "Read the firm's Insights page for the practice (McKinsey Insights, BCG Publications, Bain Insights) and note the vocabulary, frameworks, and client industries featured. Rewrite your bullets to use that vocabulary when honestly applicable — e.g. 'operating model redesign', 'zero-based budgeting', 'go-to-market strategy', 'commercial due diligence', 'LLM fine-tuning'. Move the most relevant experience to the top of your professional experience section even if it is not the most recent. See the individual firm guides for specific McKinsey, BCG, Bain, and Deloitte tailoring details.",
  },
  {
    question: "Is Monitor Deloitte / Strategy& / EY-Parthenon as selective as MBB?",
    answer:
      "These are the strategy arms of Big 4: Monitor Deloitte (Deloitte), Strategy& (PwC), EY-Parthenon (EY). They interview many of the same MBA candidates as MBB, and the resume expectations mirror MBB — one page, quantified bullets, spike in the additional section, practice-specific vocabulary. Acceptance rates differ (MBB is more selective at entry level) but the screen bar is closer to MBB than to general Big 4 Consulting. Tailor your CV to MBB standard when applying to these practices.",
  },
  {
    question: "What keywords matter most on a consulting resume?",
    answer:
      "Action verbs that signal ownership: led, built, launched, scaled, negotiated, founded, grew, delivered, drove. Outcome-type language: 'delivering $X savings', 'growing revenue Y%', 'reducing cost Z%', 'shortening time-to-market W months'. Practice-specific vocabulary when truthfully applicable — 'operating model', 'go-to-market', 'due diligence', 'cost transformation', 'digital transformation', 'customer experience', 'ML model'. Named tools for the skills section: Excel (financial modelling), PowerPoint, Tableau, Alteryx, Python, R, SQL, Stata, and certification names (CFA Level 2, AWS Solutions Architect, CPA candidate).",
  },
  {
    question: "Can I break into consulting from a non-traditional background?",
    answer:
      "Yes. MBB and Big 4 Consulting recruit military officers, PhDs (STEM, humanities, social sciences), MDs, JDs, and experienced industry professionals through dedicated pathways. The resume still needs quantified bullets, leadership evidence, and practice signalling — but the narrative can be functional (deep expertise in a vertical) rather than traditional (top-school undergrad to MBB). Common successful pivots: military → McKinsey Implementation; PhD biology → McKinsey / ZS healthcare; industry Product Manager → BCG X / Gamma; Banking VP → Bain PEG. Tailor the CV to signal the relevant consulting practice.",
  },
  {
    question: "What are the most common reasons consulting resumes get rejected?",
    answer:
      "(1) Responsibility-based bullets without numbers. (2) Two-page resume for an Associate, Consultant or BA role. (3) Missing or weak 'spike' — the distinctive signal partners look for in the additional section. (4) Generic 'consulting' framing when the role is a specific practice or service line. (5) Missing language proficiency for non-English-speaking offices. (6) No certifications or certification progression for Big 4 Audit, Tax, or Risk Advisory. (7) Skills section with generic tools rather than specific fluencies. WadeCV takes your existing CV, aligns it with a specific McKinsey, BCG, Bain, or Big 4 job description, and fixes each of these failure patterns in one pass.",
  },
];

export default function ConsultingResumePage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Consulting Resume Guide 2026 — MBB, Big 4 and How to Pass the Screen",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/consulting-resume`,
            },
            datePublished: "2026-04-20",
            dateModified: "2026-04-20",
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
        Consulting Resume Guide 2026 — MBB, Big 4 and How to Pass the Screen
      </h1>

      <p className="text-muted-foreground mb-4">
        Consulting resumes are screened by partners in under 60 seconds. The bar is high, the
        conventions are specific, and the difference between a McKinsey-style one-page CV and a
        Deloitte Audit CV is not cosmetic — it is structural. This guide covers the exact page
        structure partners expect, the bullet formulas that pass MBB and Big 4 screens, the
        vocabulary you need per practice, and the common reasons otherwise strong candidates get
        rejected at CV review.
      </p>
      <p className="text-muted-foreground mb-6">
        Read it top-to-bottom if you are preparing applications, or jump to the firm you are
        targeting —{" "}
        <Link href="/company-resume/mckinsey" className="underline">
          McKinsey
        </Link>
        ,{" "}
        <Link href="/company-resume/bcg" className="underline">
          BCG
        </Link>
        ,{" "}
        <Link href="/company-resume/bain" className="underline">
          Bain
        </Link>
        ,{" "}
        <Link href="/company-resume/deloitte" className="underline">
          Deloitte
        </Link>{" "}
        — for firm-specific tailoring.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          The one-page consulting resume: exact structure
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Every section in this order. No deviations for pre-Principal / pre- Partner applications.
          The partner reviewing your CV reads top-down and expects to find the information in the
          canonical position.
        </p>
        <div className="space-y-3">
          {RESUME_STRUCTURE.map((s) => (
            <Card key={s.order}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {s.order}
                  </span>
                  {s.section}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{s.detail}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">MBB vs Big 4: 7 screening differences</h2>
        <p className="text-sm text-muted-foreground mb-4">
          MBB (McKinsey, BCG, Bain) and Big 4 (Deloitte, PwC, EY, KPMG) share the one-page
          structure, but their screening bars differ in specific ways. Tailor accordingly.
        </p>
        <div className="space-y-3">
          {MBB_VS_BIG4.map((d, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex flex-wrap items-center gap-2">
                  <Badge className="text-xs">{d.dimension}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>
                  <span className="text-foreground font-medium">MBB:</span> {d.mbb}
                </div>
                <div>
                  <span className="text-foreground font-medium">Big 4:</span> {d.big4}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">The MBB firms: McKinsey, BCG, Bain</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Resume structure is identical across MBB. Vocabulary, screening tools, and
          &apos;spike&apos; expectations differ — click through for firm- specific guides.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {MBB_FIRMS.map((f) => (
            <Link key={f.slug} href={`/company-resume/${f.slug}`} className="block group">
              <Card className="h-full transition-colors group-hover:bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base group-hover:text-primary">{f.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{f.tagline}</p>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{f.distinctive}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <InlineCta variant="consulting" slug="consulting-resume" />

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">The Big 4: Deloitte, PwC, EY, KPMG</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Big 4 firms are organised by service line rather than by case vs non-case. Your resume
          must signal the specific service line and offering — a generic &apos;Big 4 Advisory&apos;
          framing is a common reason for rejection.
        </p>
        <div className="space-y-4">
          {BIG4_FIRMS.map((f) => (
            <Card key={f.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {f.slug ? (
                    <Link
                      href={`/company-resume/${f.slug}`}
                      className="underline hover:text-primary"
                    >
                      {f.name}
                    </Link>
                  ) : (
                    f.name
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>
                  <span className="text-foreground font-medium">Service lines:</span>{" "}
                  {f.serviceLines.join(" · ")}
                </div>
                <div>{f.distinctive}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Six bullet formulas that pass partner screens
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Each formula is tested against a specific screening pattern — MBB strategy, PE due
          diligence, technology implementation, advanced analytics, audit, or generic consulting.
          Use the one that matches the target role.
        </p>
        <div className="space-y-4">
          {BULLET_FORMULAS.map((b, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{b.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div className="text-xs text-foreground font-mono bg-muted/50 rounded p-2">
                  {b.formula}
                </div>
                <div className="italic">{b.example}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Practice-specific keywords: what to mirror</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Consulting firms organise around practices (Strategy, Operations, Digital, PEG, Customer,
          Risk) and your CV should mirror the vocabulary of the target practice wherever it is
          honestly applicable.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {PRACTICES.map((p) => (
            <Card key={p.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {p.keywords.map((k) => (
                    <Badge key={k} variant="secondary" className="text-xs">
                      {k}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs">
                  <span className="text-foreground font-medium">Bullet signals:</span>{" "}
                  {p.bulletSignals}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Consulting resume in 2026: what&apos;s changed
        </h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            Consulting CV screening in 2026 is more automated than it was five years ago but the bar
            the partner applies has not relaxed. Tools like BCG&apos;s Casey chatbot and Bain&apos;s
            Sova psychometric assessment sit between the CV screen and the first case interview, but
            neither rescues a weak CV — the resume remains the gatekeeper across MBB and Big 4.
          </p>
          <p>
            What has changed is the weight on digital and GenAI signals. BCG X, BCG Gamma, McKinsey
            QuantumBlack, Deloitte Digital and Deloitte ConvergeHEALTH recruit more heavily than
            ever for candidates with shipped production experience: deployed ML models, cloud
            migrations with measurable KPIs, LLM pilots with ROI, data-platform adoption
            percentages. If you have worked on any of these and are targeting a digital practice,
            lead with them rather than traditional strategy bullets.
          </p>
          <p>
            AI detection on submitted resumes is not yet widespread among consulting firms, but
            AI-assisted CV writing creates a different problem: bullets that sound generic enough to
            survive ATS but lack the practice-specific texture partners read for. Humanising an
            AI-drafted CV with firm and practice vocabulary, real numbers from your history, and the
            correct section structure is essential. See our{" "}
            <Link href="/humanize-ai-resume" className="underline">
              humanize AI resume guide
            </Link>{" "}
            for techniques that work at consulting screening scale.
          </p>
          <p>
            Finally: the rise of internal-mobility consulting offers. Deloitte, PwC, EY and KPMG
            increasingly move Audit Seniors into Consulting without an external application. If you
            are at Big 4 considering this path, your internal CV should emphasise client-delivery
            outcomes, industry focus, and certification progression — the same way an external
            candidate would tailor.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Eight common consulting resume mistakes</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
          {COMMON_MISTAKES.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
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
        currentCategory="/consulting-resume"
        contextLinks={[
          {
            href: "/company-resume/mckinsey",
            label: "McKinsey Resume Guide",
          },
          { href: "/company-resume/bcg", label: "BCG Resume Guide" },
          { href: "/company-resume/bain", label: "Bain Resume Guide" },
          {
            href: "/company-resume/deloitte",
            label: "Deloitte Resume Guide",
          },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Tailor your CV to a specific MBB or Big 4 role — free to start</CardTitle>
          <p className="text-sm text-muted-foreground">
            Paste a McKinsey, BCG, Bain, Deloitte, PwC, EY or KPMG job URL. WadeCV analyses the
            practice, the level, and the job description, then rewrites your CV with quantified
            bullets, practice-specific keywords, and the one-page consulting format partners expect.
            1 free credit on signup — no credit card needed.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta
            variant="company"
            label="Tailor your consulting CV for free"
            slug="consulting-resume"
          />
        </CardContent>
      </Card>
    </article>
  );
}
