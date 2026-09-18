import { notFound } from "next/navigation";
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

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const saree = await getProduct(slug);

  if (!saree) {
    notFound();
  }

  return <SareeDetailsClient saree={saree} />;
}
