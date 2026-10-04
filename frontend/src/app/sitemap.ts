import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://mysmme.com"
).replace(/\/$/, "");

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://api.mysmme.com/api"
).replace(/\/$/, "");

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
  data?: Product[];
};

type CategoriesApiResponse = {
  success: boolean;
  message?: string;
  data?: Category[];
};

async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "[SITEMAP] Products API failed:",
        response.status,
        response.statusText,
      );

      return [];
    }

    const result: ProductsApiResponse = await response.json();

    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("[SITEMAP] Products fetch error:", error);

    return [];
  }
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/category`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "[SITEMAP] Categories API failed:",
        response.status,
        response.statusText,
      );

      return [];
    }

    const result: CategoriesApiResponse = await response.json();

    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("[SITEMAP] Categories fetch error:", error);

    return [];
  }
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

  console.log("[SITEMAP] API URL:", API_URL);
  console.log("[SITEMAP] Products:", products.length);
  console.log("[SITEMAP] Categories:", activeCategories.length);

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

    {
      url: `${SITE_URL}/careers`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    {
      url: `${SITE_URL}/partners`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    // ============================================================
    // CATEGORY DETAIL PAGES
    // ============================================================

    ...activeCategories.map((category) => ({
      url: `${SITE_URL}/category/${encodeURIComponent(category.slug!)}`,
      lastModified: category.updatedAt ? new Date(category.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    // ============================================================
    // PRODUCT DETAIL PAGES
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
