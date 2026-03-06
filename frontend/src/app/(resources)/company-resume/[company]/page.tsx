import { notFound } from "next/navigation";
import { getCompanyBySlug, getCompanies } from "@/lib/seo-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoCta } from "@/components/seo/seo-cta";
import { FaqSection } from "@/components/seo/faq-section";
import { RelatedGuides } from "@/components/seo/related-guides";

type Props = { params: Promise<{ company: string }> };

export async function generateMetadata({ params }: Props) {
  const { company } = await params;
  const entry = getCompanyBySlug(company);
  if (!entry) return { title: "Company Not Found | WadeCV" };
  return {
    title: `${entry.name} Resume Guide | WadeCV`,
    description: entry.metaDescription,
    openGraph: { title: `${entry.name} Resume Guide`, description: entry.metaDescription },
    twitter: { card: "summary", title: `${entry.name} Resume Guide`, description: entry.metaDescription },
  };
}

export async function generateStaticParams() {
  return getCompanies().map((c) => ({ company: c.slug }));
}

export default async function CompanyResumePage({ params }: Props) {
  const { company } = await params;
  const entry = getCompanyBySlug(company);
  if (!entry) notFound();

  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">{entry.name} Resume Guide</h1>
      <p className="text-muted-foreground mb-6">{entry.intro}</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Typical hiring requirements</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          {entry.hiringRequirements.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Keywords to include</h2>
        <div className="flex flex-wrap gap-2">
          {entry.keywords.map((k) => (
            <Badge key={k} variant="secondary">{k}</Badge>
          ))}
        </div>
      </section>

      {entry.sampleSnippet && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Sample resume snippet</h2>
          <blockquote className="border-l-4 border-primary/30 pl-4 py-2 text-muted-foreground italic">
            {entry.sampleSnippet}
          </blockquote>
        </section>
      )}

      <section className="mb-8">
        <div className="prose dark:prose-invert max-w-none text-muted-foreground">
          {entry.body.split(/\n\n+/).map((p, i) => (
            <p key={i} className="mb-4 last:mb-0">
              {p.trim()}
            </p>
          ))}
        </div>
      </section>

      {entry.commonMistakes && entry.commonMistakes.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Common mistakes to avoid</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            {entry.commonMistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </section>
      )}

      {entry.faq && <FaqSection faq={entry.faq} />}

      <RelatedGuides relatedSlugs={entry.relatedSlugs} category="company-resume" currentSlug={company} />

      <Card>
        <CardHeader>
          <CardTitle>Ready to tailor your resume for {entry.name}?</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your CV and paste the job description—WadeCV will help you align your experience and generate a tailored resume.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta variant="company" label={`Create a resume for ${entry.name}`} />
        </CardContent>
      </Card>
    </article>
  );
}
