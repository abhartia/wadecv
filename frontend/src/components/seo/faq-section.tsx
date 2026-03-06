import type { FaqItem } from "@/lib/seo-content";

type FaqSectionProps = {
  faq: FaqItem[];
};

export function FaqSection({ faq }: FaqSectionProps) {
  if (!faq?.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Frequently asked questions</h2>
      <ul className="space-y-6">
        {faq.map((item, i) => (
          <li key={i}>
            <h3 className="font-medium text-foreground mb-2">{item.question}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.answer}</p>
          </li>
        ))}
      </ul>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
