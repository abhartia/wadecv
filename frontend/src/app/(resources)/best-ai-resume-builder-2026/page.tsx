import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoCta } from "@/components/seo/seo-cta";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://wadecv.com");

export const metadata = {
  title: "12 Best AI Resume Builders in 2026 (Tested & Ranked) | WadeCV",
  description:
    "We tested WadeCV, Teal, Jobscan, Zety, FlowCV, Kickresume, Novoresume, Wobo AI, AiApply, Enhancv, ChatGPT, and Claude AI to find the best AI resume builder in 2026. Full comparison with pros, cons, and pricing.",
  openGraph: {
    title: "12 Best AI Resume Builders in 2026 (Tested & Ranked)",
    description:
      "We tested 12 AI resume builders including WadeCV, Teal, Jobscan, Claude AI, ChatGPT, AiApply, and Enhancv. Here is the honest comparison.",
  },
  twitter: {
    card: "summary" as const,
    title: "12 Best AI Resume Builders in 2026 (Tested & Ranked)",
    description:
      "Full breakdown of the top AI resume builders: WadeCV, Teal, Jobscan, Claude AI, ChatGPT, AiApply, and more.",
  },
};

type Tool = {
  name: string;
  tagline: string;
  bestFor: string;
  pricing: string;
  verdict: "top-pick" | "runner-up" | "niche" | "avoid";
  pros: string[];
  cons: string[];
  atsScore: number; // 1-5
  tailoringScore: number; // 1-5
  easeScore: number; // 1-5
};

