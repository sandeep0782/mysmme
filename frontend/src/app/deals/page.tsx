import Link from "next/link";

import { ArrowRight, BadgePercent, Sparkles } from "lucide-react";

export default function DealsPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf8] text-[#201719]">
      <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        {/* Background decoration */}

        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#a51c30]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl" />

        {/* Content */}

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1ed] text-[#a51c30]">
            <BadgePercent className="h-6 w-6" />
          </div>

          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.28em] text-[#a51c30]">
            MYSMME Deals
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#24191b] sm:text-5xl lg:text-6xl">
            Something special
            <br />
            is coming soon.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#75696a] sm:text-base">
            We&apos;re preparing special saree deals, curated collections and
            offers for you.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#eadfd8] bg-white px-4 py-2 text-xs font-semibold text-[#665b5c] shadow-sm">
            <Sparkles className="h-4 w-4 text-[#a51c30]" />
            Deals launching soon
          </div>

          <div className="mt-10">
            <Link
              href="/sarees"
              className="inline-flex items-center gap-2 rounded-xl bg-[#a51c30] px-6 py-3.5 text-sm font-bold text-white transition duration-300 hover:bg-[#8e1729]"
            >
              Explore Sarees
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
