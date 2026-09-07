import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mysmme.com";
const API_URL = process.env.API_URL || "http://mysmme-server:8000/api";

type Product = {
  slug?: string;
  updatedAt?: string;
};

type Category = {
  _id: string;
  name: string;
  description?: string;
  slug?: string;
  image?: string;
  isActive: boolean;
  updatedAt?: string;
};

type ProductsApiResponse = {
  success: boolean;
  data: Product[];
};

type CategoriesApiResponse = {
  success: boolean;
  message?: string;
  data: Category[];
};

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Products API failed: ${response.status}`);
  }

  const result: ProductsApiResponse = await response.json();

  return result.data || [];
}

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/category`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Categories API failed: ${response.status}`);
  }

  const result: CategoriesApiResponse = await response.json();

  return result.data || [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
  ]);

  const now = new Date();

  const activeCategories = categories.filter(
    (category) => category.isActive && category.slug && category.name?.trim(),
  );

  console.log("SITEMAP PRODUCTS:", products.length);

  console.log(
    "SITEMAP CATEGORIES:",
    activeCategories.length,
    activeCategories.map((category) => category.slug),
  );

  return [
    // ============================================================
    // MAIN PAGES
    // ============================================================

    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: `${SITE_URL}/sarees`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },

    // ============================================================
    // CATEGORY INDEX
    // ============================================================

    {
      url: `${SITE_URL}/category`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // ============================================================
    // OTHER SEO PAGES
    // ============================================================

    {
      url: `${SITE_URL}/brands`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${SITE_URL}/about-us`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${SITE_URL}/how-it-works`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },

    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    {
      url: `${SITE_URL}/terms-of-use`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    // ============================================================
    // CATEGORY DETAIL PAGES
    // /category/[slug]
    // ============================================================

    ...activeCategories.map((category) => ({
      url: `${SITE_URL}/category/${encodeURIComponent(category.slug!)}`,
      lastModified: category.updatedAt ? new Date(category.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    // ============================================================
    // PRODUCT DETAIL PAGES
    // /sarees/[slug]
    // ============================================================

    ...products
      .filter((product) => product.slug)
      .map((product) => ({
        url: `${SITE_URL}/sarees/${encodeURIComponent(product.slug!)}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
  ];
}
