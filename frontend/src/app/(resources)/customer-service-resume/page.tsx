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
  title: "Customer Service Resume Guide 2026 — Skills, Bullets & Templates by Role | WadeCV",
  description:
    "The complete customer service resume in 2026: 40+ skills, 16 bullet examples, role-by-role templates from Agent to Director of CX, the metrics that matter (CSAT, FCR, AHT) and the platforms (Zendesk, Salesforce, Intercom) recruiters search for.",
  openGraph: {
    title: "Customer Service Resume Guide 2026 — Skills, Bullets & Templates by Role",
    description:
      "Customer service resume by role: Agent, Senior, Team Lead, CSM, Manager and Director. Skills, bullets, CSAT/NPS/FCR metrics, platform vocabulary (Zendesk, Salesforce, Intercom), and free CV tailoring.",
  },
  twitter: {
    card: "summary" as const,
    title: "Customer Service Resume Guide 2026",
    description:
      "Skills, bullets and templates for every customer service role from Agent to Director of CX. Free tailoring to any support job description.",
  },
};

const RESUME_STRUCTURE: { order: number; section: string; detail: string }[] = [
  {
    order: 1,
    section: "Headline / Professional summary",
    detail:
      "3-4 line summary that states your role level (Agent, Senior, Team Lead, CSM, Manager), years of experience, primary channel (phone, chat, email, omnichannel), and your top two metrics (CSAT, FCR, AHT, NPS, retention rate). Recruiters scan this in under 6 seconds — surface the numbers immediately.",
  },
  {
    order: 2,
    section: "Core skills / Technical proficiencies",
    detail:
      "A 6-12 item block of named platforms and named methodologies. Be specific: 'Zendesk Support, Guide, Talk and Explore' beats 'help desk software'; 'Salesforce Service Cloud, Lightning console, Omni-Channel routing' beats 'CRM'. Add languages (with CEFR proficiency for non-English-speaking markets) and certifications (HDI, ITIL Foundation, KCS Practices v6, Salesforce Service Cloud Consultant).",
  },
  {
    order: 3,
    section: "Professional experience",
    detail:
      "Reverse chronological. Each role: employer, location, title, dates, and 4-6 bullets. Every bullet contains volume (tickets/day, contacts/week), quality (CSAT, NPS, FCR, QA score), AND impact (handle-time reduction, retention, expansion ARR, training delivered). 'Helped customers' is an automatic deprioritisation; 'Resolved 78 tickets/day at 4.7/5 CSAT and 86% FCR across 3 channels' is a screening pass.",
  },
  {
    order: 4,
    section: "Tools, certifications & languages",
    detail:
      "List every helpdesk, CRM, ticketing, contact-centre, telephony, QA, workforce-management, and knowledge-base tool you have used. Add certifications (HDI Customer Service Representative, HDI Support Center Analyst, ITIL 4 Foundation, Salesforce Service Cloud Consultant, Lean Six Sigma Yellow / Green Belt). Add languages with proficiency — multilingual support is a separate budgeted line in many contact centres.",
  },
  {
    order: 5,
    section: "Education & additional",
    detail:
      "Education: degree, institution, dates. Additional: volunteer crisis-line work, community moderation, peer-mentor programmes, training-content authoring. For senior roles (Manager / Director / VP CX), this section can include conference talks, published case studies, or service-design publications.",
  },
];