const TOOLS: Tool[] = [
  {
    name: "WadeCV",
    tagline: "Purpose-built for job-specific resume tailoring",
    bestFor: "Tailoring your existing resume to specific job descriptions",
    pricing: "Pay-per-use — from $0.50/resume. No subscription.",
    verdict: "top-pick",
    pros: [
      "Pastes a job URL — no copy-pasting the job description",
      "Gap analysis before tailoring (see your fit score first)",
      "Rewrites your real experience — no hallucination",
      "ATS-tested DOCX output with clean formatting",
      "Free cover letter with every tailored resume",
      "Section-by-section editing after generation",
    ],
    cons: [
      "Newer product with smaller community than established tools",
      "Requires an existing CV to start (not a from-scratch builder)",
    ],
    atsScore: 5,
    tailoringScore: 5,
    easeScore: 5,
  },
  {
    name: "Teal",
    tagline: "Job tracker with AI resume features",
    bestFor: "Managing multiple job applications in one place",
    pricing: "Free plan available; Pro at $29/month",
    verdict: "runner-up",
    pros: [
      "Excellent job tracker and application pipeline view",
      "Chrome extension captures job listings automatically",
      "Good AI resume bullet suggestions",
      "Clean, modern interface",
    ],
    cons: [
      "Resume tailoring is less precise than dedicated tools",
      "Pro features gated behind $29/month subscription",
      "ATS optimization feedback is surface-level",
    ],
    atsScore: 3,
    tailoringScore: 3,
    easeScore: 4,
  },
  {
    name: "Jobscan",
    tagline: "ATS match scoring and keyword analysis",
    bestFor: "Diagnosing why your resume is failing ATS screening",
    pricing: "Free scan (3/month); Pro at $49.95/month",
    verdict: "niche",
    pros: [
      "Detailed ATS match score with keyword breakdown",
      "Shows exactly which keywords are missing",
      "Supports many ATS systems (Workday, Taleo, Greenhouse)",
      "Long-established product with good data",
    ],
    cons: [
      "Expensive at $50/month for full access",
      "Tells you what's wrong but doesn't fix it for you",
      "Resume builder output quality is mediocre",
      "UX feels dated compared to newer tools",
    ],
    atsScore: 5,
    tailoringScore: 2,
    easeScore: 2,
  },
  {
    name: "Zety",
    tagline: "Template-based resume builder with pre-written content",
    bestFor: "Building a polished resume from scratch with professional templates",
    pricing: "Free to create; download requires subscription (~$24.99/month)",
    verdict: "niche",
    pros: [
      "20+ professional, visually polished resume templates",
      "Pre-written bullet point suggestions by job title",
      "Cover letter builder with matching templates",
      "Intuitive drag-and-drop editor",
    ],
    cons: [
      "No per-job tailoring — builds one generic resume",
      "Requires a subscription to download or export",
      "No job URL scraping or keyword analysis",
      "Content suggestions are generic, not job-specific",
    ],
    atsScore: 3,
    tailoringScore: 1,
    easeScore: 5,
  },
  {
    name: "FlowCV",
    tagline: "Free resume builder with modern templates",
    bestFor: "Creating a visually attractive resume at no cost",
    pricing: "Free plan with full features; Pro at $4.99/month for premium templates",
    verdict: "niche",
    pros: [
      "Genuinely free — export without watermarks on the free plan",
      "Clean, modern templates with good typography",
      "Real-time preview as you edit",
      "Simple and fast to use",
    ],
    cons: [
      "No AI tailoring or job-description matching",
      "No ATS keyword analysis",
      "Design-focused — prioritizes looks over ATS optimization",
      "No job scraping or application tracking",
    ],
    atsScore: 2,
    tailoringScore: 1,
    easeScore: 5,
  },
  {
    name: "Kickresume",
    tagline: "Template-first resume builder with AI assist",
    bestFor: "Creating a visually polished resume from scratch",
    pricing: "Free plan; Premium at $10/month",
    verdict: "niche",
    pros: [
      "Beautiful resume templates",
      "Good AI content suggestions for bullet points",
      "Cover letter builder included",
      "Affordable compared to competitors",
    ],
    cons: [
      "Not optimized for ATS — visual templates can break parsing",
      "Job-description tailoring is basic",
      "No URL-based job scraping",
    ],
    atsScore: 2,
    tailoringScore: 2,
    easeScore: 4,
  },
  {
    name: "Novoresume",
    tagline: "Simple resume builder with real-time tips",
    bestFor: "Entry-level job seekers building their first resume",
    pricing: "Free basic; Premium at $19.99/month",
    verdict: "niche",
    pros: [
      "Real-time content suggestions as you type",
      "Clean templates that work in most ATS",
      "Good for students and recent graduates",
    ],
    cons: [
      "AI tailoring features are limited",
      "No job-description keyword matching",
      "Feels generic — no differentiation for specific roles",
    ],
    atsScore: 3,
    tailoringScore: 1,
    easeScore: 4,
  },
  {
    name: "Wobo AI",
    tagline: "AI job application assistant",
    bestFor: "Automating large-scale job applications",
    pricing: "Subscription-based (varies)",
    verdict: "niche",
    pros: [
      "Automates repetitive application form filling",
      "Fast — applies to many jobs quickly",
    ],
    cons: [
      "Volume over quality — low-personalization output",
      "Mass-applying reduces your response rate per application",
      "ATS and recruiter detection risk for auto-applied resumes",
    ],
    atsScore: 2,
    tailoringScore: 1,
    easeScore: 3,
  },
  {
    name: "AiApply",
    tagline: "Auto-apply automation across job boards",
    bestFor: "Mass-applying to jobs with minimal manual effort",
    pricing: "From ~$29/month for auto-apply credits",
    verdict: "niche",
    pros: [
      "Automates application submission across LinkedIn, Indeed, and Glassdoor",
      "Generates cover letters per application",
      "Application tracking built in",
      "Saves significant time on repetitive form filling",
    ],
    cons: [
      "Resume content is not deeply tailored per job",
      "Mass-applying can trigger recruiter red flags",
      "Generic applications have lower callback rates",
      "No fit/gap analysis before applying",
    ],
    atsScore: 2,
    tailoringScore: 2,
    easeScore: 4,
  },
  {
    name: "Enhancv",
    tagline: "Visual resume builder with content analysis",
    bestFor: "Creating a modern, design-forward resume with content feedback",
    pricing: "Free plan; Pro at $19.99/month",
    verdict: "niche",
    pros: [
      "Strong visual design with modern, creative templates",
      "Content analyzer gives feedback on resume sections",
      "Good balance between design and ATS compatibility",
      "Supports multiple resume formats (one-page, two-page, cover letter)",
    ],
    cons: [
      "No per-job tailoring from a job URL",
      "Content suggestions are generic, not job-specific",
      "Pro features require a monthly subscription",
      "No gap analysis or keyword matching",
    ],
    atsScore: 3,
    tailoringScore: 2,
    easeScore: 4,
  },
  {
    name: "ChatGPT",
    tagline: "General-purpose AI that can write resumes",
    bestFor: "Brainstorming bullet points or drafting from scratch",
    pricing: "Free; GPT-4 at $20/month",
    verdict: "avoid",
    pros: [
      "Free to use for basic tasks",
      "Very flexible — can handle any writing task",
      "Good for initial brainstorming",
    ],
    cons: [
      "Cannot access job URLs — must copy-paste manually",
      "No ATS formatting output",
      "Hallucinates experience and credentials",
      "No fit scoring or gap analysis",
      "Every prompt is a one-off — no memory of your resume",
    ],
    atsScore: 1,
    tailoringScore: 2,
    easeScore: 3,
  },
  {
    name: "Claude AI",
    tagline: "Anthropic's chatbot — strong writing, no resume tooling",
    bestFor:
      "Brainstorming narrative summaries and drafting bullets with the best generalist writing model",
    pricing: "Free tier with message limits; Claude Pro at $20/month",
    verdict: "avoid",
    pros: [
      "Best-in-class general writing quality among AI chatbots",
      "Claude Projects lets you attach your CV as persistent context",
      "Lower hallucination rate than most general chatbots",
      "Strong at nuanced career-transition narratives",
    ],
    cons: [
      "Cannot open LinkedIn, Indeed, or Greenhouse job URLs from chat",
      "Output is prose or Markdown — you format the DOCX yourself",
      "No structured fit score or gap analysis",
      "No cover letter pairing or application tracking",
      "Every new job is a fresh prompt — no repeatable pipeline",
    ],
    atsScore: 1,
    tailoringScore: 2,
    easeScore: 3,
  },
];

