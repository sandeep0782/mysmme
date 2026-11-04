import type { Metadata } from "next";
import type { ReactNode } from "react";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://mysmme.com"
).replace(/\/+$/, "");

const title = "Fashion & Saree Styling Blog | MYSMME";

const description =
  "Explore saree styling ideas, ethnic fashion trends, fabric guides, and fashion inspiration at MYSMME.";

const blogUrl = `${siteUrl}/blogs`;

export const metadata: Metadata = {
  title,
  description,

  alternates: {
    canonical: blogUrl,
  },

  openGraph: {
    type: "website",
    title,
    description,
    url: blogUrl,
    siteName: "MYSMME",
    locale: "en_IN",
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

export default function BlogsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
