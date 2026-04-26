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
  title:
    "Digital Marketing CV & Resume Guide 2026 — Skills, Bullets & Templates by Channel | WadeCV",
  description:
    "The complete digital marketing CV in 2026: 60+ skills, 16 bullet examples, role-by-role templates from Coordinator to VP Marketing, the metrics that matter (CAC, ROAS, MQLs, pipeline) and the platforms recruiters search for (GA4, HubSpot, Salesforce, GTM, Meta Ads, LinkedIn Campaign Manager, Klaviyo).",
  openGraph: {
    title: "Digital Marketing CV & Resume Guide 2026 — Skills, Bullets & Templates by Channel",
    description:
      "Digital marketing CV by channel and level: SEO, paid, lifecycle, content, growth, brand. Skills, bullets, CAC/ROAS/MQL/pipeline metrics, platform vocabulary (GA4, HubSpot, Salesforce, GTM, Meta Ads, LinkedIn) and free CV tailoring.",
  },
  twitter: {
    card: "summary" as const,
    title: "Digital Marketing CV & Resume Guide 2026",
    description:
      "Skills, bullets and templates for every digital marketing role from Coordinator to VP Marketing. Free tailoring to any marketing job description.",
  },
};

const RESUME_STRUCTURE: { order: number; section: string; detail: string }[] = [
  {
    order: 1,
    section: "Headline / Professional summary",
    detail:
      "3-4 line summary that states your level (Coordinator, Specialist, Manager, Senior, Director, VP), years of experience, your channel mix (SEO, paid, lifecycle, content, growth, brand), and your top two metrics — pick from CAC, ROAS, MQL volume, pipeline contribution, blended CAC payback, organic sessions, conversion rate, ARR-attributed-to-marketing. Recruiters scan this in under 6 seconds. Never lead with 'passionate about marketing' — lead with the number.",
  },
  {
    order: 2,
    section: "Core skills / Technical stack",
    detail:
      "A 6-12 item block of named platforms grouped by function. Be specific: 'GA4 + GTM Server-Side + Looker Studio' beats 'analytics'; 'HubSpot Marketing Hub Enterprise + Salesforce Marketing Cloud + Marketo Engage' beats 'marketing automation'; 'Meta Ads Manager + LinkedIn Campaign Manager + Google Ads (PMax, Demand Gen)' beats 'paid social'. Add SQL, Python, dbt, or no-code (Zapier, Make, n8n) if you operate the stack yourself. List AI tools by name (ChatGPT, Claude, Gemini, Perplexity, Jasper, Surfer, Clay, AirOps).",
  },
  {
    order: 3,
    section: "Professional experience",
    detail:
      "Reverse chronological. Each role: employer, location, title, dates, and 4-6 bullets. Every bullet contains channel (paid social, SEO, lifecycle, partner), volume (spend, sessions, MQLs, sends), AND outcome (CAC, ROAS, conversion rate, pipeline, ARR). 'Managed paid campaigns' is a deprioritisation; 'Owned $1.2M Meta + LinkedIn quarterly budget; drove 412 SQLs at $2,910 CAC and 4.6× ROAS, beating plan by 22%' is a screening pass.",
  },
  {
    order: 4,
    section: "Tools, certifications & languages",
    detail:
      "List every analytics, automation, ad, CRM, content, SEO and CDP tool you have used. Add certifications (Google Ads, Meta Blueprint, HubSpot Inbound, Salesforce Marketing Cloud Email Specialist, GA4 Skillshop, Pragmatic Marketing, AMA PCM). Add languages with CEFR proficiency — multi-market launches and localisation roles weigh language separately.",
  },
  {
    order: 5,
    section: "Education & additional",
    detail:
      "Education: degree, institution, dates. Additional: side projects (Substack with N subscribers, podcast, Indie Hackers launch), open-source marketing tooling, conference talks (SaaStr, MAU, Lifecycle Marketing Summit), or published case studies. For Director / VP roles, this section can include board-level metric ownership, P&L size, and team size.",
  },
];

