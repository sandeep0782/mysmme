import type { Metadata } from "next";
import { Suspense } from "react";
import SareesPageClient from "./SareesPageClient";

export const metadata: Metadata = {
  title: "Buy Sarees Online in India",

  description:
    "Shop sarees online at MYSMME. Explore silk, cotton, Banarasi, designer and wedding sarees for every occasion.",

  alternates: {
    canonical: "/sarees",
  },

  openGraph: {
    title: "Buy Sarees Online in India | MYSMME",
    description:
      "Discover silk, cotton, Banarasi, designer and wedding sarees online at MYSMME.",
    url: "https://mysmme.com/sarees",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      {/* Server-rendered SEO heading */}
      <section className="mx-auto max-w-7xl px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Buy Sarees Online in India
        </h1>

        <p className="mt-2 text-sm text-gray-600 md:text-base">
          Explore silk, cotton, Banarasi, designer and wedding sarees at MYSMME.
          Find beautiful styles for every occasion.
        </p>
      </section>
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <SareesPageClient />
      </Suspense>
    </>
  );
}
