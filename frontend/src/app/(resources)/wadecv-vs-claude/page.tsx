import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoCta } from "@/components/seo/seo-cta";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";
import { InlineCta } from "@/components/seo/inline-cta";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://wadecv.com");

export const metadata = {
  title: "WadeCV vs Claude AI for Resumes: Which Is Better in 2026? | WadeCV",
  description:
    "Using Claude AI to write your resume vs. a purpose-built tailoring tool like WadeCV. Job URL scraping, ATS formatting, gap analysis, and DOCX output compared side by side.",
  openGraph: {
    title: "WadeCV vs Claude AI for Resumes: Which Is Better in 2026?",
    description:
      "Claude AI is great at writing, but is it the right tool for job-specific resume tailoring? A feature-by-feature breakdown vs WadeCV.",
  },
  twitter: {
    card: "summary" as const,
    title: "WadeCV vs Claude AI for Resumes: Which Is Better in 2026?",
    description:
      "Claude AI is great at writing, but is it the right tool for job-specific resume tailoring? Side-by-side with WadeCV.",
  },
};

const ROWS: {
  feature: string;
  claude: string;
  wadecv: string;
  verdict: "wadecv" | "claude" | "tie";
}[] = [
  {
    feature: "Core approach",
    claude:
      "General-purpose conversational AI. You describe what you want, paste your CV and a job description, and prompt Claude to rewrite. Every session starts from scratch unless you use Projects.",
    wadecv:
      "Purpose-built resume tailoring pipeline. Import your CV once, paste a job URL, and WadeCV runs keyword extraction, gap analysis, and targeted rewriting as a repeatable workflow.",
    verdict: "tie",
  },
  {
    feature: "Writing quality",
    claude:
      "Claude is one of the best models available for long-form writing — natural, non-robotic prose and strong reasoning about nuanced phrasing. Fewer obvious AI tells than most general chatbots.",
    wadecv:
      "Uses a tailoring-specific prompt chain on top of a modern LLM, tuned for resume bullets, quantified impact statements, and ATS keyword density rather than essay-style writing.",
    verdict: "claude",
  },
  {
    feature: "Job URL scraping",
    claude:
      "Claude cannot open arbitrary URLs from the chat. You must copy the full job description and paste it into the conversation — awkward for multi-page LinkedIn or Greenhouse listings.",
    wadecv:
      "Paste any LinkedIn, Indeed, Greenhouse, Lever, or direct-careers URL. WadeCV scrapes the job title, company, and full description automatically.",
    verdict: "wadecv",
  },
  {
    feature: "ATS-safe DOCX export",
    claude:
      "Output is conversational text or Markdown. To get a DOCX you copy the text, paste it into Word or Google Docs, then manually fix headings, bullets, spacing, and date formatting.",
    wadecv:
      "Generates a production-ready DOCX with proper heading levels, bullet structure, consistent date formatting, and ATS-tested section order — ready to upload.",
    verdict: "wadecv",
  },
  {
    feature: "Fit and gap analysis",
    claude:
      "You can ask Claude to score your fit, but the output is unstructured prose. No persistent score, no keyword coverage chart, no side-by-side gap list.",
    wadecv:
      "Structured fit score (0-100), strengths summary, and a ranked gap list showing missing keywords and experience. Runs as a discrete step before you commit to tailoring.",
    verdict: "wadecv",
  },
  {
    feature: "Preserves your real experience",
    claude:
      "Claude hallucinates less than most general chatbots, but still occasionally embellishes or invents credentials in long rewrites. Every bullet needs a manual fact-check.",
    wadecv:
      "Hard-constrained to rewrite only what exists in your uploaded CV plus clarifications you provide. Cannot add jobs, employers, dates, or certifications you did not enter.",
    verdict: "wadecv",
  },
  {
    feature: "Section-by-section editing",
    claude:
      "Chat is linear. Regenerating just the summary usually shifts other sections on the next response. Keeping a locked skills list while rewriting experience takes careful prompting.",
    wadecv:
      "Edit the summary, a single experience bullet, a skills cluster, or education independently. The rest of the CV stays untouched between generations.",
    verdict: "wadecv",
  },
  {
    feature: "Memory of your CV",
    claude:
      "Default chats have no memory. Claude Projects lets you attach your CV as persistent context, but you still need to manually reintroduce the job description and your tailoring preferences every time.",
    wadecv:
      "Your base CV and clarifications persist across jobs. Every tailoring run reuses your profile automatically — you only paste the next job URL.",
    verdict: "wadecv",
  },
  {
    feature: "Cover letter paired with CV",
    claude:
      "Can generate a cover letter in the same chat, but you have to prompt for it separately and manually match tone and keywords to the resume you just generated.",
    wadecv:
      "Every tailored CV comes with a matching cover letter automatically — same job description, consistent tone, shared keyword set. No extra credit charged.",
    verdict: "wadecv",
  },
  {
    feature: "Physical mail delivery",
    claude:
      "Not supported. Claude can write the letter, but you handle printing, paper, envelopes, addressing, and postage yourself.",
    wadecv:
      "Send a printed CV and cover letter directly to any US company via USPS First Class mail, for 5 credits. Printed professionally and tracked.",
    verdict: "wadecv",
  },
  {
    feature: "Application tracking",
    claude:
      "None. Each chat is disconnected from the next. You keep your own spreadsheet of companies, roles, dates, and statuses.",
    wadecv:
      "Built-in application tracker with job, company, stage, and linked tailored CV for every application you have generated.",
    verdict: "wadecv",
  },
  {
    feature: "Pricing model",
    claude:
      "Free tier with message limits. Claude Pro at $20/month for higher limits, Projects, and full access to the best models. Teams and API usage billed separately.",
    wadecv:
      "Pay-per-use credits — no subscription. Starter: 20 credits for $10 ($0.50 per fit analysis, CV generation free after that). 1 free credit on signup.",
    verdict: "wadecv",
  },
];

