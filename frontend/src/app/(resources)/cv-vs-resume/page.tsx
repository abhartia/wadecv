import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoCta } from "@/components/seo/seo-cta";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://wadecv.com");

export const metadata = {
  title: "CV vs Resume: What's the Difference? Complete 2026 Guide | WadeCV",
  description:
    "CV vs resume explained: key differences in length, content, and regional usage. Learn when to use a CV or resume for UK, US, and international job applications.",
  openGraph: {
    title: "CV vs Resume: What's the Difference? Complete 2026 Guide",
    description:
      "CV vs resume explained: key differences in length, content, and regional usage. Learn when to use a CV or resume for UK, US, and international job applications.",
  },
  twitter: {
    card: "summary" as const,
    title: "CV vs Resume: What's the Difference? Complete 2026 Guide",
    description:
      "CV vs resume explained: key differences in length, content, and regional usage for UK, US, and international job applications.",
  },
};

const DIFFERENCES: {
  category: string;
  cv: string;
  resume: string;
  badge: string;
}[] = [
  {
    category: "Length",
    cv: "Can be multiple pages, especially in academia. There is no strict page limit — a senior researcher's CV might run 10+ pages, listing every publication, grant, and conference presentation.",
    resume:
      "Typically 1-2 pages. Hiring managers in the private sector expect a concise document that highlights only the most relevant experience for the specific role.",
    badge: "Key difference",
  },
  {
    category: "Content scope",
    cv: "Comprehensive record of your entire academic and professional career: publications, research projects, teaching experience, grants, fellowships, conference presentations, and professional memberships.",
    resume:
      "Targeted summary of skills and experience relevant to a specific job. You select and prioritize content based on the role you are applying for, omitting anything that does not support your candidacy.",
    badge: "Key difference",
  },
  {
    category: "Regional usage",
    cv: 'In the UK, Ireland, Australia, New Zealand, and most of Europe, "CV" is the standard term for the document you submit with any job application — whether for academia or industry. If a British job posting asks for a CV, it means what Americans would call a resume.',
    resume:
      'In the US and Canada, "resume" is the standard term for private-sector job applications. The word "CV" is reserved for academic, research, and medical positions where a longer, more detailed document is expected.',
    badge: "Regional",
  },
  {
    category: "Purpose",
    cv: "In the US context, a CV is used for academic positions, research fellowships, medical residencies, and grant applications. Internationally, the CV serves the same purpose as a resume — it is your primary job application document.",
    resume:
      "Used for corporate, tech, startup, government, and nonprofit roles in the US and Canada. The resume is tailored to each application, emphasizing the experience most relevant to the position.",
    badge: "Context matters",
  },
];

const FAQ = [
  {
    question: "Is a CV the same as a resume?",
    answer:
      'It depends on where you are. In the UK, Australia, New Zealand, and most of Europe, a CV and a resume are the same thing — "CV" is simply the term used for any job application document. In the US and Canada, the two are distinct: a CV is a longer, comprehensive document used primarily for academic and research positions, while a resume is a concise 1-2 page summary tailored to a specific job in the private sector.',
  },
  {
    question: "Should I use a CV or resume for a job in the UK?",
    answer:
      'Use a CV. In the UK, "CV" is the standard term for the document you submit with any job application, regardless of industry. British CVs are typically 2 pages and focus on relevant skills and experience — similar in format to what Americans call a resume. If a UK job posting asks for a CV, it does not mean they want an exhaustive academic document.',
  },
  {
    question: "Can I convert my CV to a resume?",
    answer:
      "Yes. The key steps are: shorten the document to 1-2 pages, remove academic details (publications, conferences, teaching) unless they are directly relevant to the role, add a targeted professional summary, and reorganize your experience to highlight the skills and achievements that match the specific job description. WadeCV can help automate this process — upload your CV, paste a job URL, and the AI will generate a tailored resume that keeps only the most relevant content.",
  },
  {
    question: "Does ATS treat CVs and resumes differently?",
    answer:
      "No. Applicant Tracking Systems parse both CVs and resumes the same way. ATS software scans for keywords, evaluates formatting and section headers, and ranks candidates based on how well the document matches the job description. What matters is that your document — whether you call it a CV or a resume — uses clear section headings, standard formatting, and includes the keywords from the job posting.",
  },
  {
    question: "What should I call my document when applying internationally?",
    answer:
      'Use the term the job posting uses. If a posting says "submit your CV," send a CV. If it says "submit your resume," send a resume. When the posting does not specify: use "CV" for applications in the UK, Europe, Australia, and New Zealand; use "resume" for applications in the US and Canada. For the file name, match the term as well — "FirstName_LastName_CV.pdf" for UK roles, "FirstName_LastName_Resume.pdf" for US roles.',
  },
];