const ROLE_BENCHMARKS: { role: string; metrics: string; vocabulary: string }[] = [
  {
    role: "Marketing Coordinator / Assistant",
    metrics:
      "Project throughput · 8-15 campaigns shipped/quarter · email open / CTR / form-fill volumes · campaign QA pass rate",
    vocabulary:
      "Campaign brief, asset trafficking, UTM hygiene, A/B test, send window, CMS update, content calendar, vendor management, QA checklist",
  },
  {
    role: "Digital Marketing Specialist (channel-specific)",
    metrics:
      "Channel-level: ROAS 3-6× · CTR (1.5-3% Meta, 0.4-1% LinkedIn) · CPL · CVR · email CTR 2-5% · open 25-40% · organic CTR (1-5% by SERP type)",
    vocabulary:
      "Conversion API, server-side GTM, Performance Max, Demand Gen, Advantage+, custom audiences, lookalikes, suppression list, deliverability, Sender Score, GTM data layer, Schema.org, Core Web Vitals",
  },
  {
    role: "Digital Marketing Manager",
    metrics:
      "Multi-channel ownership · Blended CAC payback < 12-18 months · MQL→SQL conversion 12-25% · CPL by channel · 6-12 monthly campaigns",
    vocabulary:
      "MQL, SQL, SQO, opportunity, blended CAC, channel mix, attribution model, MMM (media mix modelling), pipeline acceleration, lead scoring, account scoring, ABM tier, ICP fit",
  },
  {
    role: "Senior / Performance / Growth Marketing Manager",
    metrics:
      "Spend $250K-$5M/quarter · ROAS 4-8× · iROAS, MMM lift · activation rate · k-factor · LTV / CAC ratio · paid CAC vs organic CAC delta",
    vocabulary:
      "Incrementality test, geo holdout, MMM, MTA, PSI testing, AARRR funnel, north-star metric, activation event, time-to-value, retention curve, organic growth loop, viral coefficient, payback period",
  },
  {
    role: "Marketing Director / Head of Demand Gen / VP Marketing",
    metrics:
      "Function-wide: Marketing-sourced ARR / pipeline · marketing-influenced ARR · marketing budget % of ARR (8-15% PLG, 15-25% sales-led) · headcount 8-40 · agency $ managed · forecast accuracy 90%+",
    vocabulary:
      "Pipeline coverage, forecast model, ABX, RevOps alignment, lifecycle stage, sales-marketing SLA, marketing P&L, agency roster, brand-vs-demand split, board metric, NDR contribution, GTM motion, PLG/SLG hybrid",
  },
  {
    role: "CMO / Chief Marketing Officer",
    metrics:
      "Board scorecard · marketing P&L · brand-equity tracking (aided / unaided awareness) · NPS · category creation · ARR contribution · CMO-CRO alignment OKRs",
    vocabulary:
      "Category design, narrative architecture, positioning, segmentation, total addressable market, MMM committee, brand health study, share of voice, share of search, executive sponsor program, analyst relations, IPO readiness",
  },
];