const FAQ = [
  {
    question: "Can I use Claude AI to write my resume?",
    answer:
      "Yes. Claude is one of the best general-purpose AI writing tools available, and with careful prompting it can produce strong resume bullets and summaries. The tradeoff is manual work: you copy and paste the job description, format the output yourself in Word or Google Docs, check for hallucinated credentials, and repeat the full process for every role. Claude is also not ATS-aware — you have to know which formatting choices will parse cleanly.",
  },
  {
    question: "Is WadeCV better than Claude for resumes?",
    answer:
      "For general writing help, Claude is excellent. For job-specific resume tailoring as a repeatable workflow, WadeCV is built for the job. WadeCV scrapes job URLs, produces a structured fit score, generates an ATS-safe DOCX, and pairs a tailored cover letter with every resume. Claude can do pieces of that with the right prompts, but you manage the workflow yourself every single time.",
  },
  {
    question: "Does Claude AI know about ATS formatting?",
    answer:
      "Claude can describe ATS best practices accurately if you ask. What it does not do is enforce those practices in its output. You still receive Markdown or prose that needs manual formatting into a DOCX, and it will not warn you if you paste a template that uses columns, text boxes, or graphics that break ATS parsing. WadeCV generates an ATS-tested DOCX by default — you do not have to know the rules.",
  },
  {
    question: "Can Claude access a LinkedIn or Indeed job URL?",
    answer:
      "Not directly in the chat. Claude cannot open URLs in standard conversations — you need to copy the full job description into the message. This gets tedious for long LinkedIn listings, Greenhouse boards with multiple expandable sections, or Lever pages that load content dynamically. WadeCV handles URL scraping automatically for LinkedIn, Indeed, Greenhouse, Lever, and direct careers pages.",
  },
  {
    question: "Does Claude hallucinate on resumes?",
    answer:
      "Less than most general models, but it still happens — especially on long rewrites where it may infer a certification, a tool, or a responsibility that was not in your original CV. Every bullet needs a human review for factual accuracy. WadeCV is constrained to rewrite only content from your uploaded CV and any clarifications you explicitly add, so it cannot invent credentials.",
  },
  {
    question: "Can I use Claude and WadeCV together?",
    answer:
      "Yes — they complement each other well. Use Claude to brainstorm how to frame a career pivot, draft a narrative summary, or reason through a tricky gap. Then use WadeCV to turn that thinking into a job-specific tailored CV with ATS-safe formatting, gap analysis, and a matching cover letter. Many users draft in Claude and finalise in WadeCV.",
  },
];

