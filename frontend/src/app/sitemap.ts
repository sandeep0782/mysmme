import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type SitemapItem = {
  slug: string;
  updatedAt?: string | Date;
};

async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${apiUrl}${path}: ${response.status}`);
  }

  return response.json();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  let products: SitemapItem[] = [];
  let categories: SitemapItem[] = [];
  let sellers: SitemapItem[] = [];

  try {
    const [productsResponse, categoriesResponse, sellersResponse] =
      await Promise.all([
        fetchApi<{ data: SitemapItem[] }>("/products"),
        fetchApi<{ data: SitemapItem[] }>("/category"),
        fetchApi<{ data: SitemapItem[] }>("/users"),
      ]);

    products = productsResponse.data ?? [];
    categories = categoriesResponse.data ?? [];
    sellers = sellersResponse.data ?? [];
  } catch (error) {
    console.error("Sitemap API error:", error);
  }

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: `${siteUrl}/sarees`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },

    {
      url: `${siteUrl}/about-us`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${siteUrl}/how-it-works`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    {
      url: `${siteUrl}/terms-of-use`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    ...products
      .filter((product) => product.slug)
      .map((product) => ({
        url: `${siteUrl}/sarees/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),

    ...categories
      .filter((category) => category.slug)
      .map((category) => ({
        url: `${siteUrl}/brands/${category.slug}`,
        lastModified: category.updatedAt ? new Date(category.updatedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),

    ...sellers
      .filter((seller) => seller.slug)
      .map((seller) => ({
        url: `${siteUrl}/sellers/${seller.slug}`,
        lastModified: seller.updatedAt ? new Date(seller.updatedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
  ];
}