const BULLET_FORMULAS: {
  title: string;
  formula: string;
  example: string;
}[] = [
  {
    title: "Paid acquisition (Spend + Channel + ROAS / CAC)",
    formula:
      "[Owned / scaled] [$ spend] across [channels] in [period]; delivered [ROAS / CAC / CPL] of [X] against [target / benchmark]; [pipeline / revenue / unit outcome].",
    example:
      "Owned a $1.4M quarterly Meta + LinkedIn + Google Ads budget across DACH and UK; delivered 4.6× ROAS and $2,910 blended CAC vs $3,500 target, generating 412 SQLs and $5.2M influenced pipeline.",
  },
  {
    title: "SEO / organic (Sessions + Position + Conversions)",
    formula:
      "[Built / led / shipped] [N programmatic / pillar / cluster] pages targeting [intent]; lifted [organic sessions / non-brand keywords / impressions] from [X] to [Y] in [period]; [conversion / pipeline / revenue impact].",
    example:
      "Shipped a 190-page programmatic SEO cluster across job-role + ATS + skill verticals; lifted non-brand organic sessions from 11K to 84K monthly in 6 months and grew SQL contribution from organic from 4% to 17% of pipeline ($2.8M influenced).",
  },
  {
    title: "Lifecycle / email / CRM (Audience × Send × Outcome)",
    formula:
      "[Built / launched / re-architected] [lifecycle program] across [N segments / triggers]; lifted [open / CTR / activation / repeat-purchase / NRR] from [X] to [Y]; [revenue or retention impact].",
    example:
      "Re-architected the post-trial lifecycle in HubSpot + Customer.io across 14 behavioural triggers and 6 ICP segments; lifted trial-to-paid conversion from 11.2% to 18.4% in 90 days and added $612K ARR/quarter from the same top-of-funnel volume.",
  },
  {
    title: "Demand gen / pipeline (MQL → SQL → ARR)",
    formula:
      "[Owned / hit / overshipped] [N MQLs / SQLs / opps] at [unit cost]; partnered with [Sales / SDR / RevOps] to deliver [pipeline $ / closed-won $] against [target] in [period].",
    example:
      "Owned the demand-gen function for a $40M ARR Series B SaaS; hit 980 MQLs / 240 SQLs / 88 opps quarterly at $4,180 blended CAC; partnered with Sales and RevOps to deliver $9.4M qualified pipeline (138% of target) and $2.1M closed-won (112%).",
  },
  {
    title: "Brand / content / category (Reach + Engagement + Pipeline)",
    formula:
      "[Launched / led] [campaign / category narrative / content engine] in [channels]; reached [audience / impressions / share-of-voice] and earned [press / podcast / inbound]; [pipeline-influenced / brand-lift / NPS] outcome.",
    example:
      "Launched a category-narrative campaign (paid LinkedIn + earned PR + podcast tour) in B2B fintech; reached 4.2M senior finance impressions, earned 18 tier-1 placements, and lifted brand-aided awareness from 9% to 17% with $3.6M influenced pipeline in two quarters.",
  },
  {
    title: "Growth / experimentation (Test + Lift + Confidence)",
    formula:
      "[Designed / shipped] [N experiments] across [stages of the funnel]; [winning test] lifted [metric] by [X% / pp] at [confidence / sample size]; [annualised revenue / activation impact].",
    example:
      "Shipped 32 growth experiments across signup, onboarding and pricing-page in 2 quarters; the winning pricing-page redesign lifted free-to-paid conversion 23% (95% CI, n=48,000) and the onboarding-checklist test lifted day-7 activation 18%, together adding ~$840K ARR run-rate.",
  },
];

