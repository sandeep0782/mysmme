import type { Metadata } from "next";
import type { ComponentProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SareeCard from "../../../components/sarees/SareeCard";
import CategoryFilters from "@/components/category/CategoryFilters";
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

  category?:
    | string
    | {
        _id: string;
        name?: string;
        slug?: string;
      };
  brand?: string | { _id?: string; name?: string; slug?: string };
  color?:
    | string
    | {
        _id?: string;
        name?: string;
        slug?: string;
      };
  title?: string;
  slug?: string;
  image?: string;
  images?: string[];
  price?: number;
  finalPrice?: number;
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
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string | string[];
    brand?: string | string[];
    color?: string | string[];
    discount?: string | string[];
  }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const { page } = query;
  const hasFilters = ["brand", "color", "discount"].some((key) => key in query);
  const pageValue = Array.isArray(page) ? page[0] : page;
  const parsedPage = Number(pageValue ?? "1");

  const currentPage =
    Number.isSafeInteger(parsedPage) && parsedPage > 1 ? parsedPage : 1;
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

  const title =
    `${categoryName} Sarees | Shop ${categoryName} Saree Collection` +
    (currentPage > 1 ? ` | Page ${currentPage}` : "");

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

  const baseUrl = `${SITE_URL}/category/${encodeURIComponent(category.slug)}`;

  const canonicalUrl = hasFilters
    ? baseUrl
    : currentPage === 1
      ? baseUrl
      : `${baseUrl}?page=${currentPage}`;
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
      index: !hasFilters,
      follow: true,

      googleBot: {
        index: !hasFilters,
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
    .filter((product) => product.slug && product.title)
    .slice(0, 50)
    .map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.title,
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
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string | string[];
    brand?: string | string[];
    color?: string | string[];
    discount?: string | string[];
  }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const { page } = query;
  const toArray = (value?: string | string[]): string[] =>
    (Array.isArray(value) ? value : value ? [value] : [])
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

  const selectedBrands = toArray(query.brand);
  const selectedColors = toArray(query.color);

  const selectedDiscounts = toArray(query.discount)
    .map(Number)
    .filter((value) => Number.isFinite(value) && value > 0);

  const pageValue = Array.isArray(page) ? page[0] : page;
  const parsedPage = Number(pageValue ?? "1");
  const requestedPage =
    Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const category = await fetchCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryName = category.name.trim();
  const categoryLower = categoryName.toLowerCase();

  const products = await fetchCategoryProducts(category.slug);

  const categoryProducts = products.filter((product) => {
    const productCategoryId =
      typeof product.category === "string"
        ? product.category
        : product.category?._id;

    return String(productCategoryId ?? "") === String(category._id);
  });

  const ITEMS_PER_PAGE = 15;

  const getValue = (value: unknown): string => {
    if (typeof value === "string") {
      return value.trim().toLowerCase();
    }

    if (value && typeof value === "object") {
      const obj = value as {
        name?: string;
        slug?: string;
      };

      return String(obj.slug ?? obj.name ?? "")
        .trim()
        .toLowerCase();
    }

    return "";
  };

  const validProducts = categoryProducts.filter((product) => {
    if (!product.slug || !product.title) {
      return false;
    }

    // BRAND
    if (selectedBrands.length > 0) {
      const brand = getValue(product.brand);

      if (!selectedBrands.includes(brand)) {
        return false;
      }
    }

    // COLOR
    if (selectedColors.length > 0) {
      const color =
        typeof product.color === "object" && product.color !== null
          ? String(product.color.name ?? "")
              .trim()
              .toLowerCase()
          : getValue(product.color);

      if (!selectedColors.includes(color)) {
        return false;
      }
    }

    // DISCOUNT
    if (selectedDiscounts.length > 0) {
      const price = Number(product.price ?? 0);
      const finalPrice = Number(product.finalPrice ?? 0);

      const discount =
        price > 0 && finalPrice > 0 && finalPrice < price
          ? Math.round(((price - finalPrice) / price) * 100)
          : 0;

      // Any selected discount threshold can match
      if (!selectedDiscounts.some((min) => discount >= min)) {
        return false;
      }
    }

    return true;
  });

  const totalProducts = validProducts.length;

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  if (requestedPage > Math.max(1, totalPages)) {
    notFound();
  }

  const currentPage = requestedPage;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const visibleProducts = validProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <>
      <CategoryStructuredData category={category} products={visibleProducts} />

      <main className="min-h-screen bg-white text-gray-900">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="container mx-auto px-4 pb-3 pt-5"
        >
          <ol className="flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm">
            <li>
              <Link href="/" className="hover:text-red-600">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/category" className="hover:text-red-600">
                Saree Categories
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-gray-900">
              {categoryName} Sarees
            </li>
          </ol>
        </nav>

        {/* Compact category introduction */}
        <section className="container mx-auto px-4 pb-7 pt-4 sm:pb-9">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-600">
                MYSMME / Saree Collections
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {categoryName} Sarees
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                {category.shortDescription?.trim() ||
                  `Explore ${categoryLower} sarees at MYSMME and discover styles, colours and fabrics for your wardrobe.`}
              </p>
              <p className="mt-3 text-sm font-medium text-gray-500">
                {totalProducts} {totalProducts === 1 ? "design" : "designs"}{" "}
                available
              </p>
            </div>
            {category.image && (
              <div className="relative hidden h-40 w-56 shrink-0 overflow-hidden rounded-2xl bg-gray-100 md:block lg:h-48 lg:w-72">
                <Image
                  src={category.image}
                  alt={`${categoryName} saree collection`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 224px, 288px"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </section>

        {/* Product listing */}
        <section
          id="shop-collection"
          aria-labelledby="category-products-heading"
          className="border-t border-gray-100 bg-gray-50/60"
        >
          <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 sm:py-10">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2
                  id="category-products-heading"
                  className="text-xl font-bold tracking-tight sm:text-2xl"
                >
                  Shop {categoryName} Sarees
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {totalProducts === 0
                    ? "No designs currently available"
                    : `Showing ${startIndex + 1}–${Math.min(startIndex + visibleProducts.length, totalProducts)} of ${totalProducts} designs`}
                </p>
              </div>
              <Link
                href="/category"
                className="text-sm font-semibold text-red-600 hover:text-red-700"
              >
                Explore other categories →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[240px_minmax(0,1fr)] xl:gap-6">
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <CategoryFilters
                    products={categoryProducts.filter((p) => p.slug && p.title)}
                  />
                </div>
              </aside>

              <div className="min-w-0">
                {visibleProducts.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {visibleProducts.map((product) => (
                      <SareeCard
                        key={product._id || product.slug}
                        saree={
                          product as ComponentProps<typeof SareeCard>["saree"]
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-white px-5 py-14 text-center">
                    <p className="font-medium text-gray-800">
                      No sarees are available in this collection right now.
                    </p>
                    <Link
                      href="/category"
                      className="mt-3 inline-block text-sm font-semibold text-red-600"
                    >
                      Browse other categories
                    </Link>
                  </div>
                )}

                {totalPages > 1 && (
                  <nav
                    aria-label="Product pagination"
                    className="mt-10 flex flex-wrap items-center justify-center gap-2"
                  >
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;
                      const params = new URLSearchParams();

                      selectedBrands.forEach((brand) =>
                        params.append("brand", brand),
                      );
                      selectedColors.forEach((color) =>
                        params.append("color", color),
                      );
                      selectedDiscounts.forEach((discount) =>
                        params.append("discount", String(discount)),
                      );

                      if (pageNumber > 1) {
                        params.set("page", String(pageNumber));
                      }

                      const queryString = params.toString();

                      const basePath = `/category/${encodeURIComponent(category.slug)}`;

                      const href = queryString
                        ? `${basePath}?${queryString}`
                        : basePath;
                      return (
                        <Link
                          key={pageNumber}
                          href={href}
                          aria-current={
                            pageNumber === currentPage ? "page" : undefined
                          }
                          className={`inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors ${pageNumber === currentPage ? "border-red-600 bg-red-600 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-red-500 hover:text-red-600"}`}
                        >
                          {pageNumber}
                        </Link>
                      );
                    })}
                  </nav>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SEO content: below products, available to readers and crawlers */}
        <section
          aria-labelledby="about-category-heading"
          className="border-t border-gray-100 bg-white"
        >
          <div className="container mx-auto max-w-5xl px-4 py-12 sm:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">
              About the Collection
            </p>
            <h2
              id="about-category-heading"
              className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Discover {categoryName} Sarees
            </h2>
            <div className="mt-5 max-w-4xl text-sm leading-8 text-gray-600 sm:text-base">
              {category.description?.trim() ? (
                <p className="whitespace-pre-line">{category.description}</p>
              ) : (
                <p>
                  Browse {categoryLower} sarees at MYSMME. Compare fabrics,
                  colours and prints to find designs that suit your comfort,
                  style and occasion. Check individual product pages for fabric
                  details and care instructions.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* FAQ: native details preserve server-rendered content */}
        <section
          aria-labelledby="category-faq-heading"
          className="border-t border-gray-100 bg-gray-50/60"
        >
          <div className="container mx-auto max-w-5xl px-4 py-12 sm:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">
              Helpful Information
            </p>
            <h2
              id="category-faq-heading"
              className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Frequently Asked Questions
            </h2>
            <div className="mt-7 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <details className="group border-b border-gray-200 px-5 py-1 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-semibold text-gray-900 sm:text-base">
                  <span>What are {categoryName} sarees?</span>
                  <span
                    aria-hidden="true"
                    className="text-xl text-red-600 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-5 text-sm leading-7 text-gray-600">
                  {category.description?.trim() ||
                    `${categoryName} sarees are grouped by their style, fabric or intended use. Explore the available products and check individual product details to choose the right saree.`}
                </p>
              </details>
              <details className="group border-b border-gray-200 px-5 py-1 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-semibold text-gray-900 sm:text-base">
                  <span>When can I wear {categoryLower} sarees?</span>
                  <span
                    aria-hidden="true"
                    className="text-xl text-red-600 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-5 text-sm leading-7 text-gray-600">
                  The right occasion depends on the fabric and design. Check
                  each saree’s material, pattern and styling details to decide
                  whether it suits daily use, work or a special occasion.
                </p>
              </details>
              <details className="group border-b border-gray-200 px-5 py-1 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-semibold text-gray-900 sm:text-base">
                  <span>How do I choose the right fabric?</span>
                  <span
                    aria-hidden="true"
                    className="text-xl text-red-600 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-5 text-sm leading-7 text-gray-600">
                  Consider comfort, climate, drape and care requirements. Refer
                  to the fabric composition and care instructions on each
                  product page before buying.
                </p>
              </details>
              <details className="group px-5 py-1 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-semibold text-gray-900 sm:text-base">
                  <span>
                    Where can I shop for {categoryLower} sarees online?
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-xl text-red-600 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-5 text-sm leading-7 text-gray-600">
                  You can browse available {categoryLower} sarees on this MYSMME
                  category page, compare designs and open each product for more
                  information.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Minimal discovery links */}
        <section className="border-t border-gray-100 bg-white">
          <div className="container mx-auto flex flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Explore more saree collections
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Find more styles for your wardrobe at MYSMME.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/category"
                className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:border-red-500 hover:text-red-600"
              >
                Browse Categories
              </Link>
              <Link
                href="/sarees"
                className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
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
