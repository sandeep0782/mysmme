import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://mysmme.com"
).replace(/\/+$/, "");

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://api.mysmme.com/api"
).replace(/\/+$/, "");

type Product = {
  slug?: string;
  updatedAt?: string;
  createdAt?: string;
};

type Category = {
  _id: string;
  name: string;
  description?: string;
  slug?: string;
  image?: string;
  isActive: boolean;
  updatedAt?: string;
  createdAt?: string;
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

function validDate(value?: string | null): Date | undefined {
  if (!value) return undefined;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  if (date.getTime() > Date.now()) {
    return undefined;
  }

  return date;
}

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

type Blog = {
  slug?: string;
  updatedAt?: string;
  createdAt?: string;
  publishedAt?: string | null;
};

async function fetchBlogs(): Promise<Blog[]> {
  const all: Blog[] = [];

  try {
    for (let page = 1; page <= 20; page++) {
      const response = await fetch(`${API_URL}/blogs?page=${page}&limit=50`, {
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("[SITEMAP] Blogs API failed:", response.status);
        break;
      }

      const json = await response.json();
      const root = json?.data ?? json;
      const blogs: Blog[] = Array.isArray(root?.blogs) ? root.blogs : [];
      all.push(...blogs);

      const totalPages = Number(root?.pagination?.totalPages ?? 1);
      if (page >= totalPages) break;
    }
  } catch (error) {
    console.error("[SITEMAP] Blogs fetch error:", error);
  }

  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, blogs] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
    fetchBlogs(),
  ]);

  const activeCategories = categories.filter(
    (category) => category.isActive && category.slug && category.name?.trim(),
  );

  console.log("[SITEMAP] API URL:", API_URL);

  console.log("[SITEMAP] Products:", products.length);
  console.log(
    "[SITEMAP] Products with slug:",
    products.filter((product) => product.slug).length,
  );

  console.log("[SITEMAP] Categories:", categories.length);
  console.log("[SITEMAP] Active categories:", activeCategories.length);

  console.log("[SITEMAP] Blogs:", blogs.length);
  console.log(
    "[SITEMAP] Blogs with slug:",
    blogs.filter((blog) => blog.slug).length,
  );

  console.log(
    "[SITEMAP] Total expected URLs:",
    12 +
      products.filter((product) => product.slug).length +
      activeCategories.length +
      blogs.filter((blog) => blog.slug).length,
  );
  return [
    // ============================================================
    // MAIN PAGES
    // ============================================================

    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: `${SITE_URL}/sarees`,
      changeFrequency: "daily",
      priority: 0.9,
    },

    // ============================================================
    // CATEGORY INDEX
    // ============================================================

    {
      url: `${SITE_URL}/category`,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // ============================================================
    // OTHER SEO PAGES
    // ============================================================

    {
      url: `${SITE_URL}/brands`,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${SITE_URL}/about-us`,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${SITE_URL}/how-it-works`,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${SITE_URL}/faq`,
      changeFrequency: "monthly",
      priority: 0.6,
    },

    {
      url: `${SITE_URL}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    {
      url: `${SITE_URL}/terms-of-use`,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    {
      url: `${SITE_URL}/careers`,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    {
      url: `${SITE_URL}/partners`,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    // ============================================================
    // BLOG
    // ============================================================

    {
      url: `${SITE_URL}/blogs`,
      changeFrequency: "weekly",
      priority: 0.7,
    },

    ...blogs
      .filter((blog) => blog.slug)
      .map((blog) => ({
        url: `${SITE_URL}/blogs/${encodeURIComponent(blog.slug!)}`,
        lastModified:
          validDate(blog.updatedAt) ??
          validDate(blog.publishedAt) ??
          validDate(blog.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),

    // ============================================================
    // CATEGORY DETAIL PAGES
    // ============================================================

    ...activeCategories.map((category) => ({
      url: `${SITE_URL}/category/${encodeURIComponent(category.slug!)}`,
      lastModified:
        validDate(category.updatedAt) ?? validDate(category.createdAt),
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
        lastModified:
          validDate(product.updatedAt) ?? validDate(product.createdAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
  ];
}
