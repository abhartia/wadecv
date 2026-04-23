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
    "Investment Banking Resume Guide 2026 — Bulge Bracket, Elite Boutique & How to Pass the Screen | WadeCV",
  description:
    "The one-page investment banking resume that passes Goldman Sachs, JP Morgan, Morgan Stanley, BlackRock and elite boutique screens in 2026. Exact structure, deal-experience bullet formulas, division-specific keywords, and how bulge bracket differs from elite boutique.",
  openGraph: {
    title:
      "Investment Banking Resume Guide 2026 — Bulge Bracket, Elite Boutique & How to Pass the Screen",
    description:
      "One-page IB resume structure with deal-experience bullets and division-specific keywords. Differences between Goldman Sachs, JP Morgan, Morgan Stanley, Citi, BlackRock and elite boutiques.",
  },
  twitter: {
    card: "summary" as const,
    title: "Investment Banking Resume Guide 2026 — Bulge Bracket + EB",
    description:
      "One-page IB resume structure with deal bullets and division-specific keywords. Free tailoring to any bulge-bracket or boutique role.",
  },
};

const BB_VS_EB: { dimension: string; bulge: string; boutique: string }[] = [
  {
    dimension: "Target GPA",
    bulge:
      "3.5+ minimum at targets (Wharton, Stern, Harvard, Ross, Mendoza, LSE, Oxbridge, Bocconi); 3.7+ at semi-targets and non-targets",
    boutique:
      "3.7+ minimum across the board (Evercore, Centerview, Lazard, PJT, Moelis, Guggenheim, Qatalyst, Perella Weinberg); 3.8+ common at Centerview and Qatalyst",
  },
  {
    dimension: "Resume length",
    bulge:
      "One page, no exceptions, across Analyst and Associate rungs — two pages only at VP and above for specific advisory roles",
    boutique:
      "One page, strictly enforced at Analyst and Associate — Centerview and PJT reject two-page CVs on sight at junior levels",
  },
  {
    dimension: "Deal quantification bar",
    bulge:
      "Every deal bullet must list: deal size ($), buyer/target/sponsor, your specific workstream, and the outcome (closed / announced / withdrawn / ongoing)",
    boutique:
      "Higher bar — elite boutiques expect deal-memo-grade specificity: $ enterprise value, $ equity check, EV/EBITDA multiple, leverage multiple, and your exact model or memo deliverable",
  },
  {
    dimension: "Technical signal",
    bulge:
      "Advanced Excel (three-statement, LBO, DCF, M&A accretion/dilution, comps, precedents), PowerPoint (pitchbook fluency), CFA Level 1+ a plus",
    boutique:
      "Advanced Excel is table stakes; paper LBO-on-demand expected in interviews; Series 79 progression expected for US roles; CFA more weighted at asset managers",
  },
  {
    dimension: "Leadership / spike",
    bulge:
      "Named leadership role with measurable outcome; finance-related extracurriculars (investment club, PE fund, stock-pitch competitions, eToro / Robinhood P&L)",
    boutique:
      "Finance depth over breadth — research with a named VC / PE fund, a winning case at Cornell / Wharton stock-pitch, or a published industry note outranks multi-society leadership",
  },
  {
    dimension: "Division vocabulary",
    bulge:
      "Division-specific — M&A (sell-side, buy-side), Leveraged Finance (LBO, financing commitment, OID), ECM (IPO, follow-on, convert), DCM (investment grade, high yield), Sponsors (PEG coverage), Industry Groups (TMT, Healthcare, FIG, Natural Resources, Industrials)",
    boutique:
      "Pure advisory — M&A sell-side and buy-side, restructuring (DIP, Ch 11, liability management), activism defense, SPAC, private capital advisory, shareholder advisory",
  },
  {
    dimension: "Interview process",
    bulge:
      "HireVue video interview → Super Day (3-6 back-to-back 30-min behaviourals + technicals) → offer; some firms use Pymetrics or cognitive assessments",
    boutique:
      "Direct partner-led Super Day — no HireVue at Centerview, Qatalyst, Perella Weinberg; technicals go deeper (full LBO on paper, M&A accretion/dilution without calculator)",
  },
];