const ROLE_BENCHMARKS: { role: string; metrics: string; vocabulary: string }[] = [
  {
    role: "Customer Service Agent / Representative",
    metrics: "60-100 contacts/day · CSAT 4.5+/5 · FCR 80%+ · QA score 90%+",
    vocabulary:
      "Tier 1 support, queue, macro, tag, ticket, channel, SLA, escalation, knowledge base, refund flow, returns, deflection",
  },
  {
    role: "Senior Agent / Specialist (Tier 2)",
    metrics: "Complex-case ownership · CSAT 4.6+/5 · FCR 85%+ · 0-2 escalations/week to Tier 3",
    vocabulary:
      "Tier 2 escalation, root-cause analysis, bug triage, billing reconciliation, KCS author, peer mentor, macro author",
  },
  {
    role: "Team Lead / Supervisor",
    metrics: "Team of 6-12 agents · Team CSAT 4.5+/5 · Team FCR 80%+ · Adherence 95%+",
    vocabulary:
      "Coaching plan, QA calibration, 1:1 cadence, shrinkage, schedule adherence, real-time queue management, side-by-side coaching",
  },
  {
    role: "Customer Success Manager (CSM)",
    metrics: "Book of 30-80 accounts or $2-15M ARR · NRR 110%+ · GRR 92%+ · Logo churn <5%",
    vocabulary:
      "Onboarding, QBR, EBR, success plan, health score, account expansion, multi-thread, executive sponsor, renewal forecast",
  },
  {
    role: "Customer Service / Support Manager",
    metrics: "Function-wide CSAT, FCR, AHT, NPS · 20-60 headcount · Forecast accuracy 90%+",
    vocabulary:
      "Headcount planning, capacity forecast, WFM, attrition, hiring funnel, tooling roadmap, vendor management, BPO",
  },
  {
    role: "Director / VP of Customer Experience",
    metrics:
      "Org-wide CX scorecard · CSAT, NPS, CES movement · Cost-to-serve · Cross-functional VOC",
    vocabulary:
      "Service design, journey mapping, voice-of-customer programme, NPS detractor recovery, P&L ownership, board-level CX reporting",
  },
];

const BULLET_FORMULAS: {
  title: string;
  formula: string;
  example: string;
}[] = [
  {
    title: "Volume + Quality + Channel (Agent / CSR)",
    formula:
      "[Resolved / handled] [N contacts] per [day / week] across [channels]; sustained [CSAT / NPS / QA score] and [FCR rate].",
    example:
      "Resolved 78 customer contacts per day across phone, email and Zendesk live chat; sustained 4.7/5 CSAT, 86% first-contact resolution and 92% QA score over 14 consecutive months.",
  },
  {
    title: "Improvement + Scope (Process / Tooling)",
    formula:
      "[Identified / built / launched] [process / macro / KB article / automation] for [pain point]; reduced [AHT / repeat contacts / escalations] by [X%] across [scope].",
    example:
      "Authored 24 Zendesk macros and 11 KCS knowledge-base articles for billing-and-refund flows; reduced average handle time on those topics by 31% and cut tier-2 escalations by 22% across a team of 18.",
  },
  {
    title: "De-escalation + Retention",
    formula:
      "[Owned / resolved] [N high-risk / churn-flagged accounts] per [period]; [retention / save / expansion outcome] worth [$ / % of ARR].",
    example:
      "Owned a churn-flagged book of 28 mid-market SaaS accounts ($1.4M ARR); ran 60-day save-plan playbook and retained 25 of 28 accounts, preserving $1.27M ARR and surfacing 3 expansion opportunities worth $340K.",
  },
  {
    title: "Customer Success / NRR Bullet",
    formula:
      "[Verb] book of [N accounts / $X ARR] across [segment]; delivered [NRR / GRR / expansion] of [X%]; [adoption / outcome / commercial signal].",
    example:
      "Managed a book of 42 enterprise SaaS accounts representing $11.8M ARR; delivered 124% NRR and 96% GRR over fiscal 2025 by running quarterly EBRs, building 12-month success plans and multi-threading C-suite sponsors at 38 of 42 accounts.",
  },
  {
    title: "Team Lead / Coaching Bullet",
    formula:
      "[Led / coached] team of [N agents] across [shifts / regions]; lifted [team metric] from [X] to [Y] in [period] via [coaching / WFM / QA mechanism].",
    example:
      "Led a team of 11 omnichannel agents across US/EMEA shifts; lifted team CSAT from 4.3 to 4.7 and FCR from 74% to 86% in 6 months through weekly QA calibration, 1:1 coaching plans and a side-by-side Tier 2 escalation programme.",
  },
  {
    title: "Voice-of-Customer / Cross-Functional Bullet",
    formula:
      "[Identified / surfaced] [pattern / theme] from [N tickets / surveys]; partnered with [Product / Eng / Ops] to ship [fix]; [contact-rate / NPS / CSAT impact].",
    example:
      "Identified the top 5 contact drivers from 14,000 quarterly tickets and partnered with Product and Engineering to ship 4 fixes (refund flow, password reset, mobile crash, payment retry); reduced repeat contact rate by 27% and lifted product NPS by 9 points in two quarters.",
  },
];

