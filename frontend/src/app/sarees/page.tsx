import type { Metadata } from "next";
import { Suspense } from "react";
import SareesPageClient from "./SareesPageClient";

export const metadata: Metadata = {
  title: "Sarees Online | Shop Sarees from Trusted Sellers | MYSMME",

  description:
    "Shop beautiful sarees online on MYSMME. Explore silk, cotton, Banarasi, wedding and designer sarees from trusted sellers.",

  alternates: {
    canonical: "/sarees",
  },

  openGraph: {
    title: "Sarees Online | Shop Sarees from Trusted Sellers | MYSMME",
    description:
      "Shop beautiful sarees online on MYSMME. Explore silk, cotton, Banarasi, wedding and designer sarees from trusted sellers.",
    url: "/sarees",
    type: "website",
  },
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <SareesPageClient />
    </Suspense>
  );
}