const SCORE_BAR = (score: number) => "★".repeat(score) + "☆".repeat(5 - score);

const FAQ = [
  {
    q: "What is the best AI resume builder in 2026?",
    a: "For job-specific tailoring, WadeCV is the top pick in 2026. It automatically matches your experience to a job description, generates an ATS-safe DOCX, and includes a gap analysis before you commit. For job tracking alongside resume management, Teal is a strong runner-up. For pure ATS keyword analysis, Jobscan is the specialist.",
  },
  {
    q: "Can AI resume builders pass ATS screening?",
    a: "It depends on the tool. WadeCV and Jobscan are purpose-built for ATS compliance — they generate clean DOCX files with proper heading structure and keyword density. Template-first builders like Kickresume or Novoresume may use visually appealing layouts that ATS parsers struggle with. Always check whether the tool exports a plain, structured DOCX rather than a PDF with graphics.",
  },
  {
    q: "Is it safe to use AI to write my resume?",
    a: "Yes, if the tool works from your existing experience rather than inventing new content. WadeCV rewrites and reorders your real experience — it does not add jobs or skills you don't have. ChatGPT and similar general tools are more likely to hallucinate qualifications, so you need to review every line carefully.",
  },
  {
    q: "How much do AI resume builders cost?",
    a: "Costs range from free to $50/month. WadeCV uses pay-per-use pricing starting at $0.50 per resume — ideal if you're applying to a handful of targeted roles. Teal charges $29/month. Jobscan charges $49.95/month for full access. ChatGPT is free but requires significant manual work to produce an ATS-ready output.",
  },
  {
    q: "Should I use a different resume for each job application?",
    a: "Yes — tailored resumes consistently outperform generic ones. Research shows that resumes matched to a specific job description get significantly higher callback rates, especially for ATS-screened positions where keyword matching determines who advances. Tools like WadeCV make this practical by automating the tailoring process per job.",
  },
  {
    q: "What is Teal resume builder and is it free?",
    a: "Teal is an AI resume builder and job application tracker. It has a free plan that includes basic resume building and job tracking. The Pro plan at $29/month adds AI-powered resume scoring and additional tailoring features. Teal is best suited for people who want to manage a large job search pipeline in one place.",
  },
];

