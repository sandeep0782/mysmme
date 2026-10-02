import Brand from "@/components/Brand";
import CategorySlider from "@/components/CategorySlider";
import TrustFeatures from "@/components/TrustFeatures";
import Cta from "@/components/Cta";
import FeaturedCollection from "@/components/FeaturedCollection";
import Hero from "@/components/Hero";
import NewSarees from "@/components/NewSarees";
import ShopByOccasion from "@/components/ShopByOccasion";
import Reels from "@/components/Reels";
import Link from "next/link";

export const metadata = {
  title: "Buy Sarees Online in India | MYSMME Saree Marketplace",
  description:
    "Shop sarees online at MYSMME. Discover silk sarees, cotton sarees, georgette sarees, organza sarees, wedding sarees, designer sarees, daily wear sarees and sarees under ₹999.",
  alternates: {
    canonical: "https://mysmme.com",
  },
  openGraph: {
    title: "Buy Sarees Online in India | MYSMME",
    description:
      "Discover elegant sarees for weddings, festivals, parties, office wear and everyday occasions at MYSMME.",
    url: "https://mysmme.com",
    siteName: "MYSMME",
    type: "website",
  },
};

export default function Home() {
  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "MYSMME",
    alternateName: "MYSMME Saree Marketplace",
    description:
      "Online marketplace for sarees including silk, cotton, georgette, organza, designer, wedding and daily wear sarees in India.",
    url: "https://mysmme.com",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    knowsAbout: [
      "Sarees",
      "Silk Sarees",
      "Cotton Sarees",
      "Georgette Sarees",
      "Organza Sarees",
      "Chiffon Sarees",
      "Linen Sarees",
      "Banarasi Sarees",
      "Designer Sarees",
      "Wedding Sarees",
      "Party Wear Sarees",
      "Daily Wear Sarees",
      "Indian Ethnic Wear",
      "Women's Fashion",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What types of sarees can I shop on MYSMME?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MYSMME offers silk, cotton, georgette, chiffon, organza, linen, designer, wedding, party wear and daily wear sarees.",
        },
      },
      {
        "@type": "Question",
        name: "Can I find affordable sarees on MYSMME?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MYSMME features affordable saree collections including sarees under ₹999 along with premium and designer collections.",
        },
      },
      {
        "@type": "Question",
        name: "Can I shop wedding sarees on MYSMME?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MYSMME includes sarees suitable for weddings, festive celebrations, parties and other special occasions.",
        },
      },
      {
        "@type": "Question",
        name: "Does MYSMME add new sarees regularly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. New styles and collections are added regularly so customers can discover fresh saree designs.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(storeSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main className="bg-white">
        {/* HERO */}
        <Hero />

        {/* CATEGORY */}
        <CategorySlider />

        {/* NEW ARRIVALS */}
        <NewSarees />

        {/* FEATURED */}
        <FeaturedCollection />

        {/* OCCASION */}
        <ShopByOccasion />

        {/* REELS */}
        <Reels />

        {/* TRUST */}
        <TrustFeatures />

        {/* BRANDS */}
        <Brand />

        {/* SEO + BRAND SUPPORTING CONTENT */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#fffaf7] via-white to-[#fff8f3] py-16 md:py-24">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-rose-100/40 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Intro */}
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700 shadow-sm">
                The MYSMME Saree Experience
              </span>

              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
                Discover Sarees Designed for
                <span className="block bg-gradient-to-r from-rose-700 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                  Every Woman, Every Occasion
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
                MYSMME is an online saree marketplace created to make
                discovering beautiful sarees simpler, more inspiring and more
                convenient. Explore traditional favourites, contemporary designs
                and occasion-ready styles from different collections and sellers
                across India.
              </p>
            </div>

            {/* Popular searches */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {[
                "Silk Sarees",
                "Cotton Sarees",
                "Georgette Sarees",
                "Organza Sarees",
                "Wedding Sarees",
                "Designer Sarees",
                "Daily Wear Sarees",
                "Sarees Under ₹999",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-200 hover:text-rose-700 hover:shadow-md"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Main content cards */}
            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              <article className="rounded-3xl border border-gray-100 bg-white p-7 shadow-[0_18px_50px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-xl">
                  ✨
                </div>

                <h2 className="text-xl font-semibold text-gray-950">
                  Shop Sarees Online with Ease
                </h2>

                <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
                  Finding the right saree should feel exciting, not complicated.
                  MYSMME helps you explore sarees by fabric, colour, occasion,
                  style and budget so you can quickly discover designs that
                  match your preference.
                </p>

                <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
                  Browse everything from lightweight everyday sarees to elegant
                  statement styles created for weddings, celebrations and
                  festive occasions.
                </p>
              </article>

              <article className="rounded-3xl border border-gray-100 bg-white p-7 shadow-[0_18px_50px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-xl">
                  👗
                </div>

                <h2 className="text-xl font-semibold text-gray-950">
                  Styles for Every Occasion
                </h2>

                <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
                  Sarees can transform effortlessly from elegant everyday wear
                  to glamorous occasion wear. Discover comfortable options for
                  office and daily use, festive sarees for celebrations and
                  sophisticated designs for weddings and family functions.
                </p>

                <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
                  Our collections make it easier to explore styles that suit the
                  moment, whether you prefer understated elegance or a more
                  luxurious statement look.
                </p>
              </article>

              <article className="rounded-3xl border border-gray-100 bg-white p-7 shadow-[0_18px_50px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-xl">
                  🛍️
                </div>

                <h2 className="text-xl font-semibold text-gray-950">
                  Affordable to Premium
                </h2>

                <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
                  Whether you are shopping within a budget or looking for a
                  premium saree, MYSMME brings a variety of collections
                  together. Explore value-focused styles, including sarees under
                  ₹999, along with richer fabrics and designer-inspired
                  collections.
                </p>

                <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
                  New products are added regularly so there is always something
                  fresh to discover.
                </p>
              </article>
            </div>

            {/* Fabric section */}
            <div className="mt-20 overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <div className="grid lg:grid-cols-2">
                <div className="p-8 md:p-12">
                  <span className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">
                    Explore by Fabric
                  </span>

                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-950 md:text-3xl">
                    From Timeless Silks to Lightweight Drapes
                  </h2>

                  <p className="mt-5 text-sm leading-7 text-gray-600 md:text-base md:leading-8">
                    Fabric defines the character of a saree. Silk sarees bring
                    richness and tradition to weddings and festive occasions,
                    while cotton and linen sarees are loved for their comfort
                    and versatility.
                  </p>

                  <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base md:leading-8">
                    Georgette and chiffon sarees offer fluid drapes and graceful
                    movement, while organza sarees create a lightweight yet
                    structured look. You can also discover sarees featuring
                    embroidery, zari work, sequins, printed patterns and
                    decorative borders.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href="/sarees"
                      className="rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                      Explore All Sarees
                    </Link>

                    <Link
                      href="/new-arrivals"
                      className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-950"
                    >
                      View New Arrivals
                    </Link>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-8 md:p-12">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ["Silk Sarees", "Rich & timeless"],
                      ["Cotton Sarees", "Comfortable & elegant"],
                      ["Georgette Sarees", "Flowing & stylish"],
                      ["Organza Sarees", "Light & sophisticated"],
                      ["Chiffon Sarees", "Soft & graceful"],
                      ["Designer Sarees", "Made to stand out"],
                    ].map(([title, subtitle]) => (
                      <div
                        key={title}
                        className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur"
                      >
                        <h3 className="text-sm font-semibold text-gray-950 md:text-base">
                          {title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500 md:text-sm">
                          {subtitle}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Brand marketplace explanation */}
            <div className="mt-20 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">
                  More Choice. More Discovery.
                </span>

                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-950 md:text-4xl">
                  Discover Sarees from Different Brands and Sellers
                </h2>

                <p className="mt-5 text-sm leading-7 text-gray-600 md:text-base md:leading-8">
                  MYSMME is designed as a dedicated saree marketplace where
                  customers can explore products from different brands,
                  collections and sellers in one place.
                </p>

                <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base md:leading-8">
                  Instead of browsing multiple stores, you can discover new
                  saree styles, compare designs and explore different price
                  ranges through one focused shopping experience.
                </p>

                <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base md:leading-8">
                  Our goal is to continuously expand the range of sarees
                  available on MYSMME while making online saree discovery
                  simpler and more enjoyable.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    number: "01",
                    title: "Discover",
                    text: "Explore sarees across fabrics, colours, occasions and collections.",
                  },
                  {
                    number: "02",
                    title: "Compare",
                    text: "Browse different styles and price ranges from multiple collections.",
                  },
                  {
                    number: "03",
                    title: "Choose",
                    text: "Find the saree that matches your personal style and occasion.",
                  },
                  {
                    number: "04",
                    title: "Shop",
                    text: "Enjoy a focused saree shopping experience built for customers in India.",
                  },
                ].map((item) => (
                  <div
                    key={item.number}
                    className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
                  >
                    <span className="text-xs font-bold tracking-[0.2em] text-rose-600">
                      {item.number}
                    </span>

                    <h3 className="mt-3 text-lg font-semibold text-gray-950">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why MYSMME */}
            <div className="mt-20 rounded-[32px] bg-gray-950 px-6 py-12 text-white md:px-12 md:py-16">
              <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-300">
                    Why MYSMME
                  </span>

                  <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                    A Marketplace Built Around Sarees
                  </h2>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-gray-300 md:text-base">
                    MYSMME focuses on making saree shopping easier through
                    curated discovery, clear product information and collections
                    created around the way women actually shop.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    "Fresh designs and new arrivals",
                    "Collections for multiple occasions",
                    "Affordable and premium options",
                    "Multiple fabrics and styles",
                    "Dedicated saree marketplace",
                    "Shopping experience focused on India",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                        ✓
                      </span>

                      <span className="text-sm leading-6 text-gray-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="mx-auto mt-20 max-w-4xl">
              <div className="text-center">
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">
                  Need Help?
                </span>

                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-950 md:text-4xl">
                  Frequently Asked Questions
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
                  Quick answers to common questions about discovering and
                  shopping sarees on MYSMME.
                </p>
              </div>

              <div className="mt-10 space-y-4">
                <details className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-950">
                    What types of sarees can I shop on MYSMME?
                    <span className="text-xl font-light transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <p className="mt-4 pr-8 text-sm leading-7 text-gray-600">
                    MYSMME offers a growing range including silk, cotton,
                    georgette, chiffon, organza, linen, designer, wedding, party
                    wear and daily wear sarees.
                  </p>
                </details>

                <details className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-950">
                    Can I find affordable sarees on MYSMME?
                    <span className="text-xl font-light transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <p className="mt-4 pr-8 text-sm leading-7 text-gray-600">
                    Yes. You can explore budget-friendly collections including
                    sarees under ₹999 along with premium and designer options.
                  </p>
                </details>

                <details className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-950">
                    Can I shop wedding sarees on MYSMME?
                    <span className="text-xl font-light transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <p className="mt-4 pr-8 text-sm leading-7 text-gray-600">
                    Yes. MYSMME features sarees suitable for weddings,
                    celebrations, festive occasions, parties and family
                    functions.
                  </p>
                </details>

                <details className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-950">
                    Does MYSMME regularly add new saree designs?
                    <span className="text-xl font-light transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <p className="mt-4 pr-8 text-sm leading-7 text-gray-600">
                    Yes. New products and collections are added regularly so you
                    can continue discovering fresh saree styles.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <Cta />
      </main>
    </>
  );
}
