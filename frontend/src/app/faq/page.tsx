import type { Metadata } from "next";
import FAQClient from "./FAQClient";
import { FAQS } from "./faq-data"; // see note below

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about MYSMME — how our saree marketplace works, shipping, returns, and how MYSMME differs from the Government MSME scheme.",
  alternates: { canonical: "/faq" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
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