export default function CvVsResumePage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "CV vs Resume: What's the Difference and When to Use Each (2026 Guide)",
            description: metadata.description,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: {
              "@type": "Organization",
              name: "WadeCV",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/cv-vs-resume`,
            },
            datePublished: "2026-04-13",
            dateModified: "2026-04-13",
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
        CV vs Resume: What&apos;s the Difference and When to Use Each (2026 Guide)
      </h1>

      <p className="text-muted-foreground mb-6">
        The terms &quot;CV&quot; and &quot;resume&quot; are used interchangeably in many countries,
        but they have distinct meanings depending on where you are. In the United Kingdom,
        Australia, New Zealand, and most of Europe, &quot;CV&quot; (curriculum vitae) is the
        standard term for the document you submit with any job application — it is simply what
        Americans call a &quot;resume.&quot; In the United States and Canada, however, a CV refers
        specifically to a longer, more detailed academic document, while a resume is a concise
        summary tailored to a specific role. Understanding this distinction matters when you are
        applying for jobs across borders, switching between academia and industry, or trying to
        figure out what recruiters in different countries actually expect.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Key differences between a CV and a resume</h2>
        <div className="space-y-4">
          {DIFFERENCES.map((row) => (
            <Card key={row.category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {row.category}
                  <Badge variant="outline" className="text-xs">
                    {row.badge}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground mb-1">CV</p>
                  <p>{row.cv}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Resume</p>
                  <p>{row.resume}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">When to use a CV</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            Academic positions at universities and research institutions, where hiring committees
            expect a complete record of publications, teaching, and research.
          </li>
          <li>
            Research roles and postdoctoral fellowships that require a detailed list of grants,
            conference presentations, and peer-reviewed work.
          </li>
          <li>
            Medical positions in the US, including residencies and clinical appointments, where
            licensing, certifications, and clinical rotations must be documented.
          </li>
          <li>
            International job applications in the UK, Europe, Australia, and New Zealand, where
            &quot;CV&quot; is the default term and employers expect a focused 2-page document
            similar to an American resume.
          </li>
          <li>
            Grant and fellowship applications that ask specifically for a curriculum vitae as part
            of the submission package.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">When to use a resume</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            Most private-sector jobs in the US and Canada, including corporate, tech, startup, and
            nonprofit roles.
          </li>
          <li>
            Any role where the job posting specifically asks for a &quot;resume&quot; — this signals
            the employer expects a concise, targeted document.
          </li>
          <li>
            Career changes where you want to highlight transferable skills and relevant experience
            rather than your complete work history.
          </li>
          <li>
            Roles where hiring managers review hundreds of applications and prefer a document they
            can scan in under 30 seconds.
          </li>
          <li>
            Government positions in the US (note: federal resumes have their own format requirements
            and can be longer than standard resumes).
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">CV and resume formatting tips</h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            Whether you are writing a CV or a resume, formatting matters. Applicant Tracking Systems
            (ATS) parse your document before a human ever sees it, and poor formatting can cause
            your content to be misread or discarded entirely. Use standard section headings like
            &quot;Work Experience,&quot; &quot;Education,&quot; and &quot;Skills&quot; so ATS
            software can categorize your information correctly. Avoid tables, multi-column layouts,
            headers and footers, and embedded images — these often break ATS parsing.
          </p>
          <p>
            For both CVs and resumes, include keywords from the job description. ATS systems rank
            candidates based on keyword matches, so mirror the language the employer uses. If the
            job posting says &quot;project management&quot; rather than &quot;project
            coordination,&quot; use their exact phrasing. This applies equally whether you are
            submitting a CV in London or a resume in New York.
          </p>
          <p>
            Save your document as a PDF unless the employer requests a different format. PDFs
            preserve your formatting across devices and operating systems. Name the file clearly:{" "}
            <strong>FirstName_LastName_CV.pdf</strong> for UK and European applications,{" "}
            <strong>FirstName_LastName_Resume.pdf</strong> for US and Canadian applications.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">How WadeCV helps with both CVs and resumes</h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            WadeCV works with both CVs and resumes regardless of what you call your document. Upload
            your existing CV or resume, paste the URL of a job you want to apply for, and the AI
            analyzes the job description and rewrites your document to match the role. The output is
            tailored to the specific position — with the right keywords, a targeted professional
            summary, and experience bullets that align with what the employer is looking for.
          </p>
          <p>
            This is especially useful for international job seekers who need to adapt a single
            document for different markets. If you have a UK-style CV and want to apply for a role
            in the US, WadeCV can restructure your content to match American resume conventions. If
            you have an American resume and need to apply for a position in Europe, the tailoring
            works the same way — paste the job URL, and the AI handles the adaptation.
          </p>
          <p>
            Every tailored document includes a{" "}
            <Link href="/ats" className="underline">
              gap analysis
            </Link>{" "}
            showing which skills and keywords were added, which sections were rewritten, and how
            well your document matches the job description. You also get a tailored cover letter at
            no extra cost.
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
        currentCategory="/cv-vs-resume"
        contextLinks={[
          { href: "/skills", label: "Skills for Your Resume" },
          { href: "/career-change", label: "Career Change Resume Guide" },
          { href: "/ats", label: "ATS Resume Optimization" },
          {
            href: "/best-ai-resume-builder-2026",
            label: "Best AI Resume Builders 2026",
          },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Tailor your CV or resume for any job — try WadeCV free</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your document, paste a job URL, and get a tailored CV or resume plus cover letter
            in seconds. Works for UK, US, and international applications. 1 free credit included on
            signup.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta variant="job" label="Tailor your document now" slug="cv-vs-resume" />
        </CardContent>
      </Card>
    </article>
  );
}