const PLATFORM_CLUSTERS: {
  cluster: string;
  tools: string[];
  signal: string;
}[] = [
  {
    cluster: "Helpdesk & ticketing",
    tools: [
      "Zendesk (Support, Guide, Talk, Explore)",
      "Salesforce Service Cloud + Lightning console",
      "Intercom (Inbox, Articles, Resolution Bot, Fin AI)",
      "Freshdesk / Freshchat",
      "HubSpot Service Hub",
      "Front (shared inbox)",
      "Help Scout, Kustomer, Gorgias",
      "ServiceNow ITSM (Customer Service Management)",
    ],
    signal:
      "Name the modules — 'Zendesk Support + Guide + Explore' beats 'Zendesk' alone. Recruiters search for module-specific experience.",
  },
  {
    cluster: "Contact-centre & telephony",
    tools: [
      "Genesys Cloud, Genesys Engage",
      "NICE CXone, NICE inContact",
      "Five9, Talkdesk, Avaya, Cisco UCCX",
      "Aircall, Dialpad, RingCentral Contact Center",
      "Twilio Flex (engineered contact-centre)",
      "AWS Connect",
    ],
    signal:
      "Telephony tools signal voice-channel scale. Pair with WFM ('NICE WFM, Verint, Calabrio, Assembled') for forecasting credibility.",
  },
  {
    cluster: "Customer success platforms",
    tools: [
      "Gainsight (CS, PX, Renewal Center)",
      "ChurnZero",
      "Totango, Catalyst, Vitally",
      "Planhat",
      "HubSpot Customer Success",
    ],
    signal:
      "CS platforms signal NRR / GRR / health-score literacy. Lead with the renewal-forecast or expansion outcome that the platform powered.",
  },
  {
    cluster: "Quality, knowledge & WFM",
    tools: [
      "Klaus, MaestroQA, Stella Connect (QA)",
      "Guru, Slab, Notion, Confluence (knowledge)",
      "Calabrio, Verint, NICE WFM, Assembled (workforce management)",
      "KCS v6 Practices",
    ],
    signal:
      "QA + KCS + WFM is the Senior / Lead vocabulary stack. Adding 'KCS v6 Practices' is a leading signal for Knowledge Manager / Director CX roles.",
  },
  {
    cluster: "AI / automation in support",
    tools: [
      "Intercom Fin AI",
      "Zendesk AI / Advanced AI",
      "Ada, Forethought, Ultimate.ai (AI deflection)",
      "Decagon (AI agents)",
      "Cresta (real-time agent assist)",
    ],
    signal:
      "2026 differentiator. If you have shipped or operated an AI deflection programme, lead with the deflection-rate, ROI and CSAT delta — these signals win Senior / Manager / Director screens.",
  },
  {
    cluster: "Commerce & vertical-specific",
    tools: [
      "Shopify + Gorgias (e-commerce)",
      "Stripe Radar, Adyen (fintech disputes)",
      "Epic / Cerner messaging (healthcare)",
      "ServiceTitan / FieldEdge (field-service)",
      "Salesforce Health Cloud / Financial Services Cloud",
    ],
    signal:
      "Vertical-stack literacy reframes generic support experience as industry expertise. Useful when pivoting from B2C retail to B2B SaaS or fintech support.",
  },
];