const PLATFORM_CLUSTERS: {
  cluster: string;
  tools: string[];
  signal: string;
}[] = [
  {
    cluster: "Analytics & attribution",
    tools: [
      "GA4 (Explorations, BigQuery export, Measurement Protocol)",
      "Google Tag Manager (Web + Server-Side)",
      "Looker Studio, Looker, Tableau, Mode, Hex",
      "Adobe Analytics, Mixpanel, Amplitude, Heap",
      "Segment, RudderStack, mParticle, Hightouch",
      "Triple Whale, Northbeam, Polar (DTC attribution)",
      "Snowflake / BigQuery + dbt for marketing data",
    ],
    signal:
      "Name the modules — 'GA4 with BigQuery export and server-side GTM' beats 'GA4'. Recruiters search for warehouse-native marketing teams; pair the analytics tool with the warehouse and the transformation layer (dbt) to read as a modern operator.",
  },
  {
    cluster: "Marketing automation & CRM",
    tools: [
      "HubSpot Marketing Hub (Pro / Enterprise)",
      "Salesforce Marketing Cloud (Email Studio, Journey Builder, Marketing Cloud Personalisation)",
      "Marketo Engage, Pardot / Account Engagement, Eloqua",
      "Customer.io, Iterable, Braze, Bloomreach",
      "Klaviyo (DTC ecommerce), Sendlane",
      "Salesforce Sales Cloud, Pipedrive, HubSpot CRM",
    ],
    signal:
      "Lead with the platform tier ('HubSpot Marketing Hub Enterprise', 'Marketo Engage Standard') and the modules you have actually built in (Journey Builder, lead scoring, custom objects). Recruiters filter on tier-specific experience — Pro vs Enterprise represents a different operator level.",
  },
  {
    cluster: "Paid media & ad platforms",
    tools: [
      "Meta Ads Manager (Advantage+, Conversion API, Custom Audiences, CAPI Gateway)",
      "Google Ads (Performance Max, Demand Gen, Search, YouTube)",
      "LinkedIn Campaign Manager (Conversion API, Matched Audiences, ABM Lists)",
      "TikTok Ads, Reddit, X / Twitter, Snap, Pinterest",
      "Demand-side platforms — DV360, The Trade Desk, StackAdapt",
      "Walmart Connect, Amazon Ads, Apple Search Ads",
    ],
    signal:
      "Conversion API + server-side tracking is the 2026 paid-media baseline. List CAPI / s2s implementations explicitly — 'Implemented Meta CAPI via server-side GTM with deduplication against pixel events' is a Senior+ signal.",
  },
  {
    cluster: "SEO, content & CMS",
    tools: [
      "Ahrefs, Semrush, Sistrix, Conductor, Botify",
      "Screaming Frog, Sitebulb, Lumar (DeepCrawl)",
      "Surfer, Clearscope, MarketMuse, Frase",
      "Webflow, WordPress, Sanity, Contentful, Strapi, Statamic",
      "Next.js / Astro / Eleventy (programmatic SEO)",
      "Google Search Console + URL Inspection API",
    ],
    signal:
      "Programmatic SEO at scale is now expected for SaaS / DTC growth roles. List the static framework + the data source ('Next.js + JSON content + ISR for 12,000 programmatic city-pages') if you have shipped one — it differentiates from generic content-SEO experience.",
  },
  {
    cluster: "AI, MarTech & no-code",
    tools: [
      "ChatGPT, Claude, Gemini, Perplexity (briefs, research, drafts)",
      "Jasper, Copy.ai, Writer (brand-tuned content)",
      "Surfer AI, Clearscope (SEO content)",
      "Clay, Apollo.io, ZoomInfo, Crunchbase Pro (enriched ABM)",
      "AirOps, Relevance AI, Cassidy (workflow agents)",
      "Zapier, Make, n8n, Tray (no-code integration)",
      "Midjourney, Runway, Sora, Eleven Labs (creative)",
    ],
    signal:
      "AI-fluency is the 2026 differentiator. If you have shipped or operated an AI workflow that replaced ≥1 FTE of work (content production, ABM enrichment, ad-creative variants, lifecycle copy), lead with the FTE-equivalent productivity gain and the dollar-cost saved.",
  },
  {
    cluster: "Lifecycle, CDP, personalisation & experimentation",
    tools: [
      "Segment, RudderStack, mParticle (CDPs)",
      "Hightouch, Census (reverse ETL)",
      "Optimizely, VWO, Statsig, Eppo (experimentation)",
      "Dynamic Yield, Mutiny, Intellimize (personalisation)",
      "Customer.io, Braze, Iterable (lifecycle orchestration)",
      "Mailchimp, Klaviyo (SMB / DTC lifecycle)",
    ],
    signal:
      "Mid-market and enterprise SaaS / DTC marketing roles increasingly require CDP + reverse ETL + experimentation literacy. 'Built audience syncs in Hightouch from Snowflake to Iterable, Customer.io and Meta CAPI' is a load-bearing signal.",
  },
];

