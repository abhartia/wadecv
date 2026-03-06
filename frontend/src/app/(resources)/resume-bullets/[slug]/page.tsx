import { notFound } from "next/navigation";
import { getResumeBulletBySlug, getResumeBullets } from "@/lib/seo-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeoCta } from "@/components/seo/seo-cta";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = getResumeBulletBySlug(slug);
  if (!entry) return { title: "Resume Bullets Guide Not Found | WadeCV" };
  return {
    title: `${entry.title} | WadeCV`,
    description: entry.metaDescription,
    openGraph: { title: entry.title, description: entry.metaDescription },
    twitter: { card: "summary", title: entry.title, description: entry.metaDescription },
  };
}

export async function generateStaticParams() {
  return getResumeBullets().map((b) => ({ slug: b.slug }));
}

export default async function ResumeBulletsPage({ params }: Props) {
  const { slug } = await params;
  const entry = getResumeBulletBySlug(slug);
  if (!entry) notFound();

  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">{entry.title}</h1>
      <p className="text-muted-foreground mb-6">{entry.intro}</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Bullet examples</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          {entry.bulletExamples.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Impact formulas</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          {entry.impactFormulas.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <div className="prose dark:prose-invert max-w-none text-muted-foreground">
          <p className="whitespace-pre-wrap">{entry.body}</p>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Get AI-powered resume bullets</CardTitle>
          <p className="text-sm text-muted-foreground">
            Paste a job description and your experience—WadeCV will generate tailored CV content and bullets for you.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta variant="resume-bullets" />
        </CardContent>
      </Card>
    </article>
  );
}
