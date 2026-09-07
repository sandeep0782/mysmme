import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://api.mysmme.com:8000/api";

type Category = {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  imagePublicId?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/category`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Categories API failed: ${response.status} ${response.statusText}`,
      );

      return [];
    }

    const result: ApiResponse<Category[]> = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      return [];
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

/* ============================================================
   SEO METADATA
============================================================ */

export const metadata: Metadata = {
  title: "Saree Categories | Shop Sarees by Style, Fabric & Tradition",
  description:
    "Explore saree categories at MySMMe. Discover beautiful silk, traditional, designer and contemporary sarees by style, fabric and tradition for weddings, festivals and everyday wear.",
  keywords: [
    "saree categories",
    "sarees by category",
    "shop sarees",
    "silk sarees",
    "traditional sarees",
    "designer sarees",
    "Indian sarees",
    "saree collection",
    "women sarees",
    "MySMMe sarees",
  ],
  alternates: {
    canonical: `${SITE_URL}/category`,
  },
  openGraph: {
    title: "Saree Categories | Shop Sarees by Style, Fabric & Tradition",
    description:
      "Explore beautiful saree collections by category, style, fabric and tradition at MySMMe.",
    url: `${SITE_URL}/category`,
    type: "website",
    siteName: "MySMMe",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saree Categories | MySMMe",
    description:
      "Explore beautiful sarees by category, fabric, style and tradition.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

/* ============================================================
   JSON-LD
============================================================ */

function CategoryStructuredData({ categories }: { categories: Category[] }) {
  const itemList = categories.map((category, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: `${category.name} Sarees`,
    url: `${SITE_URL}/category/${encodeURIComponent(category.slug)}`,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/category#collection`,
        url: `${SITE_URL}/category`,
        name: "Saree Categories",
        description: "Explore sarees by category, style, fabric and tradition.",
        isPartOf: {
          "@type": "WebSite",
          url: SITE_URL,
          name: "MySMMe",
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/category#categories`,
        name: "Saree Categories",
        numberOfItems: categories.length,
        itemListElement: itemList,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}

/* ============================================================
   PAGE
============================================================ */

export default async function CategoryPage() {
  const categories = await fetchCategories();

  const activeCategories = categories.filter(
    (category) =>
      category.isActive && category.slug?.trim() && category.name?.trim(),
  );

  return (
    <>
      <CategoryStructuredData categories={activeCategories} />

      <main className="bg-white">
        {/* ======================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden border-b bg-gradient-to-br from-red-50 via-white to-rose-50">
          <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-red-100/40 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-rose-100/50 blur-3xl" />

          <div className="container relative mx-auto px-4 py-16 text-center sm:py-20 md:py-24">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500 sm:text-sm">
              Explore Our Collections
            </p>

            <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl md:text-6xl">
              Saree Categories
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Discover beautiful sarees across different fabrics, styles,
              weaving traditions and designs. Explore collections created for
              weddings, festivals, celebrations and everyday elegance.
            </p>

            <div className="mx-auto mt-8 h-1 w-16 rounded-full bg-red-500" />
          </div>
        </section>

        {/* ======================================================
            CATEGORY COLLECTION
        ====================================================== */}

        <section
          aria-labelledby="category-collection-heading"
          className="container mx-auto px-4 py-16 sm:py-20"
        >
          <header className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
              Find Your Style
            </p>

            <h2
              id="category-collection-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Explore Sarees by Category
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-500">
              Browse our saree collections and discover different fabrics,
              designs and traditional styles. Select a category to explore its
              dedicated collection.
            </p>
          </header>

          {activeCategories.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Saree categories are currently unavailable
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Please check back soon for our latest collections.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
              {activeCategories.map((category, index) => {
                const categoryName = category.name.trim();

                const categoryUrl = `/category/${encodeURIComponent(
                  category.slug,
                )}`;

                /*
                 * Mix the visual treatment naturally.
                 *
                 * Every category remains a normal HTML <a> link,
                 * which is important for crawling and internal linking.
                 */
                const isRound = index % 3 === 0;

                return (
                  <Link
                    key={category._id}
                    href={categoryUrl}
                    title={`Explore ${categoryName} sarees`}
                    aria-label={`Explore ${categoryName} sarees`}
                    className="group block"
                  >
                    <article>
                      <div
                        className={[
                          "relative overflow-hidden bg-gray-100 shadow-sm transition-all duration-500",
                          "group-hover:-translate-y-1 group-hover:shadow-xl",
                          isRound
                            ? "mx-auto aspect-square w-[82%] rounded-full border-4 border-white ring-1 ring-gray-100"
                            : "aspect-[4/5] rounded-2xl",
                        ].join(" ")}
                      >
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={`${categoryName} sarees collection`}
                            fill
                            sizes={
                              isRound
                                ? "(max-width: 640px) 38vw, (max-width: 1024px) 25vw, 16vw"
                                : "(max-width: 640px) 48vw, (max-width: 1024px) 25vw, 20vw"
                            }
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 text-sm text-gray-400">
                            No Image
                          </div>
                        )}

                        <div
                          className={[
                            "absolute inset-0 transition-colors duration-500",
                            isRound
                              ? "rounded-full bg-black/0 group-hover:bg-black/15"
                              : "rounded-2xl bg-black/0 group-hover:bg-black/15",
                          ].join(" ")}
                          aria-hidden="true"
                        />
                      </div>

                      <div className="mt-4 text-center">
                        <h3 className="text-base font-semibold text-gray-900 transition-colors duration-300 group-hover:text-red-500 sm:text-lg">
                          {categoryName} Sarees
                        </h3>

                        {category.description?.trim() && (
                          <p className="mx-auto mt-1.5 line-clamp-2 max-w-xs text-sm leading-5 text-gray-500">
                            {category.description.trim()}
                          </p>
                        )}

                        <span className="mt-2 inline-block text-xs font-medium uppercase tracking-wider text-red-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          Explore Collection
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ======================================================
            SEO CONTENT
        ====================================================== */}

        <section
          aria-labelledby="saree-category-guide-heading"
          className="border-t bg-gray-50"
        >
          <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
                Saree Guide
              </p>

              <h2
                id="saree-category-guide-heading"
                className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
              >
                Discover Sarees by Fabric, Style and Tradition
              </h2>
            </header>

            <div className="mt-7 space-y-6 text-base leading-8 text-gray-600">
              <p>
                Sarees are one of India&apos;s most versatile traditional
                garments, with each region offering its own fabrics, weaving
                techniques, colours and designs. From elegant silk sarees to
                lightweight everyday styles, different saree collections offer
                something for every occasion and personal style.
              </p>

              <p>
                Exploring sarees by category makes it easier to discover the
                right collection for your needs. You can browse categories based
                on fabric, design, regional tradition or overall style and then
                explore the sarees available within each collection.
              </p>

              <p>
                Whether you are looking for a saree for a wedding, festival,
                family celebration or everyday wear, our category collections
                help you discover different styles in one place. Open any
                category above to learn more about its sarees and explore the
                available collection.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================
            INTERNAL LINKING CTA
        ====================================================== */}

        <section className="border-t bg-white">
          <div className="container mx-auto px-4 py-14 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Looking for Your Perfect Saree?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-gray-500">
              Explore our complete saree collection and discover beautiful
              styles for every occasion.
            </p>

            <Link
              href="/sarees"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-red-500 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              Shop All Sarees
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
