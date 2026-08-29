"use client";

import Spinner from "@/lib/Spinner";
import Pagination from "@/components/Pagination";
import SareeCard from "./SareeCard";

import { useEffect, useMemo, useState } from "react";

interface SareeProductsProps {
  products: any[];
  isLoading: boolean;
  isError: boolean;
  selectedBrands: string[];
  selectedColor: string[];
  selectedCategory: string[];
  sortOption: string;
}

const SareeProducts = ({
  products = [],
  isLoading,
  isError,
  selectedBrands,
  selectedColor,
  selectedCategory,
  sortOption,
}: SareeProductsProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const sareePerPage = 20;

  const searchTerm =
    new URLSearchParams(window.location.search).get("search") || "";
  // =========================
  // NORMALIZE API VALUE
  // =========================
  const normalize = (value: unknown): string => {
    if (value == null) {
      return "";
    }

    // String / number
    if (typeof value === "string" || typeof value === "number") {
      return String(value).trim().toLowerCase();
    }

    // Object
    if (typeof value === "object") {
      const obj = value as {
        name?: unknown;
        title?: unknown;
        label?: unknown;
        slug?: unknown;
      };

      return String(obj.name ?? obj.title ?? obj.label ?? obj.slug ?? "")
        .trim()
        .toLowerCase();
    }

    return "";
  };

  // =========================
  // NORMALIZED SELECTED FILTERS
  // =========================
  const normalizedBrands = useMemo(
    () => selectedBrands.map(normalize),
    [selectedBrands],
  );

  const normalizedColors = useMemo(
    () => selectedColor.map(normalize),
    [selectedColor],
  );

  const normalizedCategories = useMemo(
    () => selectedCategory.map(normalize),
    [selectedCategory],
  );

  // =========================
  // RESET PAGINATION
  // =========================
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrands, selectedColor, selectedCategory, sortOption]);

  // =========================
  // FILTER + SORT
  // =========================
  const filteredAndSortedSarees = useMemo(() => {
    if (!Array.isArray(products)) {
      return [];
    }

    const filtered = products.filter((saree) => {
      if (!saree) {
        return false;
      }

      // =========================
      // PRODUCT VALUES
      // =========================

      const productBrand = normalize(saree.brand);

      const productColor = normalize(saree.color);

      const productCategory = normalize(saree.category);

      // =========================
      // BRAND MATCH
      // =========================

      const brandMatch =
        normalizedBrands.length === 0 ||
        normalizedBrands.includes(productBrand);

      // =========================
      // COLOR MATCH
      // =========================

      const colorMatch =
        normalizedColors.length === 0 ||
        normalizedColors.includes(productColor);

      // =========================
      // CATEGORY MATCH
      // =========================

      const categoryMatch =
        normalizedCategories.length === 0 ||
        normalizedCategories.includes(productCategory);

      const searchMatch = searchTerm
        ? (saree.title?.toLowerCase() ?? "").includes(
            searchTerm.toLowerCase(),
          ) ||
          (typeof saree.brand === "string"
            ? saree.brand.toLowerCase().includes(searchTerm.toLowerCase())
            : false)
        : true;

      return brandMatch && colorMatch && categoryMatch && searchMatch;
    });

    // =========================
    // SORT
    // =========================

    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "newest": {
          const dateA = new Date(a.createdAt ?? 0).getTime();

          const dateB = new Date(b.createdAt ?? 0).getTime();

          return dateB - dateA;
        }

        case "oldest": {
          const dateA = new Date(a.createdAt ?? 0).getTime();

          const dateB = new Date(b.createdAt ?? 0).getTime();

          return dateA - dateB;
        }

        case "price-low":
          return Number(a.finalPrice ?? 0) - Number(b.finalPrice ?? 0);

        case "price-high":
          return Number(b.finalPrice ?? 0) - Number(a.finalPrice ?? 0);

        default:
          return 0;
      }
    });
  }, [
    products,
    normalizedBrands,
    normalizedColors,
    normalizedCategories,
    sortOption,
  ]);

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(filteredAndSortedSarees.length / sareePerPage);

  const paginatedSarees = filteredAndSortedSarees.slice(
    (currentPage - 1) * sareePerPage,
    currentPage * sareePerPage,
  );

  // =========================
  // PAGE CHANGE
  // =========================

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <div className="py-12 text-center text-red-500">
        Unable to load sarees. Please try again.
      </div>
    );
  }

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return <Spinner />;
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-8">
      {paginatedSarees.length > 0 ? (
        <>
          {/* =========================
              PRODUCT GRID
          ========================= */}

          <div
            className="
              grid
              grid-cols-2
              gap-2
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {paginatedSarees.map((saree) => (
              <SareeCard key={saree._id} saree={saree} />
            ))}
          </div>

          {/* =========================
              PAGINATION
          ========================= */}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          No sarees found.
        </div>
      )}
    </div>
  );
};

export default SareeProducts;
