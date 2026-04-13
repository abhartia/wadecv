import { notFound } from "next/navigation";
import { getSkillBySlug, getSkills } from "@/lib/seo-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeoCta } from "@/components/seo/seo-cta";
import { FaqSection } from "@/components/seo/faq-section";
import { RelatedGuides } from "@/components/seo/related-guides";
import { CrossCategoryLinks } from "@/components/seo/cross-category-links";
import { InlineCta } from "@/components/seo/inline-cta";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://wadecv.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) return { title: "Skills Guide Not Found | WadeCV" };
  return {
    title: `${skill.title} | WadeCV`,
    description: skill.metaDescription,
    openGraph: { title: skill.title, description: skill.metaDescription },
    twitter: { card: "summary", title: skill.title, description: skill.metaDescription },
  };
}

export async function generateStaticParams() {
  return getSkills().map((s) => ({ slug: s.slug }));
}

export default async function SkillPage({ params }: Props) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) notFound();

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: skill.title,
            description: skill.metaDescription,
            author: { "@type": "Organization", name: "WadeCV" },
            publisher: { "@type": "Organization", name: "WadeCV", url: BASE_URL },
            datePublished: "2026-04-01",
            dateModified: "2026-04-07",
            mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/skills/${skill.slug}` },
          }),
        }}
      />
      <h1 className="text-3xl font-bold mb-4">{skill.title}</h1>
      <p className="text-muted-foreground mb-6">{skill.intro}</p>

      {skill.skillClusters.map((cluster, i) => (
        <section key={i} className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{cluster.name}</h2>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            {cluster.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Resume bullet examples</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          {skill.bulletExamples.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <div className="prose dark:prose-invert max-w-none text-muted-foreground">
          {skill.body.split(/\n\n+/).map((p, i) => (
            <p key={i} className="mb-4 last:mb-0">
              {p.trim()}
            </p>
          ))}
        </div>
      </section>

      <InlineCta variant="skills" slug={slug} />

      {skill.commonMistakes && skill.commonMistakes.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Common mistakes to avoid</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            {skill.commonMistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </section>
      )}

      {skill.faq && <FaqSection faq={skill.faq} />}

      <RelatedGuides relatedSlugs={skill.relatedSlugs} category="skills" currentSlug={slug} />

      <CrossCategoryLinks currentCategory="/skills" />

      <Card>
        <CardHeader>
          <CardTitle>Build a resume that highlights these skills</CardTitle>
          <p className="text-sm text-muted-foreground">
            WadeCV helps you tailor your CV to the role and surface the right skills and bullets for each application.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta variant="skills" slug={slug} />
        </CardContent>
      </Card>
    </article>
  );
}
