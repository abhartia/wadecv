import { notFound } from "next/navigation";
import { getPhysicalMailBySlug, getPhysicalMailEntries } from "@/lib/seo-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeoCta } from "@/components/seo/seo-cta";
import { FaqSection } from "@/components/seo/faq-section";
import { RelatedGuides } from "@/components/seo/related-guides";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://wadecv.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = getPhysicalMailBySlug(slug);
  if (!entry) return { title: "Physical Mail Guide Not Found | WadeCV" };
  return {
    title: `${entry.title} | WadeCV`,
    description: entry.metaDescription,
    openGraph: { title: entry.title, description: entry.metaDescription },
    twitter: { card: "summary", title: entry.title, description: entry.metaDescription },
  };
}

export async function generateStaticParams() {
  return getPhysicalMailEntries().map((e) => ({ slug: e.slug }));
}

export default async function PhysicalMailPage({ params }: Props) {
  const { slug } = await params;
  const entry = getPhysicalMailBySlug(slug);
  if (!entry) notFound();

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: entry.title,
            description: entry.metaDescription,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: { "@type": "Organization", name: "WadeCV", url: BASE_URL },
            datePublished: "2026-04-01",
            dateModified: "2026-04-07",
            mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/physical-mail/${entry.slug}` },
          }),
        }}
      />
      <h1 className="text-3xl font-bold mb-4">{entry.title}</h1>
      <p className="text-muted-foreground mb-6">{entry.intro}</p>

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

      <RelatedGuides relatedSlugs={entry.relatedSlugs} category="physical-mail" currentSlug={slug} />

      <Card>
        <CardHeader>
          <CardTitle>Ready to mail your application?</CardTitle>
          <p className="text-sm text-muted-foreground">
            WadeCV lets you generate a tailored CV, preview it, and mail a printed copy directly to any US company — all in one workflow.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta variant="physical-mail" slug={slug} />
        </CardContent>
      </Card>
    </article>
  );
}
