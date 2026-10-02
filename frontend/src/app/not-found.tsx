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
    "Shop sarees online at MYSMME. Explore silk sarees, cotton sarees, georgette sarees, organza sarees, wedding sarees, designer sarees, daily wear sarees and sarees under ₹999.",
  alternates: {
    canonical: "https://mysmme.com",
  },
  openGraph: {
    title: "Buy Sarees Online in India | MYSMME",
    description:
      "Discover beautiful sarees for weddings, festivals, office wear, parties and everyday occasions at MYSMME.",
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
      "Online marketplace for buying sarees including silk, cotton, georgette, organza, wedding, designer and daily wear sarees in India.",
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
        name: "What types of sarees can I buy on MYSMME?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MYSMME offers a growing selection of sarees including silk sarees, cotton sarees, georgette sarees, chiffon sarees, organza sarees, linen sarees, designer sarees, wedding sarees, party wear sarees and daily wear sarees.",
        },
      },
      {
        "@type": "Question",
        name: "Can I buy affordable sarees online on MYSMME?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MYSMME includes budget-friendly saree collections including sarees under ₹999 along with premium and occasion wear sarees.",
        },
      },
      {
        "@type": "Question",
        name: "Does MYSMME deliver sarees across India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MYSMME is an India-focused online saree marketplace. Customers can check delivery availability for their location while shopping and during checkout.",
        },
      },
      {
        "@type": "Question",
        name: "Can I shop for wedding sarees on MYSMME?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MYSMME features sarees suitable for weddings, festive celebrations, parties, family functions and other special occasions.",
        },
      },
      {
        "@type": "Question",
        name: "Does MYSMME add new saree designs regularly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. New saree designs and collections are added regularly and can be explored through the New Arrivals and featured collection sections.",
        },
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
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

      {/* Main homepage content */}
      <main>
        <Hero />

        <CategorySlider />

        <NewSarees />

        <FeaturedCollection />

        <ShopByOccasion />

        <Reels />

        {/* SEO CONTENT SECTION */}
        <section className="bg-white py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-4xl">
                Buy Sarees Online in India at MYSMME
              </h1>

              <p className="mt-5 text-sm leading-7 text-gray-600 md:text-base md:leading-8">
                MYSMME is an online saree marketplace created for women looking
                for stylish, elegant and affordable sarees across India.
                Discover sarees for weddings, festivals, parties, office wear,
                family functions and everyday occasions. From timeless
                traditional sarees to contemporary designs, MYSMME brings
                different saree styles, fabrics, colours and collections
                together in one convenient shopping destination.
              </p>

              <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base md:leading-8">
                Explore a growing collection of{" "}
                <Link
                  href="/sarees"
                  className="font-medium text-gray-900 underline underline-offset-4"
                >
                  sarees online
                </Link>
                , including silk sarees, cotton sarees, georgette sarees,
                organza sarees, chiffon sarees, linen sarees, Banarasi sarees,
                designer sarees and occasion wear sarees. Whether you are
                looking for a lightweight saree for everyday use or an elegant
                saree for an important celebration, you can discover options
                suited to different styles, occasions and budgets.
              </p>

              <div className="mt-10 grid gap-8 md:grid-cols-2">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
                    Shop Sarees Online for Every Occasion
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base md:leading-8">
                    Sarees remain one of the most versatile choices in Indian
                    fashion. A beautifully selected saree can be worn for a
                    wedding, festival, party, office meeting, family gathering
                    or a simple everyday occasion. At MYSMME, you can browse
                    sarees according to your style, fabric, colour, occasion and
                    price preference.
                  </p>

                  <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base md:leading-8">
                    Our collections are designed to make saree discovery easier.
                    Explore new arrivals for recently added styles, browse
                    premium sarees for special occasions, discover wedding
                    sarees for celebrations or choose comfortable daily wear
                    sarees for regular use.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
                    Affordable and Premium Saree Collections
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base md:leading-8">
                    Every shopper has a different budget and style preference.
                    MYSMME therefore brings together both affordable and premium
                    saree options. Customers searching for value-focused styles
                    can explore our{" "}
                    <Link
                      href="/under-999"
                      className="font-medium text-gray-900 underline underline-offset-4"
                    >
                      sarees under ₹999
                    </Link>
                    , while shoppers looking for something more distinctive can
                    explore premium and designer collections.
                  </p>

                  <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base md:leading-8">
                    Product pages are designed to provide useful information
                    about the saree, including images, fabric details, colour,
                    blouse information and other available product
                    specifications so you can make a more informed purchase.
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
                  Discover Silk, Cotton, Georgette and Designer Sarees
                </h2>

                <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base md:leading-8">
                  Fabric plays an important role in the look and feel of a
                  saree. Silk sarees are often chosen for weddings and festive
                  celebrations, while cotton and linen sarees can be ideal for
                  comfortable everyday or office wear. Georgette and chiffon
                  sarees offer a flowing drape, while organza sarees are popular
                  for their lightweight and elegant appearance.
                </p>

                <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base md:leading-8">
                  You can also discover designer sarees featuring embroidery,
                  zari work, sequins, decorative borders, printed patterns and
                  contemporary styling. MYSMME continues to expand its
                  marketplace so shoppers can discover more colours, fabrics,
                  designs and sellers in one place.
                </p>
              </div>

              <div className="mt-10">
                <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
                  Why Shop Sarees at MYSMME?
                </h2>

                <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base md:leading-8">
                  MYSMME is focused specifically on sarees and Indian women's
                  fashion. Our aim is to create a simple marketplace where
                  shoppers can conveniently discover sarees from different
                  collections and sellers without having to search across
                  multiple stores.
                </p>

                <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base md:leading-8">
                  Browse our latest saree collections, discover styles suited
                  for different occasions and find sarees that match your
                  preferred colour, fabric and budget. New products are added
                  regularly, giving you more opportunities to discover fresh
                  saree designs throughout the year.
                </p>
              </div>

              {/* Quick internal links */}
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/sarees"
                  className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
                >
                  Shop Sarees
                </Link>

                <Link
                  href="/new-arrivals"
                  className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
                >
                  New Arrivals
                </Link>

                <Link
                  href="/under-999"
                  className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
                >
                  Sarees Under ₹999
                </Link>

                <Link
                  href="/wedding-collection"
                  className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
                >
                  Wedding Sarees
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="bg-gray-50 py-14 md:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
                Frequently Asked Questions
              </h2>

              <p className="mt-3 text-sm text-gray-600 md:text-base">
                Find answers to common questions about shopping for sarees on
                MYSMME.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              <details className="group rounded-xl border border-gray-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-medium text-gray-900">
                  What types of sarees can I buy on MYSMME?
                </summary>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  MYSMME offers a growing selection including silk sarees,
                  cotton sarees, georgette sarees, chiffon sarees, organza
                  sarees, linen sarees, designer sarees, wedding sarees, party
                  wear sarees and daily wear sarees.
                </p>
              </details>

              <details className="group rounded-xl border border-gray-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-medium text-gray-900">
                  Can I buy affordable sarees online on MYSMME?
                </summary>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  Yes. MYSMME has affordable collections including sarees under
                  ₹999, along with premium and designer sarees for customers
                  looking for special occasion styles.
                </p>
              </details>

              <details className="group rounded-xl border border-gray-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-medium text-gray-900">
                  Does MYSMME deliver sarees across India?
                </summary>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  MYSMME is an India-focused saree marketplace. Delivery
                  availability for individual products and locations can be
                  checked while shopping and during checkout.
                </p>
              </details>

              <details className="group rounded-xl border border-gray-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-medium text-gray-900">
                  Can I shop for wedding sarees on MYSMME?
                </summary>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  Yes. You can explore sarees suitable for weddings, festive
                  occasions, parties, family celebrations and other special
                  events.
                </p>
              </details>

              <details className="group rounded-xl border border-gray-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-medium text-gray-900">
                  Does MYSMME regularly add new sarees?
                </summary>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  Yes. New saree designs and collections are added regularly.
                  Visit the New Arrivals section to discover recently added
                  styles.
                </p>
              </details>
            </div>
          </div>
        </section>

        <TrustFeatures />

        <Brand />

        <Cta />
      </main>
    </>
  );
}