const RESUME_STRUCTURE: { order: number; section: string; detail: string }[] = [
  {
    order: 1,
    section: "Contact block",
    detail:
      "Name, professional email, phone, LinkedIn URL, city. No full address, no photo, no date of birth. For non-US offices, include nationality and work authorisation ('UK Citizen', 'EU Blue Card', 'OPT through 2027'). US summer-analyst applicants: add expected graduation month and year in this block so recruiters can slot you into the correct class.",
  },
  {
    order: 2,
    section: "Education",
    detail:
      "Institution, degree, classification (GPA to two decimals, First Class / 2:1, summa cum laude), relevant coursework (Financial Accounting, Corporate Finance, Valuation, Fixed Income, Derivatives), SAT/ACT scores if 1450+/32+, standardised test scores, honours and scholarships. MBA candidates lead with MBA school, then pre-MBA institution. Include study-abroad term with dates. Experienced hires with 8+ years may move education below professional experience.",
  },
  {
    order: 3,
    section: "Professional experience",
    detail:
      "Reverse chronological. Each role: employer, location (New York, London, Hong Kong), title, dates (Month Year – Month Year or 'Present'). 3-6 bullets per role. Deal experience gets its own sub-bullet structure when you have more than two deals. Every bullet states scope, describes your specific action, and closes with a quantified outcome. Analysts and Associates get more bullets per role; pre-university interns get fewer.",
  },
  {
    order: 4,
    section: "Deal experience (Analysts and Associates)",
    detail:
      "Either integrated into Professional Experience or broken out as its own section for candidates with 4+ live transactions. Each deal: client name (or 'confidential $1.2B diversified industrials target'), deal type (sell-side M&A, buy-side M&A, LBO financing, IPO, follow-on, high yield notes, restructuring), deal size, your specific workstream (built three-statement operating model, led diligence on four commercial workstreams, drafted S-1 business section). Name the model and memo deliverables.",
  },
  {
    order: 5,
    section: "Leadership, extracurriculars & additional",
    detail:
      "Named role titles (President, Portfolio Manager, Founder, Captain), sustained multi-year commitment, and measurable outcomes. Investment club portfolio managers, stock-pitch competition winners, PE Society researchers, published note authors, and D1 athletes are all high-weight signals. Then: languages (with proficiency: native / fluent / professional), technical skills (advanced Excel, Capital IQ, FactSet, Bloomberg, VBA, Python for finance), certifications (CFA Level 2, Series 79 progression, CPA candidate), and awards. This section is where partners screen for 'spike' at elite boutiques.",
  },
];

const BULLET_FORMULAS: {
  title: string;
  formula: string;
  example: string;
}[] = [
  {
    title: "M&A Sell-Side Bullet",
    formula:
      "[Supported / co-led / built] [workstream] on [sell-side advisory mandate] for [client type] to [buyer type]; [specific model / memo deliverable]; [deal status / outcome with $ size].",
    example:
      "Built three-statement operating model, DCF, and precedent-transaction analysis for $1.4B sell-side advisory of specialty-chemicals target to European strategic acquirer; drafted confidential information memorandum and management presentation; deal signed at 11.8x LTM EBITDA, 22% premium to sponsor's entry.",
  },
  {
    title: "Leveraged Finance / LBO Bullet",
    formula:
      "[Verb] [LBO model / financing deliverable] for [deal size / sponsor / target sector]; [structural detail — debt quantum, leverage, pricing]; delivered [outcome, commitment size, ratings].",
    example:
      "Built sponsor-side LBO model and capital-structure waterfall for $2.1B take-private of European software target; sized $1.35B TLB (6.5x leverage, SOFR+400) and $250M RCF; committee-approved financing commitment delivered to sponsor within 11 days; deal closed October 2025.",
  },
  {
    title: "IPO / ECM Bullet",
    formula:
      "[Verb] [ECM deliverable] for [issuer type / sector / size]; [role on syndicate]; priced at [outcome — P/E, P/S, % above range, first-day pop].",
    example:
      "Led book-building and S-1 registration for $720M NYSE IPO of vertical-SaaS issuer; structured dual-class share offering with 10-year sunset; JP Morgan joint-book with two other BBs; priced at $24.00 (top of $20-23 range), 14% first-day pop, $960M fully diluted market cap at close.",
  },
  {
    title: "Restructuring Bullet",
    formula:
      "[Verb] [restructuring workstream] for [debtor or creditor-committee mandate]; [legal/structural detail — DIP size, waterfall, covenant]; [outcome — plan support, emergence].",
    example:
      "Represented ad-hoc group of secured noteholders in $1.8B Chapter 11 of regional hospital system; built liquidation and going-concern recovery waterfall; negotiated $350M DIP facility with 'roll-up' of prepetition claims; plan confirmed with 92% class acceptance, emergence in 9 months.",
  },
  {
    title: "Markets / Sales & Trading Bullet",
    formula:
      "[Verb] [desk / flow / strategy] covering [asset class / client type]; [risk metric — notional, Greeks, PnL]; delivered [outcome — revenue, market share, client feedback].",
    example:
      "Supported rates flow desk covering top-20 real-money client base ($60B combined AUM); priced and managed risk on SOFR / UST / OIS swaps across 2-30y tenors with daily VaR $3.8M; contributed to $14M YTD desk PnL and top-3 ranking in Greenwich Coalition client review.",
  },
  {
    title: "Asset Management / Investment Analyst Bullet",
    formula:
      "[Verb] [coverage / research output] on [universe / sector / mandate]; [analytical methodology]; [outcome — position sizing, alpha, adoption].",
    example:
      "Covered 22-name large-cap US software universe for long-only active mandate ($14B AUM); built three-year revenue-and-margin build-up models, maintained comp set, authored 8 quarterly research notes; two high-conviction buys added at combined 240bps portfolio weight, contributing 85bps alpha vs Russell 1000 Growth over 12 months.",
  },
];

