import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mysmme.com";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://api.mysmme.com:8000/api";

/* ============================================================
   TYPES
============================================================ */

type Category = {
  _id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  slug: string;
  image?: string;
  imagePublicId?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type Product = {
  _id?: string;
  name?: string;
  slug?: string;
  image?: string;
  images?: string[];
  price?: number;
  salePrice?: number;
  updatedAt?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

/* ============================================================
   FETCH CATEGORY BY SLUG
============================================================ */

async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await fetch(`${API_URL}/category`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Categories API failed: ${response.status} ${response.statusText}`,
      );

      return null;
    }

    const result: ApiResponse<Category[]> = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      return null;
    }

    const category = result.data.find(
      (item) =>
        item.isActive &&
        item.slug?.trim().toLowerCase() === slug.trim().toLowerCase(),
    );

    return category || null;
  } catch (error) {
    console.error("Failed to fetch category:", error);

    return null;
  }
}

/* ============================================================
   FETCH PRODUCTS FOR CATEGORY
============================================================ */

async function fetchCategoryProducts(slug: string): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_URL}/products?category=${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error(`Category products API failed: ${response.status}`);

      return [];
    }

    const result: ApiResponse<Product[]> = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      return [];
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch category products:", error);

    return [];
  }
}

/* ============================================================
   METADATA
============================================================ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const category = await fetchCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Saree Category Not Found | MYSMME",
      description: "The requested saree category could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const categoryName = category.name.trim();

  const title = `${categoryName} Sarees | Shop ${categoryName} Saree Collection`;

  const fallbackDescription =
    `Explore beautiful ${categoryName} sarees at MYSMME. ` +
    `Discover our collection of ${categoryName} sarees in different ` +
    `designs, colours and styles for weddings, festivals, celebrations ` +
    `and everyday wear.`;

  const description =
    category.shortDescription?.trim() ||
    (category.description?.trim()
      ? category.description.trim().slice(0, 157) + "..."
      : fallbackDescription);

  const canonicalUrl = `${SITE_URL}/category/${encodeURIComponent(category.slug)}`;

  return {
    title,

    description: description.slice(0, 160),

    keywords: [
      `${categoryName} sarees`,
      `buy ${categoryName} sarees`,
      `${categoryName} saree collection`,
      `${categoryName} sarees online`,
      `traditional ${categoryName} sarees`,
      `designer ${categoryName} sarees`,
      `${categoryName} saree for daily wear`,
      "Indian sarees",
      "MYSMME sarees",
    ],

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description: description.slice(0, 200),
      url: canonicalUrl,
      type: "website",
      siteName: "MYSMME",

      ...(category.image
        ? {
            images: [
              {
                url: category.image,
                alt: `${categoryName} sarees`,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description: description.slice(0, 200),

      ...(category.image
        ? {
            images: [category.image],
          }
        : {}),
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
}

/* ============================================================
   STRUCTURED DATA
============================================================ */

function CategoryStructuredData({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  const categoryName = category.name.trim();

  const categoryUrl = `${SITE_URL}/category/${encodeURIComponent(category.slug)}`;

  const productItems = products
    .filter((product) => product.slug && product.name)
    .slice(0, 50)
    .map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: `${SITE_URL}/sarees/${encodeURIComponent(product.slug as string)}`,
    }));

  const jsonLd = {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${categoryUrl}#breadcrumb`,

        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Saree Categories",
            item: `${SITE_URL}/category`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${categoryName} Sarees`,
            item: categoryUrl,
          },
        ],
      },

      {
        "@type": "CollectionPage",
        "@id": `${categoryUrl}#collection`,
        url: categoryUrl,
        name: `${categoryName} Sarees`,

        description:
          category.shortDescription ||
          category.description ||
          `Explore ${categoryName} sarees at MYSMME.`,

        isPartOf: {
          "@type": "WebSite",
          url: SITE_URL,
          name: "MYSMME",
        },
      },

      ...(productItems.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": `${categoryUrl}#products`,
              name: `${categoryName} Sarees Collection`,
              numberOfItems: productItems.length,
              itemListElement: productItems,
            },
          ]
        : []),

      {
        "@type": "FAQPage",
        "@id": `${categoryUrl}#faq`,

        mainEntity: [
          {
            "@type": "Question",
            name: `What are ${categoryName} sarees?`,

            acceptedAnswer: {
              "@type": "Answer",

              text:
                category.description?.trim() ||
                `${categoryName} sarees are a category of Indian sarees recognised for their particular style, fabric, design or traditional character.`,
            },
          },
        ],
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

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await fetchCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryName = category.name.trim();
  const categoryLower = categoryName.toLowerCase();

  const products = await fetchCategoryProducts(category.slug);

  const visibleProducts = products
    .filter((product) => product.slug && product.name)
    .slice(0, 12);

  return (
    <>
      <CategoryStructuredData category={category} products={products} />

      <main className="overflow-hidden bg-white">
        {/* ====================================================
            BREADCRUMB
        ==================================================== */}

        <nav
          aria-label="Breadcrumb"
          className="container mx-auto px-4 pb-4 pt-6"
        >
          <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="transition-colors hover:text-red-500">
                Home
              </Link>
            </li>

            <li aria-hidden="true" className="text-gray-300">
              /
            </li>

            <li>
              <Link
                href="/category"
                className="transition-colors hover:text-red-500"
              >
                Saree Categories
              </Link>
            </li>

            <li aria-hidden="true" className="text-gray-300">
              /
            </li>

            <li aria-current="page" className="font-medium text-gray-800">
              {categoryName} Sarees
            </li>
          </ol>
        </nav>

        {/* ====================================================
            PREMIUM MYSMME HERO
        ==================================================== */}

        <section className="container mx-auto px-4 pb-16 pt-5 sm:pb-20 sm:pt-8">
          <div className="grid overflow-hidden rounded-3xl bg-gray-50 lg:min-h-[650px] lg:grid-cols-[0.9fr_1.1fr]">
            {/* CONTENT */}

            <div className="order-2 flex items-center lg:order-1">
              <div className="w-full px-6 py-12 sm:px-10 sm:py-16 lg:px-14 xl:px-20">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-red-500" />

                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-500 sm:text-sm">
                    Saree Collection
                  </p>
                </div>

                <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl xl:text-7xl">
                  {categoryName} Sarees
                </h1>

                <div className="mt-6 h-1 w-16 rounded-full bg-red-500" />

                <p className="mt-7 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
                  {category.shortDescription?.trim() ||
                    `Explore our beautiful collection of ${categoryLower} sarees, featuring elegant designs, beautiful colours and timeless Indian craftsmanship.`}
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/sarees?category=${encodeURIComponent(
                      category.slug,
                    )}`}
                    className="inline-flex items-center justify-center rounded-full bg-red-500 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-600 hover:shadow-md"
                  >
                    Shop {categoryName} Sarees
                  </Link>

                  <Link
                    href="/category"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3.5 text-sm font-semibold text-gray-800 transition-all hover:border-gray-400 hover:bg-gray-100"
                  >
                    Explore Categories
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                {products.length > 0 && (
                  <div className="mt-10 flex items-center gap-3 border-t border-gray-200 pt-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-500">
                      {products.length}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {products.length === 1
                          ? "Design Available"
                          : "Designs Available"}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        Explore the collection
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* IMAGE */}

            <div className="order-1 p-3 sm:p-4 lg:order-2">
              <div className="relative min-h-[480px] overflow-hidden rounded-[1.4rem] bg-gray-100 sm:min-h-[600px] lg:h-full lg:min-h-[620px]">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={`${categoryName} sarees collection`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.015]"
                  />
                ) : (
                  <div className="flex h-full min-h-[480px] items-center justify-center">
                    <span className="text-sm text-gray-400">
                      No Image Available
                    </span>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-2 shadow-sm backdrop-blur-sm sm:bottom-7 sm:left-7">
                  <p className="text-xs font-semibold text-gray-800">
                    MYSMME Saree Collection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            ABOUT COLLECTION
        ==================================================== */}

        <section className="border-y border-gray-100 bg-white">
          <div className="container mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.32fr_0.68fr] lg:gap-16">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-red-500" />

                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
                    About the Collection
                  </p>
                </div>

                <p className="mt-5 max-w-sm text-sm leading-7 text-gray-500">
                  Discover the character, style and timeless appeal behind the{" "}
                  {categoryLower} saree collection.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Discover {categoryName} Sarees
                </h2>

                <div className="mt-5 h-1 w-14 rounded-full bg-red-500" />

                <div className="mt-7 max-w-3xl text-base leading-8 text-gray-600">
                  {category.description?.trim() ? (
                    <p>{category.description}</p>
                  ) : (
                    <div className="space-y-6">
                      <p>
                        {categoryName} sarees are a beautiful choice for women
                        looking to add elegance and traditional character to
                        their wardrobe. Depending on the design and fabric, they
                        can be styled for weddings, festivals, family
                        celebrations, formal occasions and everyday wear.
                      </p>

                      <p>
                        Each saree collection can have its own distinctive
                        colours, patterns, textures and styling possibilities.
                        Exploring a dedicated collection makes it easier to
                        compare designs and find a saree that suits your
                        occasion and personal style.
                      </p>

                      <p>
                        Browse the {categoryLower} sarees available at MYSMME
                        and discover designs selected for modern wardrobes while
                        celebrating the timeless appeal of Indian sarees.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            PRODUCTS
        ==================================================== */}

        {visibleProducts.length > 0 && (
          <section
            aria-labelledby="category-products-heading"
            className="bg-gray-50"
          >
            <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-24">
              <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-red-500" />

                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
                      Shop the Collection
                    </p>
                  </div>

                  <h2
                    id="category-products-heading"
                    className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                  >
                    {categoryName} Sarees Collection
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
                    Explore available {categoryLower} sarees from our
                    collection.
                  </p>
                </div>

                <Link
                  href={`/sarees?category=${encodeURIComponent(category.slug)}`}
                  className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-red-500 transition-colors hover:text-red-600"
                >
                  View All
                  <span aria-hidden="true">→</span>
                </Link>
              </header>

              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                {visibleProducts.map((product) => {
                  const productImage = product.images?.[0] || product.image;

                  const displayedPrice =
                    product.salePrice !== undefined
                      ? product.salePrice
                      : product.price;

                  return (
                    <Link
                      key={product._id || product.slug}
                      href={`/sarees/${encodeURIComponent(
                        product.slug as string,
                      )}`}
                      className="group block"
                    >
                      <article>
                        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
                          {productImage ? (
                            <Image
                              src={productImage}
                              alt={`${product.name} - ${categoryName} saree`}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="px-1 pt-4">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-red-500">
                            MYSMME
                          </p>

                          <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-5 text-gray-800 transition-colors group-hover:text-red-500 sm:text-base">
                            {product.name}
                          </h3>

                          {displayedPrice !== undefined && (
                            <p className="mt-2 text-sm font-bold text-gray-900 sm:text-base">
                              ₹{displayedPrice.toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-12 text-center">
                <Link
                  href={`/sarees?category=${encodeURIComponent(category.slug)}`}
                  className="inline-flex items-center justify-center rounded-full bg-red-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-600 hover:shadow-md"
                >
                  View All {categoryName} Sarees
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ====================================================
            MYSMME BRAND STATEMENT
        ==================================================== */}

        <section className="border-y border-red-100 bg-red-50">
          <div className="container mx-auto max-w-5xl px-4 py-16 text-center sm:py-20 lg:py-24">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
              <span className="h-3 w-3 rounded-full bg-red-500" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
              MYSMME
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Sarees for every beautiful moment.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
              Discover sarees for weddings, celebrations, festivals, workwear
              and everyday elegance — thoughtfully brought together at MYSMME.
            </p>
          </div>
        </section>

        {/* ====================================================
            FAQ
        ==================================================== */}

        <section className="bg-white">
          <div className="container mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[0.35fr_0.65fr] lg:gap-16">
              <header>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-red-500" />

                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
                    Helpful Information
                  </p>
                </div>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Frequently Asked Questions
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-7 text-gray-500">
                  Helpful information about {categoryLower} sarees, styling and
                  choosing the right piece.
                </p>
              </header>

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {/* FAQ 1 */}

                <details className="group border-b border-gray-200 px-5 py-1 last:border-b-0 sm:px-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-semibold text-gray-900">
                    <span>What are {categoryName} sarees?</span>

                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-lg font-medium text-red-500 transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-gray-600 sm:text-base">
                    {category.description?.trim() ||
                      `${categoryName} sarees are a category of Indian sarees recognised for their particular style, fabric, design or traditional character. Explore the collection above to discover the designs available at MYSMME.`}
                  </div>
                </details>

                {/* FAQ 2 */}

                <details className="group border-b border-gray-200 px-5 py-1 last:border-b-0 sm:px-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-semibold text-gray-900">
                    <span>When should I wear {categoryLower} sarees?</span>

                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-lg font-medium text-red-500 transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-gray-600 sm:text-base">
                    {categoryName} sarees can be suitable for different
                    occasions depending on their fabric, colour, design and
                    embellishment. They can be styled for weddings, festivals,
                    celebrations, formal events or everyday occasions depending
                    on the specific fabric and styling of the piece.
                  </div>
                </details>

                {/* FAQ 3 */}

                <details className="group border-b border-gray-200 px-5 py-1 last:border-b-0 sm:px-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-semibold text-gray-900">
                    <span>
                      What fabric should I choose for {categoryLower} sarees?
                    </span>

                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-lg font-medium text-red-500 transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-gray-600 sm:text-base">
                    Fabric choice depends on the occasion and comfort you need.
                    Cotton and linen work well for breathability and daily wear,
                    while silk and georgette can suit more formal or festive
                    settings. Check each product&apos;s fabric details to find
                    the right match.
                  </div>
                </details>

                {/* FAQ 4 */}

                <details className="group px-5 py-1 sm:px-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-semibold text-gray-900">
                    <span>
                      Where can I shop for {categoryLower} sarees online?
                    </span>

                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-lg font-medium text-red-500 transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-gray-600 sm:text-base">
                    You can explore the {categoryLower} saree collection
                    available at MYSMME using the products listed on this page
                    and browse the full collection to compare available designs.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            BOTTOM CTA
        ==================================================== */}

        <section className="border-t border-gray-100 bg-gray-50">
          <div className="container mx-auto max-w-5xl px-4 py-16 text-center sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-500">
              Discover More
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Explore More Saree Collections
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
              Discover more saree styles, fabrics and traditional collections
              from MYSMME.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/category"
                className="inline-flex items-center justify-center rounded-full bg-red-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-600 hover:shadow-md"
              >
                Browse Categories
              </Link>

              <Link
                href="/sarees"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-8 py-3.5 text-sm font-semibold text-gray-800 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Shop All Sarees
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