const METRICS = [
  {
    metric: "CAC (Customer Acquisition Cost)",
    detail:
      "Total marketing + sales spend / new customers acquired in period. Blended CAC includes all channels; paid CAC isolates paid spend. SaaS healthy: CAC payback under 12 months for SMB, 18 months mid-market, 24 months enterprise. Always pair CAC with payback period and LTV/CAC ratio (target 3:1+) for screen-passing context.",
  },
  {
    metric: "ROAS / iROAS (Return on Ad Spend)",
    detail:
      "Revenue / ad spend. ROAS 4-6× is healthy DTC, 8×+ is exceptional with mature attribution. iROAS = incremental ROAS, measured via geo holdouts or MMM, and is the 2026 sophistication signal — recruiters at well-funded growth teams now distinguish reported ROAS (last-click) from incremental ROAS (causal).",
  },
  {
    metric: "MQL / SQL / SQO (Marketing- / Sales- Qualified Lead / Opp)",
    detail:
      "MQL = lead that meets marketing's bar (lead score, fit, intent). SQL = lead Sales accepts. SQO = qualified opportunity entered into the pipeline stage. SaaS conversion benchmarks: MQL → SQL 12-25%, SQL → SQO 35-55%, SQO → closed-won 18-30%. Resume bullets that quote MQL volume without SQL conversion are weak; quote both.",
  },
  {
    metric: "Pipeline & ARR contribution",
    detail:
      "Marketing-sourced pipeline = opps where marketing is the original source. Marketing-influenced pipeline = any opp with a marketing touch. Mature B2B SaaS: marketing-sourced 30-50% of pipeline; marketing-influenced 70-90%. Lead the Director+ resume with marketing-sourced ARR or pipeline $; CMOs lead with revenue contribution to board.",
  },
  {
    metric: "Conversion rate (CVR), CTR, organic position",
    detail:
      "Channel-specific: Meta CTR 1.5-3%, LinkedIn 0.4-1%, Google Search 3-6% on brand, 1-3% on non-brand, email open 25-40% / CTR 2-5%. Web CVR DTC 2-5%, SaaS demo-request 4-12% on bottom-funnel. Always quote against a baseline so the screener can interpret it.",
  },
  {
    metric: "Retention & lifecycle metrics (NRR, repeat-rate, activation)",
    detail:
      "B2B SaaS NRR 105-120%, GRR 88-92%. DTC repeat-purchase rate 25-40% within 90 days. Activation = % of new users hitting the value moment. Lifecycle and retention marketers should lead with NRR / activation / repeat-rate; performance marketers lead with CAC / ROAS; brand marketers lead with reach + brand-lift + influenced pipeline.",
  },
];

const COMMON_MISTAKES = [
  "Bullets that say 'managed campaigns' or 'ran ads' without channel, spend, ROAS / CAC, or pipeline outcome — the screen filters those out before a human reads them",
  "No named platforms — 'marketing automation tools' instead of 'HubSpot Marketing Hub Enterprise + Marketo Engage' is invisible to boolean recruiter searches",
  "Quoting MQL volume without SQL or SQO conversion — recruiters read MQL-only resumes as candidates who do not own the handoff to Sales",
  "ROAS quoted without channel mix or attribution model — '8× ROAS' on last-click Meta + brand search is not the same as 8× iROAS in a geo-holdout test",
  "Director / VP resume framed at channel-specialist level (CTR, open rate) rather than function-level (marketing-sourced ARR, pipeline coverage, headcount, P&L)",
  "Missing the GA4 / GTM / warehouse stack — modern marketing teams expect tracking literacy. 'GA4 + server-side GTM + BigQuery + Looker Studio' or 'Segment + dbt + Snowflake + Hightouch' belongs in core skills",
  "AI fluency listed as 'familiar with ChatGPT' — name the workflows you have shipped (content engine, brief-to-draft pipeline, ABM enrichment, creative variants) and the FTE-equivalent productivity gain",
  "Generic positioning ('results-driven marketer with X years of experience') instead of role-targeted (Senior Performance Marketer, $4M quarterly spend, 4.6× ROAS, $2,910 blended CAC, B2B SaaS DACH/UK)",
];

