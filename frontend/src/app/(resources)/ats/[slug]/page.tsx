import { notFound } from "next/navigation";
import { getAtsBySlug, getAtsList } from "@/lib/seo-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeoCta } from "@/components/seo/seo-cta";
import { FaqSection } from "@/components/seo/faq-section";
import { RelatedGuides } from "@/components/seo/related-guides";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://wadecv.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = getAtsBySlug(slug);
  if (!entry) return { title: "ATS Guide Not Found | WadeCV" };
  return {
    title: `How to Pass ${entry.name} ATS Screening (2026 Guide) | WadeCV`,
    description: entry.metaDescription,
    openGraph: { title: `How to Pass ${entry.name} ATS Screening (2026 Guide)`, description: entry.metaDescription },
    twitter: { card: "summary", title: `How to Pass ${entry.name} ATS Screening (2026 Guide)`, description: entry.metaDescription },
  };
}

export async function generateStaticParams() {
  return getAtsList().map((a) => ({ slug: a.slug }));
}

export default async function AtsPage({ params }: Props) {
  const { slug } = await params;
  const entry = getAtsBySlug(slug);
  if (!entry) notFound();

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `How to Pass ${entry.name} ATS Screening`,
            description: entry.metaDescription,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: { "@type": "Organization", name: "WadeCV", url: BASE_URL },
            mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/ats/${entry.slug}` },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: `How to Optimize Your Resume for ${entry.name} ATS`,
            description: entry.metaDescription,
            step: [
              ...entry.formattingNotes.map((note, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                text: note,
              })),
            ],
          }),
        }}
      />
      <h1 className="text-3xl font-bold mb-4">Resume for {entry.name} ATS</h1>
      <p className="text-muted-foreground mb-6">{entry.intro}</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">How {entry.name} parses resumes</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          {entry.parsingRules.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Formatting tips</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          {entry.formattingNotes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <div className="prose dark:prose-invert max-w-none text-muted-foreground">
          {entry.body.split(/\n\n+/).map((p, i) => (
            <p key={i} className="mb-4 last:mb-0">
              {p.trim()}
            </p>
          ))}
        </div>
      </section>

      {entry.faq && <FaqSection faq={entry.faq} />}

      <RelatedGuides relatedSlugs={entry.relatedSlugs} category="ats" currentSlug={slug} />

      <CrossCategoryLinks currentCategory="/ats" />

      <Card>
        <CardHeader>
          <CardTitle>Optimize your resume for ATS</CardTitle>
          <p className="text-sm text-muted-foreground">
            WadeCV helps you create clean, keyword-aligned resumes that work with {entry.name} and other applicant tracking systems.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta variant="ats" slug={slug} />
        </CardContent>
      </Card>
    </article>
  );
}
