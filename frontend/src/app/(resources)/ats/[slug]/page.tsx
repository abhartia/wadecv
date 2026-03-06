import { notFound } from "next/navigation";
import { getAtsBySlug, getAtsList } from "@/lib/seo-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeoCta } from "@/components/seo/seo-cta";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = getAtsBySlug(slug);
  if (!entry) return { title: "ATS Guide Not Found | WadeCV" };
  return {
    title: `Resume for ${entry.name} ATS | WadeCV`,
    description: entry.metaDescription,
    openGraph: { title: `Resume for ${entry.name} ATS`, description: entry.metaDescription },
    twitter: { card: "summary", title: `Resume for ${entry.name} ATS`, description: entry.metaDescription },
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
          <p className="whitespace-pre-wrap">{entry.body}</p>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Optimize your resume for ATS</CardTitle>
          <p className="text-sm text-muted-foreground">
            WadeCV helps you create clean, keyword-aligned resumes that work with {entry.name} and other applicant tracking systems.
          </p>
        </CardHeader>
        <CardContent>
          <SeoCta variant="ats" />
        </CardContent>
      </Card>
    </article>
  );
}
