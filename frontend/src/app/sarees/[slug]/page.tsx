import { notFound } from "next/navigation";
import type { Metadata } from "next";

import SareeDetailsClient from "./SareeDetailsClient";
import type { SareeProduct } from "@/types/product";

type ProductApiResponse = {
  success: boolean;
  message?: string;
  data?: SareeProduct;
};

async function getProduct(slug: string): Promise<SareeProduct | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const url = `${apiUrl}/products/slug/${encodeURIComponent(slug)}`;

  console.log("[SAREE PAGE] slug:", slug);

  console.log("[SAREE PAGE] API URL:", url);

  const res = await fetch(url, {
    cache: "no-store",
  });

  console.log("[SAREE PAGE] API STATUS:", res.status);

  if (res.status === 404) {
    console.log("[SAREE PAGE] PRODUCT NOT FOUND -> notFound()");

    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch product. Status: ${res.status}`);
  }

  const json = (await res.json()) as ProductApiResponse;

  return json.data ?? null;
}

/* ============================================================
   SEO METADATA
============================================================ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const saree = await getProduct(slug);

  if (!saree) {
    return {
      title: "Saree Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mysmme.com";

  const canonicalUrl = `${siteUrl}/sarees/${saree.slug || slug}`;

  const title = saree.title || "Buy Saree Online";

  const description =
    saree.description ||
    `Shop ${title} online at MYSMME. Discover sarees from sellers across India.`;

  const image = saree.images?.[0];

  return {
    title,

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",

      url: canonicalUrl,

      title,

      description,

      siteName: "MYSMME",

      locale: "en_IN",

      images: image
        ? [
            {
              url: image,
              alt: title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",

      title,

      description,

      images: image ? [image] : undefined,
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

/* ============================================================
   PAGE
============================================================ */

export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  const saree = await getProduct(slug);

  if (!saree) {
    notFound();
  }

  return <SareeDetailsClient saree={saree} />;
}
