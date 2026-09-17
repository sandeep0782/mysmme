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
import { useState } from "react";

interface MobileFiltersProps {
  products: SareeProduct[];

  selectedBrands: string[];
  selectedColor: string[];
  selectedCategory: string[];
  selectedDiscount: string[];

  onFilterChange: (section: string, item: string) => void;
}

const MobileFilters = ({
  products,
  selectedBrands,
  selectedColor,
  selectedCategory,
  selectedDiscount,
  onFilterChange,
}: MobileFiltersProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleMobileFilterChange = (section: string, item: string) => {
    onFilterChange(section, item);
    setOpen(false);
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
            selectedDiscount={selectedDiscount}
            onFilterChange={handleMobileFilterChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilters;
