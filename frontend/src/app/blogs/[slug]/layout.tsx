import type { Metadata } from "next";
import type { ReactNode } from "react";

type BlogSEO = {
  title: string;
  slug: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  featuredImage?: string;
  imageAlt?: string;
  author?: string;
  publishedAt?: string | null;
  updatedAt?: string;
  tags?: string[];
};

type BlogResponse = {
  success: boolean;
  data: BlogSEO | null;
};

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

// Website URL
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://mysmme.com"
).replace(/\/+$/, "");

// Backend API URL
const API_URL = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api"
).replace(/\/+$/, "");

// Fetch blog SEO information
async function getBlog(slug: string): Promise<BlogSEO | null> {
  const response = await fetch(
    `${API_URL}/blogs/slug/${encodeURIComponent(slug)}`,
    {
      next: {
        revalidate: 300,
      },
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Blog SEO API failed: ${response.status}`);
  }

  const result: BlogResponse = await response.json();

  if (!result.success || !result.data) {
    return null;
  }

  return result.data;
}

// Dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const blog = await getBlog(slug);

  // Blog not found
  if (!blog) {
    return {
      title: "Blog Not Found | MYSMME",
      description: "The requested blog article was not found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // SEO Title
  const title = blog.seoTitle?.trim() || blog.title;

  // SEO Description
  const description = blog.seoDescription?.trim() || blog.excerpt || "";

  // Always use the article URL as canonical.
  // Do not allow a saved homepage canonical to override it.
  const canonical = `${SITE_URL}/blogs/${encodeURIComponent(blog.slug || slug)}`;

  // Featured image metadata
  const images = blog.featuredImage
    ? [
        {
          url: blog.featuredImage,
          alt: blog.imageAlt?.trim() || blog.title,
        },
      ]
    : [];

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      siteName: "MYSMME",
      locale: "en_IN",
      images,
      publishedTime: blog.publishedAt || undefined,
      modifiedTime: blog.updatedAt || undefined,
      authors: [blog.author?.trim() || "MYSMME Editorial Team"],
      tags: blog.tags || [],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

// Blog SEO Layout
export default function BlogSEOLayout({ children }: Props) {
  return <>{children}</>;
}