const METRICS = [
  {
    metric: "CSAT (Customer Satisfaction)",
    detail:
      "Post-interaction survey, usually 1-5 or 1-10. Baseline 4.3-4.5/5 in mature contact centres; 4.7+ is a top-quartile signal. Always pair with sample size if survey response rate is below 30%.",
  },
  {
    metric: "NPS (Net Promoter Score)",
    detail:
      "Likelihood-to-recommend scale, -100 to +100. Used post-onboarding, post-renewal, or annually. Tech / SaaS benchmark 30-50; e-commerce 40-60; B2B enterprise 50-70. Movement (+8, +12) is more screening-relevant than absolute.",
  },
  {
    metric: "CES (Customer Effort Score)",
    detail:
      "How hard it was to get the issue resolved, 1-5 or 1-7. Lower is better. Replacing 'CSAT' with 'CES' on a resume in 2026 signals familiarity with effort-driven service design and Gartner's CEB framework.",
  },
  {
    metric: "FCR (First-Contact Resolution)",
    detail:
      "% of cases resolved without a follow-up. Strong contact centres run 75-85%. Sub-70% on a CV reads as a process-design problem; 85%+ reads as senior agent or specialist quality.",
  },
  {
    metric: "AHT (Average Handle Time)",
    detail:
      "Voice or chat duration. Use only with quality context — 'reduced AHT 28% while holding CSAT at 4.7/5' is a signal; AHT improvement alone is not (could mean rushed cases).",
  },
  {
    metric: "NRR / GRR (Net & Gross Revenue Retention)",
    detail:
      "CSM and Account Manager metric. NRR = (start ARR + expansion - churn - contraction) / start ARR. GRR strips out expansion. SaaS benchmark NRR 105-120%, GRR 88-92%. Lead the CSM resume with NRR if it is above 110%.",
  },
];

const COMMON_MISTAKES = [
  "Bullets that say 'helped customers' or 'answered questions' without volume, channel, quality metric, or impact",
  "No CRM / helpdesk tools listed — recruiters use boolean search ('Zendesk' AND 'Salesforce') and a CV with neither is invisible",
  "CSAT score quoted without sample size or time window — 'CSAT 4.9' over 12 surveys is not the same as 4.9 over 12,000",
  "Generic 'CRM' or 'help desk software' instead of named platforms (Zendesk, Salesforce Service Cloud, Intercom, Freshdesk)",
  "Missing channel mix — phone-only, chat-only, omnichannel and async support are different roles with different vocabulary",
  "No metrics in the professional summary — recruiters skim summary first; volume / CSAT / FCR / NPS belong there",
  "CSM resume that omits NRR, GRR, logo churn, or book size in $ARR — these are the four numbers that screen at every CSM interview",
  "Manager / Director resume framed at agent-level (CSAT-only) rather than function-level (forecast accuracy, attrition, cost-to-serve, P&L)",
];

