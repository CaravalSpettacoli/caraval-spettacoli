import type { FaqItem } from "@/components/caraval/FaqSezione";

export function FaqJsonLd({ items }: { items?: FaqItem[] | null }) {
  const valid = (items ?? []).filter(
    (f): f is Required<FaqItem> => Boolean(f?.domanda && f?.risposta),
  );
  if (valid.length === 0) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: valid.map((f) => ({
      "@type": "Question",
      name: f.domanda,
      acceptedAnswer: { "@type": "Answer", text: f.risposta },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default FaqJsonLd;