const FIRMS: {
  slug: string;
  name: string;
  tagline: string;
  distinctive: string;
}[] = [
  {
    slug: "goldman-sachs",
    name: "Goldman Sachs",
    tagline: "Precision, rigour, top-of-street IB and Markets franchises",
    distinctive:
      "Historical #1 in M&A and ECM league tables; Partnership culture; HireVue + Super Day; strong industry-group system (TMT, FIG, Healthcare, NR, Industrials); Marquee platform for markets.",
  },
  {
    slug: "jp-morgan",
    name: "JP Morgan",
    tagline: "Scale, universal-bank breadth, balance-sheet power",
    distinctive:
      "Top-3 across M&A, ECM, DCM, and LevFin globally; integrated coverage across Commercial, Private, Corporate & Investment Bank; 2-year Analyst programme with 3rd-year return; heavy diligence-and-execution training bar.",
  },
  {
    slug: "citi",
    name: "Citi",
    tagline: "Global emerging-markets footprint, corporate-bank leverage",
    distinctive:
      "Strongest EM franchise (LatAm, MENA, Asia ex-Japan); CIB model — one integrated revenue engine for corporate and institutional clients; Capital Markets Origination group is a named rotational pipeline for junior bankers.",
  },
  {
    slug: "morgan-stanley",
    name: "Morgan Stanley",
    tagline: "Advisory depth, TMT dominance, Wealth + Asset Management",
    distinctive:
      "#1 or #2 in Global Advisory and global ECM; TMT franchise leads industry for tech-M&A; integrated Wealth Management business drives ~45% of firm revenue; MS Integrated Firm model rotates Analysts across divisions.",
  },
  {
    slug: "blackrock",
    name: "BlackRock",
    tagline: "Largest asset manager, Aladdin platform, public markets scale",
    distinctive:
      "$10T+ AUM across active and index; Aladdin risk platform runs ~10% of global investable assets; private markets arm (BlackRock Alternatives, GIP, HPS-integrated, Preqin-powered) is the fastest-growing segment; investment-analyst screen is CFA-heavy and quantitative.",
  },
];

