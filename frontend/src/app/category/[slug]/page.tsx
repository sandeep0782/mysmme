import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    /*
     * We first fetch all categories because your current API
     * exposes GET /api/category and GET /api/category/:id,
     * not GET /api/category/slug/:slug.
     */
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
    /*
     * This endpoint assumes your products API supports:
     *
     * GET /api/products?category=<slug>
     *
     * If your backend uses a different parameter, change only
     * this URL.
     */
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
      title: "Saree Category Not Found | MySMMe",
      description: "The requested saree category could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const categoryName = category.name.trim();

  const title = `${categoryName} Sarees | Shop ${categoryName} Saree Collection`;

  const description =
    category.description?.trim() ||
    `Explore beautiful ${categoryName} sarees at MySMMe. Discover our collection of ${categoryName} sarees in different designs, colours and styles for weddings, festivals, celebrations and everyday wear.`;

  const canonicalUrl = `${SITE_URL}/category/${encodeURIComponent(
    category.slug,
  )}`;

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
      "Indian sarees",
      "MySMMe sarees",
    ],

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description: description.slice(0, 200),
      url: canonicalUrl,
      type: "website",
      siteName: "MySMMe",

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

  const categoryUrl = `${SITE_URL}/category/${encodeURIComponent(
    category.slug,
  )}`;

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
          category.description || `Explore ${categoryName} sarees at MySMMe.`,
        isPartOf: {
          "@type": "WebSite",
          url: SITE_URL,
          name: "MySMMe",
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

  const products = await fetchCategoryProducts(category.slug);

  return (
    <>
      <CategoryStructuredData category={category} products={products} />

      <main className="bg-white">
        {/* ======================================================
            BREADCRUMB
        ====================================================== */}

        <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="transition-colors hover:text-red-500">
                Home
              </Link>
            </li>

            <li aria-hidden="true">/</li>

            <li>
              <Link
                href="/category"
                className="transition-colors hover:text-red-500"
              >
                Saree Categories
              </Link>
            </li>

            <li aria-hidden="true">/</li>

            <li aria-current="page" className="font-medium text-gray-800">
              {categoryName} Sarees
            </li>
          </ol>
        </nav>

        {/* ======================================================
            CATEGORY HERO
        ====================================================== */}

        <section className="container mx-auto px-4 pb-16 pt-10 sm:pb-20 sm:pt-14">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* IMAGE */}

            <div className="relative mx-auto w-full max-w-xl">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gray-100 shadow-lg">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={`${categoryName} sarees collection`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    No Image Available
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </div>

            {/* CONTENT */}

            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500 sm:text-sm">
                Saree Collection
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                {categoryName} Sarees
              </h1>

              <div className="mt-6 h-1 w-16 rounded-full bg-red-500" />

              {category.description ? (
                <p className="mt-7 text-base leading-8 text-gray-600 sm:text-lg">
                  {category.description}
                </p>
              ) : (
                <p className="mt-7 text-base leading-8 text-gray-600 sm:text-lg">
                  Explore our beautiful collection of{" "}
                  {categoryName.toLowerCase()} sarees, featuring elegant
                  designs, beautiful colours and timeless Indian craftsmanship.
                </p>
              )}

              <div className="mt-8">
                <Link
                  href={`/sarees?category=${encodeURIComponent(category.slug)}`}
                  className="inline-flex items-center justify-center rounded-full bg-red-500 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-600 hover:shadow-md"
                >
                  Shop {categoryName} Sarees
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            ABOUT THIS CATEGORY
        ====================================================== */}

        <section className="border-y bg-gray-50">
          <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
              About the Collection
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Discover {categoryName} Sarees
            </h2>

            <div className="mt-7 space-y-6 text-base leading-8 text-gray-600">
              {category.description && <p>{category.description}</p>}

              <p>
                {categoryName} sarees are a beautiful choice for women looking
                to add elegance and traditional character to their wardrobe.
                Depending on the design and fabric, they can be styled for
                weddings, festivals, family celebrations, formal occasions and
                everyday wear.
              </p>

              <p>
                Each saree collection can have its own distinctive colours,
                patterns, textures and styling possibilities. Exploring a
                dedicated category makes it easier to compare different designs
                and find a saree that suits your occasion and personal style.
              </p>

              <p>
                Browse the {categoryName.toLowerCase()} sarees available in our
                collection and discover designs selected for modern wardrobes
                while celebrating the timeless appeal of Indian sarees.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================
            PRODUCTS
        ====================================================== */}

        {products.length > 0 && (
          <section
            aria-labelledby="category-products-heading"
            className="container mx-auto px-4 py-16 sm:py-20"
          >
            <header className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
                Shop the Collection
              </p>

              <h2
                id="category-products-heading"
                className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl"
              >
                {categoryName} Sarees Collection
              </h2>

              <p className="mt-2 max-w-2xl text-gray-500">
                Explore available {categoryName.toLowerCase()} sarees from our
                collection.
              </p>
            </header>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {products
                .filter((product) => product.slug && product.name)
                .slice(0, 12)
                .map((product) => {
                  const productImage = product.images?.[0] || product.image;

                  return (
                    <Link
                      key={product._id || product.slug}
                      href={`/sarees/${encodeURIComponent(
                        product.slug as string,
                      )}`}
                      className="group"
                    >
                      <article>
                        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
                          {productImage ? (
                            <Image
                              src={productImage}
                              alt={`${product.name} - ${categoryName} saree`}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-gray-800 transition-colors group-hover:text-red-500 sm:text-base">
                          {product.name}
                        </h3>

                        {product.salePrice !== undefined ? (
                          <div className="mt-1 text-sm font-semibold text-gray-900">
                            ₹{product.salePrice.toLocaleString("en-IN")}
                          </div>
                        ) : product.price !== undefined ? (
                          <div className="mt-1 text-sm font-semibold text-gray-900">
                            ₹{product.price.toLocaleString("en-IN")}
                          </div>
                        ) : null}
                      </article>
                    </Link>
                  );
                })}
            </div>

            <div className="mt-10 text-center">
              <Link
                href={`/sarees?category=${encodeURIComponent(category.slug)}`}
                className="inline-flex items-center justify-center rounded-full border border-gray-900 px-7 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
              >
                View All {categoryName} Sarees
              </Link>
            </div>
          </section>
        )}

        {/* ======================================================
            CATEGORY FAQ / SEO SUPPORT
        ====================================================== */}

        <section className="border-t bg-white">
          <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Frequently Asked Questions About {categoryName} Sarees
            </h2>

            <div className="mt-8 divide-y divide-gray-200 border-y border-gray-200">
              <details className="group py-5">
                <summary className="cursor-pointer list-none pr-8 font-semibold text-gray-900">
                  What are {categoryName} sarees?
                </summary>

                <p className="mt-3 leading-7 text-gray-600">
                  {categoryName} sarees are a category of Indian sarees
                  recognised for their particular style, fabric, design or
                  traditional character. Explore the collection above to
                  discover the designs available at MySMMe.
                </p>
              </details>

              <details className="group py-5">
                <summary className="cursor-pointer list-none pr-8 font-semibold text-gray-900">
                  When can I wear a {categoryName} saree?
                </summary>

                <p className="mt-3 leading-7 text-gray-600">
                  {categoryName} sarees can be suitable for different occasions
                  depending on their fabric, colour, design and embellishment.
                  They can be styled for weddings, festivals, celebrations,
                  formal events or everyday occasions.
                </p>
              </details>

              <details className="group py-5">
                <summary className="cursor-pointer list-none pr-8 font-semibold text-gray-900">
                  Where can I shop for {categoryName} sarees?
                </summary>

                <p className="mt-3 leading-7 text-gray-600">
                  You can explore the {categoryName.toLowerCase()} saree
                  collection available at MySMMe using the products listed on
                  this page.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* ======================================================
            BOTTOM CTA
        ====================================================== */}

        <section className="border-t bg-red-50">
          <div className="container mx-auto px-4 py-14 text-center sm:py-16">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Explore More Saree Categories
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-gray-600">
              Discover more saree styles, fabrics and traditional collections
              from MySMMe.
            </p>

            <Link
              href="/category"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-red-500 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              Browse All Categories
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
