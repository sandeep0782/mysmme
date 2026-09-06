import type { Metadata } from "next";
import FAQClient from "./FAQClient";
import { FAQS } from "./faq-data";

const title = "FAQ";
const fullTitle = "FAQ | MYSMME";
const description =
  "Answers about MYSMME — how our saree marketplace works, shipping, returns, and how MYSMME differs from the Government MSME scheme.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: fullTitle,
    description,
    url: "/faq",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: fullTitle,
    description,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQClient />
    </>
  );
}