const ELITE_BOUTIQUES: {
  name: string;
  focus: string;
  distinctive: string;
}[] = [
  {
    name: "Evercore",
    focus: "M&A advisory, ECM, activism defense, restructuring",
    distinctive:
      "Largest elite boutique by headcount; deepest industry coverage among EBs; ISI equity research arm; strong US + London + Continental Europe footprint.",
  },
  {
    name: "Centerview Partners",
    focus: "Mega-cap M&A sell-side and buy-side advisory",
    distinctive:
      "Small Analyst class (~50 global); highest comp in IB; partners personally close deals without large teams; modelling bar is industry-highest for juniors.",
  },
  {
    name: "Lazard",
    focus: "Financial Advisory, Restructuring, Asset Management",
    distinctive:
      "Strongest Restructuring franchise alongside PJT and Houlihan; deep European footprint (Paris, Frankfurt, Milan); Asset Management business carves a different Analyst track.",
  },
  {
    name: "PJT Partners",
    focus: "Restructuring, Strategic Advisory, Park Hill (capital solutions)",
    distinctive:
      "Spun from Blackstone; Restructuring Group is the benchmark; Park Hill advises GPs on secondaries and fund placement; very small Associate class.",
  },
  {
    name: "Moelis & Company",
    focus: "M&A, Restructuring, Capital Markets advisory",
    distinctive:
      "Generalist Analyst programme (no industry lock-in first year); strong Middle Market and Sponsor coverage; growing EMEA presence.",
  },
  {
    name: "Perella Weinberg Partners",
    focus: "M&A, Restructuring, Asset Management",
    distinctive:
      "Smaller boutique with Tudor Pickering Holt-led Energy franchise; partner-led deal teams; New York + Houston + London.",
  },
  {
    name: "Qatalyst Partners",
    focus: "Tech sell-side advisory",
    distinctive:
      "Frank Quattrone-founded; exclusive tech sell-side boutique; highest modelling bar in IB; tiny Analyst class (under 20 globally); single-office San Francisco model.",
  },
  {
    name: "Guggenheim Securities",
    focus: "M&A advisory, Restructuring, Capital Markets",
    distinctive:
      "Fastest-growing EB in headcount; strong Healthcare, TMT, and FIG; private-placement arm across the Guggenheim platform.",
  },
];

const DIVISIONS: { name: string; keywords: string[]; bulletSignals: string }[] =
  [
    {
      name: "M&A (Mergers & Acquisitions)",
      keywords: [
        "sell-side",
        "buy-side",
        "fairness opinion",
        "accretion/dilution",
        "synergies",
        "DCF",
        "precedent transactions",
        "CIM",
        "pitch",
        "VDR / diligence",
      ],
      bulletSignals:
        "Deal size, buyer/target/sponsor, your deliverable (model, CIM, management presentation, fairness opinion), and deal status at exit.",
    },
    {
      name: "Leveraged Finance",
      keywords: [
        "LBO",
        "sponsor",
        "TLB",
        "RCF",
        "senior secured",
        "high yield",
        "OID",
        "PIK",
        "covenant-lite",
        "SOFR",
      ],
      bulletSignals:
        "Financing quantum, tranche structure (TLB/TLA/RCF/HY), leverage multiple (net debt / EBITDA), pricing (SOFR+bps), commitment vs underwrite, deal outcome.",
    },
    {
      name: "Equity Capital Markets",
      keywords: [
        "IPO",
        "follow-on",
        "convertible",
        "ATM",
        "S-1",
        "F-1",
        "book-building",
        "green shoe",
        "lock-up",
        "syndicate",
      ],
      bulletSignals:
        "Offering size, P/E or P/S multiple, syndicate position (sole book, joint book, co-manager), pricing outcome (% of range), first-day performance.",
    },
    {
      name: "Debt Capital Markets",
      keywords: [
        "investment grade",
        "high yield",
        "senior notes",
        "indenture",
        "make-whole",
        "tender offer",
        "consent solicitation",
        "roadshow",
        "bookrunner",
        "ratings",
      ],
      bulletSignals:
        "Issuance size, coupon and tenor, ratings (Moody's / S&P / Fitch), oversubscription, spread to benchmark, use of proceeds.",
    },
    {
      name: "Restructuring",
      keywords: [
        "Chapter 11",
        "Chapter 7",
        "DIP financing",
        "liability management",
        "ad-hoc group",
        "UCC",
        "plan of reorganization",
        "disclosure statement",
        "liquidation waterfall",
        "exchange offer",
      ],
      bulletSignals:
        "Debtor or creditor mandate, DIP size, recovery-waterfall analysis, plan confirmation outcome, time to emergence.",
    },
    {
      name: "Sales & Trading / Markets",
      keywords: [
        "market-making",
        "client coverage",
        "flow",
        "rates",
        "FX",
        "credit",
        "equities",
        "structured products",
        "VaR",
        "Greeks",
      ],
      bulletSignals:
        "Asset class, client-coverage scope (AUM covered, top-N clients), risk metrics (VaR, DV01, delta exposure), PnL contribution, Greenwich ranking.",
    },
    {
      name: "Asset Management / Investment Analyst",
      keywords: [
        "long-only",
        "long/short",
        "active management",
        "index",
        "ETF",
        "alpha",
        "tracking error",
        "benchmark",
        "AUM",
        "research note",
      ],
      bulletSignals:
        "Coverage universe (size, sector), AUM impact, buy/sell call accuracy, alpha generation, position sizing, analyst rating / PM adoption.",
    },
    {
      name: "Private Equity Coverage / Sponsors",
      keywords: [
        "financial sponsors",
        "LBO coverage",
        "dividend recap",
        "continuation fund",
        "GP-led secondary",
        "portfolio company",
        "add-on",
        "take-private",
        "carve-out",
        "club deal",
      ],
      bulletSignals:
        "Sponsor names covered, number of live processes, capital advised on (debt + equity), named transactions and outcome.",
    },
  ];