const FAQ = [
  {
    question: "What are the most important metrics to put on a digital marketing resume in 2026?",
    answer:
      "It depends on the role. For paid / performance marketers: spend managed, ROAS (and iROAS if you have it), CAC, CPL, CTR, conversion rate. For SEO / content marketers: organic sessions delta, non-brand keywords ranking, conversions or pipeline from organic, programmatic-page count and lift. For lifecycle / email / CRM marketers: open rate, CTR, activation rate, NRR or repeat-purchase rate, revenue per email, churn impact. For demand-gen / B2B marketers: MQL → SQL → SQO conversion, marketing-sourced pipeline $, marketing-influenced pipeline $, blended CAC, CAC payback. For Director+ roles: marketing-sourced ARR, pipeline coverage ratio, marketing budget as % of ARR, headcount, agency $ managed, forecast accuracy. Always pair the number with the time window and the baseline so the screener can interpret it.",
  },
  {
    question: "Which tools and platforms should I list on a digital marketing CV?",
    answer:
      "List every platform you have used in production, with the modules and tier where you can. The high-frequency recruiter search terms in 2026 are GA4, Google Tag Manager (server-side a plus), HubSpot Marketing Hub, Salesforce Marketing Cloud, Marketo Engage, Customer.io, Klaviyo, Iterable, Braze, Segment, RudderStack, Hightouch, Meta Ads Manager + Conversion API, LinkedIn Campaign Manager, Google Ads (Performance Max, Demand Gen), Ahrefs, Semrush, Screaming Frog, Surfer, Webflow, Looker Studio, Mixpanel, Amplitude, Optimizely, VWO, Statsig, dbt and Snowflake or BigQuery. For AI: name workflows, not familiarity (Clay-driven enrichment, ChatGPT-driven brief-to-outline, AirOps content pipeline). Recruiters use boolean search — listing 'marketing automation' loses to 'HubSpot Marketing Hub Enterprise + Marketo Engage'.",
  },
  {
    question: "How do I write a digital marketing CV bullet that passes ATS and recruiter screens?",
    answer:
      "Use the channel + volume + outcome pattern: open with a strong verb (Owned, Scaled, Shipped, Lifted, Reduced, Built), state the channel and the unit of work (paid spend, organic sessions, sends, experiments), state the volume ($1.4M quarterly Meta budget, 412 SQLs, 32 experiments, 84K monthly organic sessions), and close with the business outcome (4.6× ROAS, $2,910 CAC, $5.2M influenced pipeline, 23% activation lift, +$840K ARR run-rate). Avoid 'managed', 'helped', 'assisted' as opening verbs — they read as filler. Include at least one named platform per role (HubSpot, Meta, GA4, LinkedIn, Klaviyo) so the bullet survives keyword filters. If you can quote the test confidence (95% CI, n=48,000), the bullet reads as senior.",
  },
  {
    question: "Should I use 'CV' or 'resume' for a digital marketing application?",
    answer:
      "Use the term that matches the job posting and the country. US, Canada and most APAC postings use 'resume'; UK, Ireland, EU, India, Australia and South Africa use 'CV'. Switch the spelling conventions (organisation vs organization, programme vs program), the date format (May 2024 vs 05/2024) and the currency in the bullets (£ vs $) — but the structure is identical: 1-2 pages, summary, core skills, experience with quantified bullets, tools and certifications, education. Marketing roles increasingly read both terms as interchangeable; matching the posting is the safest signal.",
  },
  {
    question:
      "How do I show progression from Coordinator to Specialist, Manager and Director on a marketing resume?",
    answer:
      "Promotion within the same employer goes on a single dated block with stacked titles: 'Marketing Coordinator → Marketing Specialist → Senior Marketing Manager, Mar 2022 – Present'. Each title gets its own 2-3 bullets so the reader sees the scope expansion. Lateral moves to a new employer get a new dated block. Show the metric movement, not the title movement: 'Promoted to Senior after lifting paid CAC from $4,800 to $2,910 over four quarters while doubling spend to $1.4M' is stronger than 'Promoted to Senior Performance Marketer'. For Director / VP transitions, lead the new section with marketing-sourced ARR and headcount rather than channel metrics.",
  },
  {
    question:
      "What is the difference between a performance marketing CV and a lifecycle / brand marketing CV?",
    answer:
      "Performance marketing CVs lead with paid metrics — spend managed, ROAS, CAC, CPL, channel mix — and named ad platforms (Meta, Google Ads, LinkedIn, TikTok, DV360). Lifecycle / CRM CVs lead with retention and activation — NRR, repeat-purchase rate, trial-to-paid conversion, activation rate, revenue per send — and named lifecycle tools (Customer.io, Braze, Iterable, Klaviyo, Marketo Journey Builder). Brand / content CVs lead with reach, engagement and influenced pipeline — share of voice, share of search, brand-aided awareness movement, earned media placements, and content-attributed pipeline. Mismatching the resume framing to the role you are targeting is the single most common reason marketing CVs get filtered into the wrong pipeline.",
  },
  {
    question: "How do I write a digital marketing summary or objective that gets read?",
    answer:
      "3-4 lines, top of the resume, written for the specific role. Include level (Coordinator / Specialist / Manager / Senior / Director / VP), years of experience, channel mix, top two metrics, and named platforms. Strong example: 'Senior performance marketer with 6 years across B2B SaaS and DTC, owning $1.4M quarterly Meta + LinkedIn + Google Ads spend at 4.6× ROAS and $2,910 blended CAC. Built the GA4 + server-side GTM + BigQuery + Looker stack and shipped 32 growth experiments delivering $840K ARR run-rate. Now seeking a Head of Performance role at a Series B/C SaaS scaling EMEA.' Avoid 'results-driven', 'passionate', 'data-driven' as openers — they read as filler.",
  },
  {
    question:
      "How should I show AI fluency on a digital marketing CV in 2026 without sounding generic?",
    answer:
      "Name the workflow, the tool, and the FTE-equivalent productivity gain or dollar impact. Weak: 'Familiar with ChatGPT and Jasper.' Strong: 'Built a Claude + Surfer + Webflow content engine producing 40 SEO-optimised long-form pages monthly (≈1.5 FTE equivalent), generating 14K incremental organic sessions and 38 SQLs/quarter at $0 incremental ad spend.' For ABM: 'Operated a Clay + Apollo + GPT-4 enrichment pipeline qualifying 1,800 net-new accounts/month against the ICP at 22% reply-rate on outbound — replaced ~$11K/month in outsourced research.' AI fluency is now the 2026 sophistication marker; lead with the workflow, not the tool list.",
  },
];

