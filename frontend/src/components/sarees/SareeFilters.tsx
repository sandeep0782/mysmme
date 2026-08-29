"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { SareeProduct } from "@/types/product";

interface SareeFiltersProps {
  products: SareeProduct[];

  selectedBrands: string[];
  selectedColor: string[];
  selectedCategory: string[];

  onFilterChange: (section: string, item: string) => void;
}

interface FilterOption {
  value: string;
  count: number;
}

type FilterSectionKey = "brand" | "color" | "category";

const SareeFilters = ({
  products = [],
  selectedBrands,
  selectedColor,
  selectedCategory,
  onFilterChange,
}: SareeFiltersProps) => {
  const [activeSearch, setActiveSearch] = useState<FilterSectionKey | null>(
    null,
  );

  const [searchValues, setSearchValues] = useState<
    Record<FilterSectionKey, string>
  >({
    brand: "",
    color: "",
    category: "",
  });

  const [showAllColors, setShowAllColors] = useState(false);

  // =========================
  // DISPLAY VALUE
  // =========================
  const getDisplayValue = (value: unknown): string => {
    if (value == null) {
      return "";
    }

    if (typeof value === "string" || typeof value === "number") {
      return String(value).trim();
    }

    if (typeof value === "object") {
      const obj = value as {
        name?: unknown;
        title?: unknown;
        label?: unknown;
        slug?: unknown;
        hex?: unknown;
        color?: unknown;
      };

      /*
       * IMPORTANT:
       * Prefer the actual human-readable color name.
       *
       * Example:
       * {
       *   name: "Pink",
       *   hex: "#FFC0CB"
       * }
       *
       * We display "Pink", NOT "#FFC0CB".
       */
      return String(
        obj.name ?? obj.title ?? obj.label ?? obj.color ?? obj.slug ?? "",
      ).trim();
    }

    return "";
  };

  // =========================
  // NORMALIZE
  // =========================
  const normalize = (value: string): string => {
    return value.trim().toLowerCase();
  };

  // =========================
  // COLOR SWATCH
  // =========================
  const getColorValue = (colorName: string): string => {
    const color = normalize(colorName);

    const colors: Record<string, string> = {
      pink: "#ec4899",
      purple: "#a855f7",
      green: "#22c55e",
      blue: "#3b82f6",
      red: "#ef4444",
      black: "#000000",
      white: "#ffffff",
      yellow: "#eab308",
      orange: "#f97316",
      brown: "#92400e",
      grey: "#6b7280",
      gray: "#6b7280",
      maroon: "#800000",
      navy: "#000080",
      beige: "#f5f5dc",
      cream: "#fffdd0",
      gold: "#d4af37",
      silver: "#c0c0c0",
      teal: "#14b8a6",
      cyan: "#06b6d4",
      magenta: "#d946ef",
      violet: "#8b5cf6",
    };

    return colors[color] ?? "#d1d5db";
  };

  // =========================
  // BUILD FILTERS
  // =========================
  const filters = useMemo(() => {
    const brandMap = new Map<string, FilterOption>();
    const colorMap = new Map<string, FilterOption>();
    const categoryMap = new Map<string, FilterOption>();

    if (!Array.isArray(products)) {
      return {
        brand: [],
        color: [],
        category: [],
      };
    }

    products.forEach((product) => {
      // =========================
      // BRAND
      // =========================
      const brand = getDisplayValue(product.brand);

      if (brand) {
        const key = normalize(brand);
        const existing = brandMap.get(key);

        if (existing) {
          existing.count += 1;
        } else {
          brandMap.set(key, {
            value: brand,
            count: 1,
          });
        }
      }

      // =========================
      // COLOR
      // =========================
      const color = getDisplayValue(product.color);

      if (color) {
        const key = normalize(color);
        const existing = colorMap.get(key);

        if (existing) {
          existing.count += 1;
        } else {
          colorMap.set(key, {
            value: color,
            count: 1,
          });
        }
      }

      // =========================
      // CATEGORY
      // =========================
      const category = getDisplayValue(product.category);

      if (category) {
        const key = normalize(category);
        const existing = categoryMap.get(key);

        if (existing) {
          existing.count += 1;
        } else {
          categoryMap.set(key, {
            value: category,
            count: 1,
          });
        }
      }
    });

    return {
      brand: Array.from(brandMap.values()).sort((a, b) =>
        a.value.localeCompare(b.value),
      ),

      color: Array.from(colorMap.values()).sort((a, b) =>
        a.value.localeCompare(b.value),
      ),

      category: Array.from(categoryMap.values()).sort((a, b) =>
        a.value.localeCompare(b.value),
      ),
    };
  }, [products]);

  // =========================
  // CHECKED STATE
  // =========================
  const isChecked = (section: FilterSectionKey, value: string) => {
    const normalizedValue = normalize(value);

    switch (section) {
      case "brand":
        return selectedBrands.some(
          (item) => normalize(item) === normalizedValue,
        );

      case "color":
        return selectedColor.some(
          (item) => normalize(item) === normalizedValue,
        );

      case "category":
        return selectedCategory.some(
          (item) => normalize(item) === normalizedValue,
        );

      default:
        return false;
    }
  };

  // =========================
  // TOGGLE SEARCH
  // =========================
  const toggleSearch = (section: FilterSectionKey) => {
    if (activeSearch === section) {
      setActiveSearch(null);

      setSearchValues((prev) => ({
        ...prev,
        [section]: "",
      }));

      return;
    }

    setActiveSearch(section);
  };

  // =========================
  // SEARCH
  // =========================
  const handleSearchChange = (section: FilterSectionKey, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  // =========================
  // SEARCH RESULTS
  // =========================
  const getSearchResults = (
    section: FilterSectionKey,
    values: FilterOption[],
  ) => {
    const search = normalize(searchValues[section]);

    if (!search) {
      return values;
    }

    return values.filter((option) => normalize(option.value).includes(search));
  };

  // =========================
  // FILTER SECTION
  // =========================
  const FilterSection = ({
    title,
    section,
    values,
    colorLimit,
  }: {
    title: string;
    section: FilterSectionKey;
    values: FilterOption[];
    colorLimit?: number;
  }) => {
    const searchResults = getSearchResults(section, values);

    const limit = colorLimit ?? 7;

    const shouldLimitColors =
      section === "color" && !showAllColors && !searchValues.color.trim();

    const visibleValues = shouldLimitColors
      ? searchResults.slice(0, limit)
      : searchResults;

    const remainingCount = shouldLimitColors
      ? Math.max(searchResults.length - limit, 0)
      : 0;

    return (
      <div className="border-b border-gray-200 py-5 last:border-b-0">
        {/* =========================
            HEADER
        ========================= */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-black">{title}</h3>

          <button
            type="button"
            onClick={() => toggleSearch(section)}
            aria-label={`Search ${title.toLowerCase()}`}
            className="
              rounded-full
              p-1
              text-gray-500
              transition-colors
              hover:bg-gray-100
              hover:text-black
            "
          >
            {activeSearch === section ? (
              <X className="size-4" />
            ) : (
              <Search className="size-4" />
            )}
          </button>
        </div>

        {/* =========================
            SEARCH INPUT
        ========================= */}
        {activeSearch === section && (
          <div className="relative mt-3">
            <Search
              className="
                absolute
                left-3
                top-1/2
                size-4
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={searchValues[section]}
              onChange={(e) => handleSearchChange(section, e.target.value)}
              autoFocus
              placeholder={`Search ${title.toLowerCase()}...`}
              className="
                h-9
                w-full
                rounded-xs
                border
                border-gray-300
                bg-white
                pl-9
                pr-3
                text-sm
                outline-none
                placeholder:text-gray-400
                focus:border-red-500
                focus:ring-1
                focus:ring-red-500
              "
            />
          </div>
        )}

        {/* =========================
            OPTIONS
        ========================= */}
        <div className="mt-4 space-y-3">
          {visibleValues.length === 0 ? (
            <p className="text-sm text-gray-400">
              No {title.toLowerCase()} found
            </p>
          ) : (
            visibleValues.map((option) => (
              <div
                key={`${section}-${option.value}`}
                className="flex items-center gap-3"
              >
                <Checkbox
                  id={`${section}-${option.value}`}
                  checked={isChecked(section, option.value)}
                  onCheckedChange={() => onFilterChange(section, option.value)}
                  className="
                    h-4
                    w-4
                    shrink-0
                    rounded-xs
                    border-gray-400
                    data-[state=checked]:border-red-500
                    data-[state=checked]:bg-red-500
                    data-[state=checked]:text-white
                  "
                />

                {/* =========================
                    COLOR SWATCH
                ========================= */}
                {section === "color" && (
                  <span
                    className="
                      h-4
                      w-4
                      shrink-0
                      rounded-full
                      border
                      border-gray-300
                    "
                    style={{
                      backgroundColor: getColorValue(option.value),
                    }}
                    aria-hidden="true"
                  />
                )}

                {/* =========================
                    NAME + COUNT
                ========================= */}
                <label
                  htmlFor={`${section}-${option.value}`}
                  className="
                    flex
                    min-w-0
                    flex-1
                    cursor-pointer
                    items-center
                    justify-between
                    gap-2
                    text-sm
                    font-medium
                    leading-none
                    text-gray-700
                    hover:text-black
                  "
                >
                  <span className="truncate">{option.value}</span>

                  <span className="shrink-0 text-gray-400">
                    ({option.count})
                  </span>
                </label>
              </div>
            ))
          )}
        </div>

        {/* =========================
            MORE COLORS
        ========================= */}
        {section === "color" &&
          !searchValues.color.trim() &&
          !showAllColors &&
          remainingCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAllColors(true)}
              className="
                mt-4
                text-sm
                font-semibold
                text-red-500
                transition-colors
                hover:text-red-600
                hover:underline
              "
            >
              + {remainingCount} more
            </button>
          )}

        {/* =========================
            SHOW LESS
        ========================= */}
        {section === "color" &&
          !searchValues.color.trim() &&
          showAllColors &&
          values.length > limit && (
            <button
              type="button"
              onClick={() => setShowAllColors(false)}
              className="
                mt-4
                text-sm
                font-semibold
                text-red-500
                hover:text-red-600
                hover:underline
              "
            >
              Show less
            </button>
          )}
      </div>
    );
  };

  // =========================
  // UI
  // =========================
  return (
    <div
      className="
        w-full
        rounded-xs
        border
        border-gray-200
        bg-white
        px-6
      "
    >
      <FilterSection title="BRAND" section="brand" values={filters.brand} />

      <FilterSection
        title="COLOR"
        section="color"
        values={filters.color}
        colorLimit={7}
      />

      <FilterSection
        title="CATEGORY"
        section="category"
        values={filters.category}
      />
    </div>
  );
};

export default SareeFilters;