export default function BestAiResumeBuilderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "12 Best AI Resume Builders in 2026 (Tested & Ranked)",
    description: metadata.description,
    author: { "@type": "Organization", name: "WadeCV" },
    publisher: { "@type": "Organization", name: "WadeCV", url: BASE_URL },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/best-ai-resume-builder-2026`,
    },
    dateModified: "2026-04-17",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <h1 className="text-3xl font-bold mb-3">
        12 Best AI Resume Builders in 2026 (Tested &amp; Ranked)
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Last updated: April 2026 · Tools tested: WadeCV, Teal, Jobscan,
        Zety, FlowCV, Kickresume, Novoresume, Wobo AI, AiApply, Enhancv,
        ChatGPT, Claude AI
      </p>

      <p className="text-muted-foreground mb-8">
        AI resume builders are not created equal. Some are glorified template
        editors with a GPT button bolted on. Others automate mass applications
        with generic resumes. And some — like ChatGPT and Claude — are great
        general writing tools that users have adopted for resumes, even though
        they lack resume-specific workflow. The best purpose-built tools are
        genuinely designed around the job-tailoring workflow — keyword
        extraction, ATS formatting, and gap analysis. We tested twelve of the
        most-searched tools in 2026 and ranked them on three criteria that
        actually matter: ATS compatibility, job-tailoring quality, and ease
        of use.
      </p>

      {/* Quick comparison table */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Quick comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-medium">Tool</th>
                <th className="text-left py-2 pr-4 font-medium">Best for</th>
                <th className="text-left py-2 pr-4 font-medium">ATS</th>
                <th className="text-left py-2 pr-4 font-medium">Tailoring</th>
                <th className="text-left py-2 font-medium">Pricing</th>
              </tr>
            </thead>
            <tbody>
              {TOOLS.map((tool) => (
                <tr key={tool.name} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-medium">
                    {tool.name}
                    {tool.verdict === "top-pick" && (
                      <Badge className="ml-2 text-xs">Top pick</Badge>
                    )}
                    {tool.verdict === "runner-up" && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Runner-up
                      </Badge>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {tool.bestFor}
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground text-xs">
                    {SCORE_BAR(tool.atsScore)}
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground text-xs">
                    {SCORE_BAR(tool.tailoringScore)}
                  </td>
                  <td className="py-2 text-muted-foreground">{tool.pricing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Individual tool reviews */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-6">Full reviews</h2>
        <div className="space-y-6">
          {TOOLS.map((tool, i) => (
            <Card key={tool.name} id={tool.name.toLowerCase().replace(/\s+/g, "-")}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-muted-foreground font-normal text-base">
                    #{i + 1}
                  </span>
                  {tool.name}
                  {tool.verdict === "top-pick" && (
                    <Badge className="text-xs">Top pick</Badge>
                  )}
                  {tool.verdict === "runner-up" && (
                    <Badge variant="secondary" className="text-xs">
                      Runner-up
                    </Badge>
                  )}
                  {tool.verdict === "avoid" && (
                    <Badge variant="outline" className="text-xs">
                      Use with caution
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{tool.tagline}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      ATS
                    </p>
                    <p className="text-xs">{SCORE_BAR(tool.atsScore)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Tailoring
                    </p>
                    <p className="text-xs">{SCORE_BAR(tool.tailoringScore)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Ease of use
                    </p>
                    <p className="text-xs">{SCORE_BAR(tool.easeScore)}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">Pros</p>
                    <ul className="space-y-1 text-muted-foreground">
                      {tool.pros.map((pro) => (
                        <li key={pro} className="flex gap-2">
                          <span className="text-green-600 shrink-0">✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Cons</p>
                    <ul className="space-y-1 text-muted-foreground">
                      {tool.cons.map((con) => (
                        <li key={con} className="flex gap-2">
                          <span className="text-red-500 shrink-0">✗</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Pricing:</span>{" "}
                  {tool.pricing}
                </p>

                {tool.name === "WadeCV" && (
                  <SeoCta
                    variant="job"
                    label="Try WadeCV free — 1 credit included"
                    slug="best-ai-resume-builder"
                  />
                )}

                {tool.name === "Teal" && (
                  <p className="text-sm text-muted-foreground">
                    See our{" "}
                    <Link
                      href="/wadecv-vs-teal"
                      className="underline underline-offset-2"
                    >
                      WadeCV vs Teal head-to-head comparison
                    </Link>
                    .
                  </p>
                )}

                {tool.name === "Jobscan" && (
                  <p className="text-sm text-muted-foreground">
                    See our{" "}
                    <Link
                      href="/wadecv-vs-jobscan"
                      className="underline underline-offset-2"
                    >
                      WadeCV vs Jobscan head-to-head comparison
                    </Link>
                    .
                  </p>
                )}

                {tool.name === "Wobo AI" && (
                  <p className="text-sm text-muted-foreground">
                    See our{" "}
                    <Link
                      href="/wadecv-vs-wobo"
                      className="underline underline-offset-2"
                    >
                      WadeCV vs Wobo AI head-to-head comparison
                    </Link>
                    .
                  </p>
                )}

                {tool.name === "Zety" && (
                  <p className="text-sm text-muted-foreground">
                    See our{" "}
                    <Link
                      href="/wadecv-vs-zety"
                      className="underline underline-offset-2"
                    >
                      WadeCV vs Zety head-to-head comparison
                    </Link>
                    .
                  </p>
                )}

                {tool.name === "FlowCV" && (
                  <p className="text-sm text-muted-foreground">
                    See our{" "}
                    <Link
                      href="/wadecv-vs-flowcv"
                      className="underline underline-offset-2"
                    >
                      WadeCV vs FlowCV head-to-head comparison
                    </Link>
                    .
                  </p>
                )}

                {tool.name === "AiApply" && (
                  <p className="text-sm text-muted-foreground">
                    See our{" "}
                    <Link
                      href="/wadecv-vs-aiapply"
                      className="underline underline-offset-2"
                    >
                      WadeCV vs AiApply head-to-head comparison
                    </Link>
                    .
                  </p>
                )}

                {tool.name === "Enhancv" && (
                  <p className="text-sm text-muted-foreground">
                    See our{" "}
                    <Link
                      href="/wadecv-vs-enhancv"
                      className="underline underline-offset-2"
                    >
                      WadeCV vs Enhancv head-to-head comparison
                    </Link>
                    .
                  </p>
                )}

                {tool.name === "ChatGPT" && (
                  <p className="text-sm text-muted-foreground">
                    See our{" "}
                    <Link
                      href="/ai-resume-builder-comparison"
                      className="underline underline-offset-2"
                    >
                      WadeCV vs ChatGPT head-to-head comparison
                    </Link>
                    .
                  </p>
                )}

                {tool.name === "Claude AI" && (
                  <p className="text-sm text-muted-foreground">
                    See our{" "}
                    <Link
                      href="/wadecv-vs-claude"
                      className="underline underline-offset-2"
                    >
                      WadeCV vs Claude AI head-to-head comparison
                    </Link>
                    .
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Verdict */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">The verdict</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">
              For tailoring your resume to specific jobs:
            </span>{" "}
            WadeCV. It is the only tool that automates the full workflow — job
            URL scraping, gap analysis, tailored rewrite, and ATS-safe export —
            without a monthly subscription.
          </p>
          <p>
            <span className="font-medium text-foreground">
              For managing a large job search pipeline:
            </span>{" "}
            Teal. The application tracker is genuinely useful if you are
            applying to 20+ roles and want to stay organised.
          </p>
          <p>
            <span className="font-medium text-foreground">
              For diagnosing ATS failures on an existing resume:
            </span>{" "}
            Jobscan. Expensive, but the keyword match analysis is the most
            detailed available.
          </p>
          <p>
            <span className="font-medium text-foreground">
              For building your first resume from scratch:
            </span>{" "}
            Zety, Novoresume, or Kickresume — then switch to WadeCV once you
            have a base CV to tailor.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {FAQ.map((item) => (
            <div key={item.q}>
              <h3 className="font-medium mb-2">{item.q}</h3>
              <p className="text-muted-foreground text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <CrossCategoryLinks currentCategory="/best-ai-resume-builder-2026" />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Try the top-ranked tool free</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your CV, paste a job URL, get a fit score, and generate a
            tailored resume — all in under 2 minutes. Your first analysis is
            free.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta
            variant="job"
            label="Get started with WadeCV"
            slug="best-ai-resume-builder-bottom"
          />
        </CardContent>
      </Card>
    </article>
  );
}