export default function DigitalMarketingResumePage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "Digital Marketing CV & Resume Guide 2026 — Skills, Bullets & Templates by Channel",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/digital-marketing-resume`,
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
        Digital Marketing CV &amp; Resume Guide 2026 — Skills, Bullets &amp; Templates by Channel
      </h1>

      <p className="text-muted-foreground mb-4">
        Digital marketing hiring in 2026 is more measurable and more boolean-search-driven than it
        has ever been. Recruiters scan for named platforms (GA4, server-side GTM, HubSpot Marketing
        Hub Enterprise, Salesforce Marketing Cloud, Marketo Engage, Meta Ads + Conversion API,
        LinkedIn Campaign Manager, Klaviyo, Customer.io, Segment, dbt, Snowflake), specific metrics
        (CAC, ROAS, MQL/SQL conversion, marketing-sourced pipeline, NRR, activation), and the
        channel mix you have actually shipped against. Generic &lsquo;managed campaigns&rsquo;
        bullets are filtered out before a human reads them. This guide gives you the exact CV
        structure for every digital marketing role from Coordinator to CMO, six bullet formulas that
        survive ATS and recruiter screens, the platform vocabulary 2026 hiring managers search for,
        and the AI-fluency signals that separate Senior+ candidates.
      </p>
      <p className="text-muted-foreground mb-6">
        Read it top-to-bottom if you are preparing applications, or jump to the section you need —{" "}
        <Link href="/skills/digital-marketing" className="underline">
          digital marketing skills
        </Link>
        ,{" "}
        <Link href="/resume-bullets/marketing-manager" className="underline">
          bullet examples
        </Link>
        ,{" "}
        <Link href="/jobs/marketing-manager" className="underline">
          marketing manager job guide
        </Link>{" "}
        or{" "}
        <Link href="/jobs/digital-marketing-manager" className="underline">
          digital marketing manager guide
        </Link>{" "}
        for role-level deep dives.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">The digital marketing CV: exact structure</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Every section in this order. The recruiter reads top-down and expects to find spend,
          channel, metric and tooling in the canonical positions.
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
          Role-by-role: what each digital marketing CV should prove
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          The screening bar moves with the level. A Specialist resume that opens with marketing
          P&amp;L sounds like a VP application; a Director resume that opens with email open rate
          alone reads as under-scoped. Match the metric stack and the vocabulary to the level you
          are applying for.
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

      <InlineCta variant="skills" slug="digital-marketing-resume" />

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Six bullet formulas that pass ATS and recruiter screens
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Each formula is tested against a specific screening pattern — paid acquisition, organic /
          SEO, lifecycle, demand gen, brand / category, and growth experimentation. Use the one that
          matches the role you are targeting.
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
          In 2026, digital marketing recruiting is heavily boolean-search-driven. Hiring managers
          filter candidate databases by named tools — GA4 AND server-side GTM, HubSpot AND Marketo,
          Meta CAPI AND LinkedIn Conversion API, Segment AND dbt. Listing the named platform beats
          listing the category every time.
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
          The metrics dictionary: CAC, ROAS, MQL/SQL, pipeline, conversion, retention
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Every digital marketing metric on a resume needs three things: the number, the time window
          or sample size, and a benchmark or movement. Below are the 2026 definitions and benchmarks
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
          Digital marketing hiring in 2026: what&apos;s changed
        </h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            Four shifts have reshaped digital marketing hiring since 2024. First: AI fluency has
            become a top-of-funnel screening signal. ChatGPT, Claude, Gemini, Surfer, Clay, AirOps
            and Cassidy are now in the named-tool list for Specialist+ roles. Recruiters expect you
            to name the workflow, the tool and the FTE-equivalent productivity gain. &lsquo;Familiar
            with AI tools&rsquo; reads as a non-signal in 2026; &lsquo;Built a Claude + Surfer +
            Webflow content engine producing 40 long-form pages/month (≈1.5 FTE equivalent),
            delivering 14K incremental organic sessions/quarter&rsquo; reads as senior.
          </p>
          <p>
            Second: the warehouse-native marketing stack has moved from optional to expected at
            mid-market and enterprise SaaS. GA4 + server-side GTM + BigQuery / Snowflake + dbt +
            Looker / Hex, paired with Segment + Hightouch / Census for activation, is now the
            baseline tracking and audience-syncing pattern. Marketing CVs that omit warehouse + ETL
            + reverse-ETL literacy get filtered out of Senior+ performance and lifecycle roles.
          </p>
          <p>
            Third: incrementality and MMM have replaced last-click ROAS as the credibility signal at
            growth-marketing screens. iROAS (incremental ROAS, measured via geo holdouts or MMM),
            geo lift tests and PSI testing are the 2026 vocabulary. If you have run an
            incrementality test or operated a media-mix model, lead with it — it separates senior
            performance marketers from channel specialists.
          </p>
          <p>
            Fourth: AI-drafted marketing resumes are widespread. Recruiters detect them quickly —
            the bullets all sound similar, the verbs are interchangeable and the metrics are vague
            (&lsquo;significantly improved ROAS&rsquo; instead of &lsquo;lifted blended ROAS from
            3.2× to 4.6× over two quarters on a $1.4M Meta + LinkedIn budget&rsquo;). Humanising an
            AI draft with real numbers, named platforms, and channel-specific vocabulary is the
            difference between screening and rejection. See our{" "}
            <Link href="/humanize-ai-resume" className="underline">
              humanize AI resume guide
            </Link>{" "}
            for the techniques that work at marketing screening scale.
          </p>
        </div>
      </section>

      <InlineCta variant="career-change" slug="digital-marketing-resume" />

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Eight common digital marketing resume mistakes
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
        currentCategory="/digital-marketing-resume"
        contextLinks={[
          { href: "/skills/digital-marketing", label: "Digital Marketing Skills (60+ Examples)" },
          {
            href: "/resume-bullets/marketing-manager",
            label: "Marketing Manager Bullet Examples",
          },
          {
            href: "/resume-bullets/digital-marketing",
            label: "Digital Marketing Bullet Examples",
          },
          { href: "/jobs/marketing-manager", label: "Marketing Manager Job Guide" },
          {
            href: "/jobs/digital-marketing-manager",
            label: "Digital Marketing Manager Job Guide",
          },
          { href: "/career-change", label: "Career Change Resume Hub" },
          { href: "/ats-resume-checker", label: "Free ATS Resume Checker" },
          { href: "/humanize-ai-resume", label: "Humanize an AI Resume" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Tailor your digital marketing CV to a specific role — free to start</CardTitle>
          <p className="text-sm text-muted-foreground">
            Paste any digital marketing, performance, growth, lifecycle or brand job URL — HubSpot,
            Klaviyo, Notion, Stripe, a Series B SaaS startup, or a DTC brand posting. WadeCV
            extracts the platform stack and metric expectations, then rewrites your CV with the
            channel + volume + outcome pattern, the right tool names, and the regional spelling that
            matches the posting. 1 free credit on signup — no credit card needed.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta
            variant="skills"
            label="Tailor your digital marketing CV for free"
            slug="digital-marketing-resume"
          />
        </CardContent>
      </Card>
    </article>
  );
}