const COMMON_MISTAKES = [
  "Two-page resume at Analyst or Associate level — automatic screen reject at every bulge bracket and elite boutique",
  "Deal bullets without $ size, buyer/target/sponsor, and your specific workstream — generic 'supported M&A process' is a screen-kill phrase",
  "Missing or hidden GPA when above 3.5 at targets or 3.7 at semi-targets — recruiters interpret absence as sub-threshold",
  "Describing deliverables as 'worked on' or 'assisted with' rather than naming the model, memo, CIM, or management presentation you built or drafted",
  "Generic 'finance' framing when the role is division-specific (LevFin vs M&A vs ECM vs DCM vs Restructuring vs Markets)",
  "Missing Series 79 / CFA progression or false claims on level — recruiters verify with FINRA and CFA Institute",
  "Weak 'spike' section — investment-club membership listed without role title, portfolio size, or performance vs benchmark",
  "Language proficiency omitted for non-US offices — London for continental EU roles often needs French, German, Italian, or Spanish; Hong Kong needs Mandarin",
];

const FAQ = [
  {
    question: "How long should an investment banking resume be?",
    answer:
      "One page for every Analyst, Associate, and Vice President application across bulge-bracket and elite-boutique firms. Two pages are only acceptable for Managing Director or Partner-level lateral moves where there are 15+ years of named deal experience to list. A two-page CV at Analyst or Associate is an automatic screen reject — partners review your CV in under 45 seconds and a second page is read as inability to prioritise. Use 10-11pt body text, 0.5-inch margins, and cut ruthlessly.",
  },
  {
    question:
      "What is the difference between a bulge-bracket and elite-boutique resume?",
    answer:
      "Structurally identical — one page, education first, reverse-chronological experience, deal experience either integrated or broken out, then leadership and additional. The bar differs: elite boutiques (Centerview, PJT, Qatalyst, Evercore, Lazard, Moelis, Perella Weinberg, Guggenheim) expect deeper modelling signal — specific paper-LBO and three-statement fluency — while bulge brackets (Goldman Sachs, JP Morgan, Morgan Stanley, Citi, Bank of America, Barclays, Deutsche Bank, UBS, Credit Suisse legacy) weight breadth across divisions and product. Vocabulary differs by division: M&A, LevFin, ECM, DCM, Restructuring, Markets all have distinct keyword sets you must mirror.",
  },
  {
    question: "What GPA do I need for investment banking?",
    answer:
      "At bulge-bracket firms, competitive resumes from targets (Wharton, Stern, Harvard, Ross, Mendoza, LSE, Oxbridge, Bocconi, INSEAD, HEC) list 3.5+ GPA / First Class / 2:1 minimum. Semi-target and non-target candidates need 3.7+ plus a differentiating signal (winning stock-pitch, investment-club PM role, published research, early PE internship, quant competition). Elite boutiques (Centerview, Qatalyst) effectively require 3.7+ across the board and a visible spike. Do not hide your GPA — recruiters assume absence means sub-3.5 and screen accordingly. If your cumulative is lower but your finance-major GPA is higher, list both.",
  },
  {
    question: "How do I write an IB deal bullet for my resume?",
    answer:
      "Four elements: (1) deal type and size — '$1.4B sell-side advisory', '$720M IPO', '$350M DIP facility'; (2) client / buyer / target — 'specialty-chemicals target to European strategic acquirer', 'NYSE-listed vertical SaaS issuer'; (3) your specific workstream and deliverable — 'built three-statement operating model, DCF, and precedent-transaction analysis' or 'drafted S-1 business section'; (4) outcome — 'signed at 11.8x LTM EBITDA, 22% sponsor premium'. Avoid 'worked on', 'assisted with', 'supported the team' — these signal you did not own a workstream.",
  },
  {
    question:
      "Do I need Series 79, CFA, or CPA progression on my IB resume?",
    answer:
      "For US Analyst/Associate roles, Series 79 is required within weeks of joining — list 'Series 79 expected [date]' for incoming Analysts. CFA Level 1 is a differentiator for markets / research / asset-management roles (especially BlackRock, T. Rowe, Wellington, Fidelity, and active equity desks) and a modest plus for IB. CPA is rarely weighted in advisory but strongly weighted at BlackRock Alternatives for private-markets accounting roles, and at Lazard / PJT Restructuring for workout and financial-restructuring candidates. List only what you hold or are actively progressing — false certification claims are disqualifying.",
  },
  {
    question: "How do I tailor my IB resume to a specific division?",
    answer:
      "Read the firm's division page (JP Morgan Markets, Morgan Stanley TMT, Goldman Sachs Industrials, Citi CIB, BlackRock Fundamental Equities) and the posted job description. Mirror the division's vocabulary wherever honestly applicable — 'sell-side M&A', 'sponsor LBO', 'convertible issuance', 'ad-hoc creditor group', 'rates flow', 'long-only research'. Move the most division-relevant deal experience to the top of professional experience, even if not the most recent. Named model and memo deliverables signal fluency: 'three-statement operating model', 'LBO capital-structure waterfall', 'management presentation', 'confidential information memorandum', 'research initiation note'. See the individual firm guides for specific Goldman Sachs, JP Morgan, Morgan Stanley, Citi, and BlackRock tailoring details.",
  },
  {
    question:
      "Can I get an IB interview from a non-target school or non-finance major?",
    answer:
      "Yes — bulge brackets and boutiques increasingly recruit from non-targets if the CV signals finance depth. The path is a winning stock-pitch competition (Cornell, Ross, WISC, UCL, IOC), an investment-club PM role with a named portfolio and benchmark-comparable performance, a pre-IB internship at a regional bank or boutique, or a sustained research project with named methodology. Non-finance majors — Engineering, Physics, Math, CS — are well-regarded at Markets desks and at TMT / Healthcare industry groups because of the quantitative rigour. Your CV must compensate for the non-target signal with a visible, specific, quantified finance 'spike'.",
  },
  {
    question:
      "What are the most common reasons IB resumes get rejected at screen?",
    answer:
      "(1) Deal bullets without dollar size, counterparty, and your specific workstream. (2) Two-page resume at Analyst or Associate level. (3) Missing or weak spike — membership-level involvement in investment societies without named PM role, portfolio, or benchmark performance. (4) Generic 'finance' or 'banking' framing when the role is division-specific (M&A vs LevFin vs Restructuring vs Markets vs DCM). (5) Missing language proficiency for non-English-speaking offices. (6) No Series 79 / CFA signal on US bulge-bracket or asset-management applications. (7) Skills section with generic tools ('Microsoft Office', 'teamwork') rather than named fluencies (advanced Excel three-statement / LBO / M&A accretion-dilution, Capital IQ, FactSet, Bloomberg, VBA). WadeCV takes your existing CV, aligns it with a specific Goldman Sachs, JP Morgan, Morgan Stanley, Citi, or BlackRock job description, and fixes each of these failure patterns in one pass.",
  },
];

