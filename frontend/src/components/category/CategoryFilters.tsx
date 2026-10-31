"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SareeFilters from "@/components/sarees/SareeFilters";

interface CategoryFiltersProps {
  products: any[];
}

export default function CategoryFilters({ products }: CategoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedBrands = searchParams.getAll("brand");
  const selectedColor = searchParams.getAll("color");
  const selectedDiscount = searchParams.getAll("discount");

  const handleFilterChange = (section: string, item: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const current = params.getAll(section);

    params.delete(section);

    const updated = current.includes(item)
      ? current.filter((value) => value !== item)
      : [...current, item];

    updated.forEach((value) => params.append(section, value));

    // Filter change होने पर first page पर जाएँ
    params.delete("page");

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <SareeFilters
      products={products}
      selectedBrands={selectedBrands}
      selectedColor={selectedColor}
      selectedCategory={[]}
      selectedDiscount={selectedDiscount}
      showCategory={false}
      onFilterChange={handleFilterChange}
    />
  );
}
