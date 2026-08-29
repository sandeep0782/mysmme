"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import SareeFilters from "@/components/sarees/SareeFilters";
import SareeProducts from "@/components/sarees/SareeProducts";
import MobileFilters from "@/components/sarees/MobileFilters";

import { useGetProductsQuery } from "@/store/api/productApi";
import type { SareeProduct } from "@/types/product";

const Page = () => {
  // =========================================================
  // FETCH PRODUCTS FROM API
  // =========================================================
  const { data: productResponse, isLoading, isError } = useGetProductsQuery({});

  // =========================================================
  // SAFELY GET PRODUCTS
  // =========================================================
  const sarees: SareeProduct[] = Array.isArray(productResponse?.data)
    ? (productResponse.data as SareeProduct[])
    : [];

  // =========================================================
  // FILTER STATE
  // =========================================================
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  // =========================================================
  // SORT STATE
  // =========================================================
  const [sortOption, setSortOption] = useState("newest");


  // =========================================================
  // FILTER HANDLER
  // =========================================================
  const toggleFilter = (section: string, item: string) => {
    const updateFilter = (previous: string[]) => {
      if (previous.includes(item)) {
        return previous.filter((value) => value !== item);
      }

      return [...previous, item];
    };

    switch (section) {
      case "brand":
        setSelectedBrands(updateFilter);
        break;

      case "color":
        setSelectedColor(updateFilter);
        break;

      case "category":
        setSelectedCategory(updateFilter);
        break;

      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto px-4 py-4">
        {/* =====================================================
            BREADCRUMB
        ===================================================== */}
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>

          <span>/</span>

          <span>Sarees</span>
        </nav>

        {/* =====================================================
            HEADING + DESKTOP SORT
        ===================================================== */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-base font-semibold leading-tight md:text-xl">
            Discover Timeless Sarees & New Arrivals
          </h1>

          {/* DESKTOP SORT */}
          <div className="hidden md:block">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger
                className="
                  w-[180px]
                  rounded-xs
                  border
                  border-gray-300
                  bg-white
                  shadow-none
                  focus:ring-0
                  focus:ring-offset-0
                  focus-visible:ring-0
                  focus-visible:ring-offset-0
                "
              >
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>

              <SelectContent className="rounded-xs border border-gray-200 bg-white">
                <SelectItem value="newest">Newest First</SelectItem>

                <SelectItem value="oldest">Oldest First</SelectItem>

                <SelectItem value="price-low">Price: Low to High</SelectItem>

                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* =====================================================
            MOBILE FILTER + SORT
        ===================================================== */}
        <div
          className="
            sticky
            top-[64px]
            z-40
            -mx-4
            mb-4
            border-b
            border-gray-200
            bg-white
            px-4
            py-3
            md:hidden
          "
        >
          <div className="flex items-center gap-3">
            {/* MOBILE FILTERS */}
            <div className="flex-1">
              <MobileFilters
                products={sarees}
                selectedBrands={selectedBrands}
                selectedColor={selectedColor}
                selectedCategory={selectedCategory}
                onFilterChange={toggleFilter}
              />
            </div>

            {/* MOBILE SORT */}
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger
                className="
                  h-10
                  w-[140px]
                  rounded-xs
                  border-gray-300
                  bg-white
                  shadow-none
                  focus:ring-0
                  focus-visible:ring-0
                "
              >
                <SelectValue placeholder="Sort" />
              </SelectTrigger>

              <SelectContent className="rounded-xs border border-gray-200 bg-white">
                <SelectItem value="newest">Newest First</SelectItem>

                <SelectItem value="oldest">Oldest First</SelectItem>

                <SelectItem value="price-low">Price: Low to High</SelectItem>

                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}
        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          {/* ===================================================
              DESKTOP FILTERS
          =================================================== */}
          <aside
            className="
              hidden
              md:sticky
              md:top-4
              md:block
              md:self-start
            "
          >
            <SareeFilters
              products={sarees}
              selectedBrands={selectedBrands}
              selectedColor={selectedColor}
              selectedCategory={selectedCategory}
              onFilterChange={toggleFilter}
            />
          </aside>

          {/* ===================================================
              PRODUCTS
          =================================================== */}
          <main className="min-w-0">
            <SareeProducts
              products={sarees}
              isLoading={isLoading}
              isError={isError}
              selectedBrands={selectedBrands}
              selectedColor={selectedColor}
              selectedCategory={selectedCategory}
              sortOption={sortOption}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Page;