export default function InvestmentBankingResumePage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "Investment Banking Resume Guide 2026 — Bulge Bracket, Elite Boutique & How to Pass the Screen",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/investment-banking-resume`,
            },
            datePublished: "2026-04-21",
            dateModified: "2026-04-21",
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
        Investment Banking Resume Guide 2026 — Bulge Bracket, Elite Boutique
        and How to Pass the Screen
      </h1>

      <p className="text-muted-foreground mb-4">
        Investment banking resumes are screened by VPs, Directors, and MDs in
        under 45 seconds. The bar is high, the conventions are specific, and
        the difference between a Goldman M&A resume and a BlackRock
        Investment-Analyst resume is not cosmetic — it is structural. This
        guide covers the exact page structure recruiters expect, the
        deal-experience bullet formulas that pass bulge-bracket and
        elite-boutique screens, the vocabulary you need per division, and the
        common reasons otherwise strong candidates get rejected at CV review.
      </p>
      <p className="text-muted-foreground mb-6">
        Read it top-to-bottom if you are preparing Analyst, Associate, VP or
        lateral applications, or jump to the firm you are targeting —{" "}
        <Link href="/company-resume/goldman-sachs" className="underline">
          Goldman Sachs
        </Link>
        ,{" "}
        <Link href="/company-resume/jp-morgan" className="underline">
          JP Morgan
        </Link>
        ,{" "}
        <Link href="/company-resume/morgan-stanley" className="underline">
          Morgan Stanley
        </Link>
        ,{" "}
        <Link href="/company-resume/citi" className="underline">
          Citi
        </Link>
        ,{" "}
        <Link href="/company-resume/blackrock" className="underline">
          BlackRock
        </Link>{" "}
        — for firm-specific tailoring.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          The one-page IB resume: exact structure
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Every section in this order. No deviations for Analyst, Associate,
          or VP applications. The banker reviewing your CV reads top-down and
          expects to find the information in the canonical position.
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
              <CardContent className="text-sm text-muted-foreground">
                {s.detail}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Bulge bracket vs elite boutique: 7 screening differences
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Bulge brackets (Goldman Sachs, JP Morgan, Morgan Stanley, Citi, Bank
          of America, Barclays, Deutsche Bank, UBS) and elite boutiques
          (Evercore, Centerview, Lazard, PJT, Moelis, Perella Weinberg,
          Qatalyst, Guggenheim) share the one-page structure, but their
          screening bars differ in specific ways. Tailor accordingly.
        </p>
        <div className="space-y-3">
          {BB_VS_EB.map((d, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex flex-wrap items-center gap-2">
                  <Badge className="text-xs">{d.dimension}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>
                  <span className="text-foreground font-medium">
                    Bulge bracket:
                  </span>{" "}
                  {d.bulge}
                </div>
                <div>
                  <span className="text-foreground font-medium">
                    Elite boutique:
                  </span>{" "}
                  {d.boutique}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          The bulge brackets: Goldman Sachs, JP Morgan, Morgan Stanley, Citi,
          BlackRock
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Resume structure is identical across bulge brackets and large asset
          managers. Division mix, culture, and screening tools differ — click
          through for firm-specific guides.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {FIRMS.map((f) => (
            <Link
              key={f.slug}
              href={`/company-resume/${f.slug}`}
              className="block group"
            >
              <Card className="h-full transition-colors group-hover:bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base group-hover:text-primary">
                    {f.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{f.tagline}</p>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {f.distinctive}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <InlineCta variant="investment-banking" slug="investment-banking-resume" />

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Elite boutiques: the eight firms that matter
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Elite boutiques run small Analyst classes and partner-led deal
          teams. Your resume must signal the specific advisory product —
          generic &apos;financial-services&apos; or &apos;banking&apos; framing is a common reason
          for rejection at Centerview, PJT, and Qatalyst.
        </p>
        <div className="space-y-4">
          {ELITE_BOUTIQUES.map((f) => (
            <Card key={f.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{f.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>
                  <span className="text-foreground font-medium">Focus:</span>{" "}
                  {f.focus}
                </div>
                <div>{f.distinctive}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Six bullet formulas that pass banker screens
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Each formula is tested against a specific division screen — M&A
          sell-side, LevFin, ECM, Restructuring, Markets, or Asset Management.
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
        <h2 className="text-xl font-semibold mb-4">
          Division-specific keywords: what to mirror
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Investment banks organise around divisions (M&A, LevFin, ECM, DCM,
          Restructuring, Markets, Sponsors, Asset Management) and your CV
          should mirror the vocabulary of the target division wherever it is
          honestly applicable.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {DIVISIONS.map((d) => (
            <Card key={d.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{d.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {d.keywords.map((k) => (
                    <Badge key={k} variant="secondary" className="text-xs">
                      {k}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs">
                  <span className="text-foreground font-medium">
                    Bullet signals:
                  </span>{" "}
                  {d.bulletSignals}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          IB resume in 2026: what&apos;s changed
        </h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            Investment-banking CV screening in 2026 is more automated than it
            was five years ago, but the bar the MD applies on the Super Day
            read has not relaxed. HireVue video interviews and Pymetrics
            cognitive assessments now sit between the resume screen and the
            first in-person round at Goldman, JP Morgan, Morgan Stanley and
            Citi — but neither rescues a weak CV. The resume remains the
            gatekeeper across bulge-bracket and elite-boutique firms.
          </p>
          <p>
            What has changed is the weight on private-markets and
            alternatives signals. BlackRock Alternatives, GIP, HPS (now
            BlackRock-integrated), Preqin (now BlackRock-integrated), and the
            private-markets pods at Goldman, JP Morgan, and Morgan Stanley are
            the fastest-growing revenue segments and the heaviest lateral
            hirers. If your experience includes LBO modelling, sponsor
            coverage, continuation-fund advisory, GP-led secondaries, or
            private-credit analysis, lead with those bullets over generic
            advisory experience when targeting a sponsors or alts role.
          </p>
          <p>
            AI-assisted CV writing is widespread among applicants and
            recruiters know it. AI-drafted bullets that sound generic but lack
            the deal-specific texture — real deal sizes, real counterparties,
            real model and memo deliverables — read as &apos;low-conviction&apos; and
            get cut. Humanising an AI-drafted IB CV means replacing vague
            language (&apos;supported M&amp;A process&apos;) with specific signals (&apos;built
            three-statement operating model and DCF for $1.4B sell-side of
            specialty-chemicals target&apos;). See our{" "}
            <Link href="/humanize-ai-resume" className="underline">
              humanize AI resume guide
            </Link>{" "}
            for techniques that work at banker screening scale.
          </p>
          <p>
            Finally: the rise of direct Associate-to-Buyside lateral flows.
            Mega-funds (Blackstone, KKR, Apollo, Carlyle, Bain Capital, TPG)
            and large long-only managers (BlackRock, Fidelity, T. Rowe Price,
            Wellington, Capital Group) recruit heavily from third-year IB
            Analysts and first-year Associates. Your lateral CV should
            emphasise deal-by-deal experience with named model and memo
            deliverables, position yourself within a sector or product
            franchise, and show any CFA / CPA / published research
            progression.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Eight common IB resume mistakes
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
          {COMMON_MISTAKES.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
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
        currentCategory="/investment-banking-resume"
        contextLinks={[
          {
            href: "/company-resume/goldman-sachs",
            label: "Goldman Sachs Resume Guide",
          },
          {
            href: "/company-resume/jp-morgan",
            label: "JP Morgan Resume Guide",
          },
          {
            href: "/company-resume/morgan-stanley",
            label: "Morgan Stanley Resume Guide",
          },
          { href: "/company-resume/citi", label: "Citi Resume Guide" },
          {
            href: "/company-resume/blackrock",
            label: "BlackRock Resume Guide",
          },
          {
            href: "/consulting-resume",
            label: "Consulting Resume Guide (MBB + Big 4)",
          },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>
            Tailor your CV to a specific bulge-bracket or elite-boutique role
            — free to start
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Paste a Goldman Sachs, JP Morgan, Morgan Stanley, Citi, BlackRock
            or elite-boutique job URL. WadeCV analyses the division, the
            level, and the job description, rewrites every bullet with
            quantified deal outcomes from your history, and reformats to the
            one-page banker standard. First fit analysis is free.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta
            variant="company"
            label="Tailor my CV to an IB role"
            slug="investment-banking-resume"
          />
        </CardContent>
      </Card>
    </article>
  );
}