export default function ClaudeComparisonPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "WadeCV vs Claude AI for Resumes: Which Is Better in 2026?",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/wadecv-vs-claude`,
            },
            datePublished: "2026-04-17",
            dateModified: "2026-04-17",
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
        WadeCV vs Claude AI: Can a General Chatbot Tailor Your Resume?
      </h1>

      <p className="text-muted-foreground mb-6">
        Claude AI is Anthropic&apos;s general-purpose chat assistant and one of the most capable AI
        writing tools on the market. Millions of job seekers now paste their CV plus a job
        description into Claude and ask it to rewrite. It works — to a point. WadeCV takes a
        different approach: instead of a blank chat box, it runs a repeatable tailoring pipeline
        built specifically for resumes — job URL scraping, structured fit analysis, ATS-safe DOCX
        output, and a matched cover letter on every run. Here is how the two compare across
        features, workflow, and output quality.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Feature comparison: WadeCV vs Claude AI</h2>
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
                  {row.verdict === "claude" && (
                    <Badge variant="secondary" className="text-xs">
                      Claude wins
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
                  <p className="font-medium text-foreground mb-1">Claude AI</p>
                  <p>{row.claude}</p>
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

      <InlineCta variant="job" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">When Claude AI is the better choice</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You want to brainstorm how to frame a difficult career transition, employment gap, or
            pivot before you start writing bullets.
          </li>
          <li>
            You are drafting a narrative personal statement, bio, or LinkedIn summary where tone and
            voice matter more than keyword density.
          </li>
          <li>
            You already have Claude Pro or Projects set up and prefer a conversational workflow
            where you can iterate through chat.
          </li>
          <li>
            You are writing a single resume for a role you have deep context on, and do not need ATS
            parsing guarantees or a repeatable pipeline.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">When WadeCV is the better choice</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            You are applying to more than two or three roles and want a repeatable workflow rather
            than a fresh prompt for every job.
          </li>
          <li>
            You want to paste a LinkedIn, Indeed, Greenhouse, or Lever URL and skip the copy-paste
            dance entirely.
          </li>
          <li>
            You want a structured fit score and gap list before you commit to tailoring, not a
            paragraph of general feedback.
          </li>
          <li>
            You need a DOCX that uploads cleanly into ATS portals without post-editing in Word or
            Google Docs.
          </li>
          <li>
            You want a tailored cover letter generated alongside every CV with consistent keywords
            and tone, at no extra cost.
          </li>
          <li>
            You are applying to US roles where mailing a printed CV directly to the hiring manager
            may cut through an overloaded inbox.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">The verdict</h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            Claude AI is a powerful general writing tool. For long-form prose, tone-matching, and
            reasoning through nuanced phrasing, it is arguably the best generalist chatbot available
            in 2026. Used well, it produces strong resume content.
          </p>
          <p>
            The gap opens when you try to use it as a production resume pipeline across many roles.
            Every application is a fresh prompt. You copy the job description by hand, you format
            the output into a DOCX by hand, you fact-check for hallucinated credentials by hand, you
            rewrite the cover letter separately, and you track the applications in your own
            spreadsheet. Claude does the writing well; you do everything else.
          </p>
          <p>
            WadeCV is narrower — it does not brainstorm career strategy or write your LinkedIn bio.
            What it does is absorb your CV once, then let you paste a job URL and get a complete
            tailored resume, cover letter, and fit analysis in seconds. If you are job searching at
            any real volume, that workflow difference compounds quickly.
          </p>
          <p>
            The realistic answer for most job seekers is to use both: Claude for thinking through
            hard career questions and drafting narrative, WadeCV for turning that thinking into
            job-specific tailored applications that actually get uploaded.
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
        currentCategory="/wadecv-vs-claude"
        contextLinks={[
          { href: "/ai-resume-builder-comparison", label: "WadeCV vs ChatGPT" },
          { href: "/best-ai-resume-builder-2026", label: "Best AI Resume Builders 2026" },
          { href: "/wadecv-vs-jobscan", label: "WadeCV vs Jobscan" },
          { href: "/wadecv-vs-teal", label: "WadeCV vs Teal" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Try WadeCV free — purpose-built for tailoring</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your CV once, paste a job URL, and get a fit score, a tailored resume, and a
            matching cover letter in under 60 seconds. 1 free credit included on signup.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta variant="job" label="Tailor your resume now" slug="claude-comparison" />
        </CardContent>
      </Card>
    </article>
  );
}