const FAQ = [
  {
    question: "What are the most important metrics to put on a customer service resume?",
    answer:
      "For agents and specialists: CSAT (4.5+/5), FCR (80%+), AHT (paired with quality context), QA score, contact volume per day. For team leads: team CSAT, team FCR, schedule adherence (95%+), and attrition. For CSMs: NRR (110%+), GRR (90%+), logo churn (<5%), and book size in $ARR or account count. For managers and directors: function-wide CSAT/NPS/CES movement, cost-to-serve, attrition, hiring funnel, and forecast accuracy. Always pair the metric with a sample size, time window or scope so the screener can interpret it.",
  },
  {
    question: "Which CRM and helpdesk tools should I list on my customer service CV?",
    answer:
      "List every platform you have used in production, with the modules where you can — 'Zendesk Support, Guide, Explore' is stronger than 'Zendesk'. The high-frequency recruiter search terms in 2026 are Zendesk, Salesforce Service Cloud, Intercom, Freshdesk, HubSpot Service Hub, Gorgias, Front, Help Scout, Kustomer, ServiceNow CSM, Genesys, NICE CXone and Five9. For customer success roles, add Gainsight, ChurnZero, Totango, Catalyst or Vitally. For AI-deflection experience, add Intercom Fin, Zendesk AI, Ada, Forethought, Ultimate.ai or Decagon. Recruiters use boolean search — list named tools, not categories.",
  },
  {
    question:
      "How do I write a customer service resume bullet that passes ATS and recruiter screens?",
    answer:
      "Use the volume + quality + impact pattern: open with a strong verb (Resolved, Owned, Led, Lifted, Reduced, Authored), state the volume (78 contacts/day, 14,000 quarterly tickets, book of 42 accounts), state the quality (4.7/5 CSAT, 86% FCR, 92% QA score), and close with the business impact (28% AHT reduction, $1.27M ARR retained, 9-point NPS lift). Avoid 'helped', 'assisted', 'supported' as opening verbs — they read as filler. Include at least one named tool per role (Zendesk, Salesforce, Gainsight) so the bullet survives keyword filters.",
  },
  {
    question: "Should I use 'CV' or 'resume' for a customer service application?",
    answer:
      "Use the term that matches the job posting and the country. US, Canada and most APAC postings use 'resume'; UK, EU, Ireland, India and South Africa use 'CV'. The structure is identical for customer service roles: one to two pages, professional summary, core skills, professional experience with quantified bullets, tools and certifications, education. Switch the regional spelling, the date format (May 2024 vs 05/2024), and the spelling conventions (organisation vs organization) — but the screening structure is the same.",
  },
  {
    question: "How do I show progression from Agent to Senior, Team Lead, or CSM on my resume?",
    answer:
      "Promotion within the same employer goes on a single dated block with stacked titles: 'Customer Service Agent → Senior Agent → Team Lead, Mar 2022 – Present'. Each title gets its own 2-3 bullets so the reader sees the scope expansion. Lateral moves to a new employer get a new dated block. Show the metric move, not the title move: 'Promoted to Team Lead after lifting personal CSAT to 4.8 and FCR to 89% across 14 consecutive months' is stronger than 'Promoted from Agent to Team Lead'. For CSM transitions, lead the new section with the book size, NRR, and a customer-outcome story rather than re-treading agent metrics.",
  },
  {
    question:
      "What is the difference between a customer service resume and a customer success resume?",
    answer:
      "Customer service resumes lead with reactive volume metrics (contacts/day, CSAT, FCR, AHT, QA score) — the screener wants to know you can hold the queue at quality. Customer success resumes lead with retention and expansion metrics (NRR, GRR, logo churn, book size in $ARR or account count) — the screener wants to know you can renew and expand a book. Vocabulary differs: CS uses 'queue', 'ticket', 'macro', 'escalation'; CSM uses 'QBR', 'EBR', 'success plan', 'multi-thread', 'health score'. If you are pivoting from CS to CSM, reframe your existing experience around proactive outcomes (retention save plans, voice-of-customer wins, account-expansion identification).",
  },
  {
    question: "How do I write a customer service summary or objective that gets read?",
    answer:
      "3-4 lines, top of the resume, written for the specific role. Include level (Agent / Senior / Lead / CSM / Manager), years of experience, primary channels (phone, chat, email, omnichannel), top two metrics (e.g. CSAT 4.7, FCR 86%), and named CRM / helpdesk experience. Strong example: 'Senior omnichannel customer service agent with 4 years across SaaS and e-commerce, sustaining 4.7/5 CSAT and 86% FCR while handling 78 contacts/day in Zendesk and Intercom Fin. Authored 24 macros and 11 KCS articles that cut tier-2 escalations by 22% across a team of 18. Now seeking a Team Lead role at a high-growth SaaS company.' Avoid generic openers like 'hardworking customer service professional' — they are noise.",
  },
  {
    question: "How does WadeCV help me tailor a customer service resume?",
    answer:
      "Paste any customer service or customer success job URL — Zendesk, Stripe, Shopify, Klaviyo, HubSpot, an early-stage SaaS startup, or a BPO contact-centre posting — and WadeCV extracts the platform stack the employer uses, the metrics the role is measured on (CSAT, FCR, NRR, GRR, AHT), the channel mix and the level. WadeCV then rewrites your existing CV with the volume + quality + impact pattern, surfaces the right tool names, and adapts the regional spelling and metric vocabulary to the posting. The first fit-analysis run is free with the 1 credit included on signup.",
  },
];

