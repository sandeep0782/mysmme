import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const API_URL = process.env.API_URL || "http://mysmme-server:8000/api";

type Product = {
  slug?: string;
  updatedAt?: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T[];
};

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Products API failed: ${response.status}`);
  }

  const result: ApiResponse<Product> = await response.json();

  return result.data || [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchProducts();

  console.log(
    "SITEMAP PRODUCTS:",
    products.length,
    products.map((product) => product.slug),
  );

  const now = new Date();

  return [
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

    ...products
      .filter((product) => product.slug)
      .map((product) => ({
        url: `${SITE_URL}/sarees/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
  ];
}
