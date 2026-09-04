import type { Metadata } from "next";
import BrandsPage from "./BrandsPage";

export const metadata: Metadata = {
  title: "Saree Brands | Discover Saree Collections Online",
  description:
    "Discover saree brands and explore beautiful saree collections, traditional designs, and modern styles from sellers on MYSMME.",

  alternates: {
    canonical: "/brands",
  },

  openGraph: {
    title: "Saree Brands | Discover Saree Collections Online",
    description:
      "Explore saree brands and discover beautiful sarees, traditional designs, and modern collections on MYSMME.",
    url: "/brands",
    type: "website",
    siteName: "MYSMME",
  },

  twitter: {
    card: "summary_large_image",
    title: "Saree Brands | Discover Saree Collections Online",
    description:
      "Explore saree brands and discover beautiful saree collections on MYSMME.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <BrandsPage />;
}
