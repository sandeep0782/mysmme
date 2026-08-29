"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import SareeFilters from "./SareeFilters";

import { SlidersHorizontal } from "lucide-react";

import type { SareeProduct } from "@/types/product";

interface MobileFiltersProps {
  products: SareeProduct[];

  selectedBrands: string[];
  selectedColor: string[];
  selectedCategory: string[];

  onFilterChange: (section: string, item: string) => void;
}

const MobileFilters = ({
  products,
  selectedBrands,
  selectedColor,
  selectedCategory,
  onFilterChange,
}: MobileFiltersProps) => {
  return (
    <Sheet>
      {/* =====================================================
          FILTER BUTTON
      ===================================================== */}
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="
            w-full
            rounded-xs
            border-gray-300
            bg-white
          "
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>

      {/* =====================================================
          FILTER SHEET
      ===================================================== */}
      <SheetContent
        side="left"
        className="
          w-[85%]
          overflow-y-auto
          bg-white
          sm:max-w-sm
        "
      >
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        {/* ===================================================
            FILTER CONTENT
        =================================================== */}
        <div className="mt-6">
          <SareeFilters
            products={products}
            selectedBrands={selectedBrands}
            selectedColor={selectedColor}
            selectedCategory={selectedCategory}
            onFilterChange={onFilterChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilters;
