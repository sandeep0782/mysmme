import type { Metadata } from "next";

import BrandDetailsPage from "./BrandDetailsPage";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const brandName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const title = `${brandName} Sarees | MYSMME`;

  const description = `Explore ${brandName} sarees on MYSMME. Discover beautiful Indian sarees for weddings, festivals, celebrations and everyday elegance.`;

  return {
    title,
    description,

    alternates: {
      canonical: `https://mysmme.com/brands/${slug}`,
    },

    openGraph: {
      title,
      description,
      url: `https://mysmme.com/brands/${slug}`,
      siteName: "MYSMME",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function Page() {
  return <BrandDetailsPage />;
}