export default function CustomerServiceResumePage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Customer Service Resume Guide 2026 — Skills, Bullets & Templates by Role",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/customer-service-resume`,
            },
            datePublished: "2026-04-25",
            dateModified: "2026-04-25",
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
        Customer Service Resume Guide 2026 — Skills, Bullets & Templates by Role
      </h1>

      <p className="text-muted-foreground mb-4">
        Customer service hiring in 2026 is more measurable than it has ever been. Recruiters scan
        for named platforms (Zendesk, Salesforce Service Cloud, Intercom, Gorgias, Gainsight),
        specific metrics (CSAT, FCR, AHT, NPS, NRR, GRR), and the channel mix you have actually
        worked. Generic &lsquo;helped customers&rsquo; bullets are filtered out before a human reads
        them. This guide gives you the exact resume structure for every customer service role from
        Agent to Director of CX, six bullet formulas that survive ATS and recruiter screens, and the
        platform vocabulary 2026 hiring managers search for.
      </p>
      <p className="text-muted-foreground mb-6">
        Read it top-to-bottom if you are preparing applications, or jump to the section you need —{" "}
        <Link href="/skills/customer-service" className="underline">
          customer service skills
        </Link>
        ,{" "}
        <Link href="/resume-bullets/customer-service" className="underline">
          bullet examples
        </Link>
        ,{" "}
        <Link href="/jobs/customer-service-representative" className="underline">
          customer service representative job guide
        </Link>{" "}
        or{" "}
        <Link href="/jobs/customer-success-manager" className="underline">
          customer success manager guide
        </Link>{" "}
        for role-level deep dives.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">The customer service resume: exact structure</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Every section in this order. The recruiter reads top-down and expects to find volume,
          quality and tooling in the canonical positions.
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
        <h2 className="text-xl font-semibold mb-4">
          Role-by-role: what each customer service resume should prove
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          The screening bar moves with the level. An Agent resume that opens with cost-to-serve
          sounds like a Director job application; a Manager resume that opens with CSAT alone reads
          as under-scoped. Match the metric stack and the vocabulary to the level you are applying
          for.
        </p>
        <div className="space-y-3">
          {ROLE_BENCHMARKS.map((r) => (
            <Card key={r.role}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{r.role}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>
                  <span className="text-foreground font-medium">Metric benchmarks:</span>{" "}
                  {r.metrics}
                </div>
                <div>
                  <span className="text-foreground font-medium">
                    Vocabulary recruiters search for:
                  </span>{" "}
                  {r.vocabulary}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <InlineCta variant="skills" slug="customer-service-resume" />

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Six bullet formulas that pass ATS and recruiter screens
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Each formula is tested against a specific screening pattern — Tier 1 agent volume, process
          improvement, retention save, customer success NRR, team-lead coaching, or cross-functional
          voice-of-customer impact. Use the one that matches the role you are targeting.
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
        <h2 className="text-xl font-semibold mb-4">
          The platform vocabulary recruiters search for
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          In 2026, customer service recruiting is heavily boolean-search-driven. Hiring managers
          filter candidate databases by named tools — Zendesk AND Salesforce, Gainsight AND
          ChurnZero, Intercom Fin AND Ada. Listing the named platform beats listing the category
          every time.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {PLATFORM_CLUSTERS.map((p) => (
            <Card key={p.cluster}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{p.cluster}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {p.tools.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs">
                  <span className="text-foreground font-medium">Screening signal:</span> {p.signal}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          The metrics dictionary: CSAT, NPS, CES, FCR, AHT, NRR, GRR
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Every customer service metric on a resume needs three things: the number, the sample size
          or scope, and a benchmark or movement. Below are the 2026 definitions and benchmarks
          recruiters expect.
        </p>
        <div className="space-y-3">
          {METRICS.map((m) => (
            <Card key={m.metric}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{m.metric}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{m.detail}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Customer service hiring in 2026: what&apos;s changed
        </h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            Three shifts have reshaped customer service hiring since 2024. First: AI deflection has
            become a screening signal in itself. Intercom Fin AI, Zendesk AI, Ada, Forethought,
            Ultimate.ai and Decagon are now in the named-tool list for Senior, Lead and Manager
            roles. If you have shipped, configured, evaluated or operated an AI deflection
            programme, that experience belongs in your professional summary, not buried in skills.
          </p>
          <p>
            Second: customer success has separated from customer service as a screening track. Two
            years ago, the same recruiter screened both. In 2026, NRR / GRR / logo-churn /
            book-size-in-ARR is the CSM screening stack and CSAT / FCR / AHT / QA-score is the
            support screening stack. CSM resumes that lead with reactive support metrics get
            filtered into the wrong pipeline and never reach the CS team.
          </p>
          <p>
            Third: AI-drafted resumes are widespread. Recruiters detect them quickly — the bullets
            all sound similar, the verbs are interchangeable and the metrics are vague
            (&lsquo;significantly improved CSAT&rsquo; instead of &lsquo;lifted CSAT from 4.3 to 4.7
            over six months in a team of 11&rsquo;). Humanising an AI draft with real numbers, named
            tools and channel-specific vocabulary is the difference between screening and rejection.
            See our{" "}
            <Link href="/humanize-ai-resume" className="underline">
              humanize AI resume guide
            </Link>{" "}
            for the techniques that work at customer service screening scale.
          </p>
          <p>
            Fourth: international and remote contact centres have made language proficiency a
            budgeted line item. Bilingual or trilingual support agents with stated CEFR levels (B2,
            C1, C2) command 12-25% premiums in many markets. If you support multiple languages, list
            them with proficiency levels in the core-skills block — not in a tiny
            additional-information footer.
          </p>
        </div>
      </section>

      <InlineCta variant="career-change" slug="customer-service-resume" />

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Eight common customer service resume mistakes
        </h2>
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
        currentCategory="/customer-service-resume"
        contextLinks={[
          {
            href: "/skills/customer-service",
            label: "Customer Service Skills (40+ Examples)",
          },
          {
            href: "/resume-bullets/customer-service",
            label: "Customer Service Bullet Examples",
          },
          {
            href: "/jobs/customer-service-representative",
            label: "Customer Service Representative Guide",
          },
          {
            href: "/jobs/customer-success-manager",
            label: "Customer Success Manager Guide",
          },
          {
            href: "/career-change/sales-to-customer-success",
            label: "Sales → Customer Success Pivot Guide",
          },
          { href: "/career-change", label: "Career Change Resume Hub" },
          { href: "/ats-resume-checker", label: "Free ATS Resume Checker" },
          { href: "/humanize-ai-resume", label: "Humanize an AI Resume" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Tailor your customer service CV to a specific role — free to start</CardTitle>
          <p className="text-sm text-muted-foreground">
            Paste any customer service, support or customer success job URL — Zendesk, Stripe,
            Shopify, Klaviyo, HubSpot, a SaaS startup, or a BPO contact-centre posting. WadeCV
            extracts the platform stack and metric expectations, then rewrites your CV with the
            volume + quality + impact pattern, the right tool names, and the regional spelling that
            matches the posting. 1 free credit on signup — no credit card needed.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta
            variant="skills"
            label="Tailor your customer service CV for free"
            slug="customer-service-resume"
          />
        </CardContent>
      </Card>
    </article>
  );
}
