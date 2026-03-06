import { notFound } from "next/navigation";
import { getCareerChangeBySlug, getCareerChanges } from "@/lib/seo-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeoCta } from "@/components/seo/seo-cta";
import { FaqSection } from "@/components/seo/faq-section";
import { RelatedGuides } from "@/components/seo/related-guides";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = getCareerChangeBySlug(slug);
  if (!entry) return { title: "Career Change Guide Not Found | WadeCV" };
  return {
    title: `${entry.title} | WadeCV`,
    description: entry.metaDescription,
    openGraph: { title: entry.title, description: entry.metaDescription },
    twitter: { card: "summary", title: entry.title, description: entry.metaDescription },
  };
}

export async function generateStaticParams() {
  return getCareerChanges().map((c) => ({ slug: c.slug }));
}

export default async function CareerChangePage({ params }: Props) {
  const { slug } = await params;
  const entry = getCareerChangeBySlug(slug);
  if (!entry) notFound();

  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">{entry.title}</h1>
      <p className="text-muted-foreground mb-6">{entry.intro}</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Transition: {entry.fromRole} → {entry.toRole}</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          {entry.tips.map((t, i) => (
            <li key={i}>{t}</li>
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

      <RelatedGuides relatedSlugs={entry.relatedSlugs} category="career-change" currentSlug={slug} />

      <Card>
        <CardHeader>
          <CardTitle>Build your transition CV</CardTitle>
          <p className="text-sm text-muted-foreground">
            WadeCV helps you reframe your experience for a new field and generate a tailored resume that highlights transferable skills.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta variant="career-change" />
        </CardContent>
      </Card>
    </article>
  );
}
