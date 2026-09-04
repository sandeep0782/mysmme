import type { Metadata } from "next";

import BrandDetailsPage from "./BrandDetailsPage";

export const metadata: Metadata = {
  title: "Brand | MYSMME",
  description:
    "Discover this saree brand on MYSMME and stay tuned for its upcoming collection.",

  alternates: {
    canonical: "/brands",
  },
};

export default function Page() {
  return <BrandDetailsPage />;
}
