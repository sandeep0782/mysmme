"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2, Crown, Sparkles } from "lucide-react";
import type { Brand } from "@/types/product";
import { useGetAllBrandsQuery } from "@/store/api/brandApi";
import Link from "next/link";

const Brands = () => {
  const { data: brands = [], isLoading, isError } = useGetAllBrandsQuery();

  // Only active brands selected for homepage highlighting
  const featuredBrands = brands.filter(
    (brand) => brand.isActive && brand.isFeatured,
  );

  return (
    <section className="relative overflow-hidden bg-[#fcfaf9] py-20 sm:py-24">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute left-0 top-20 h-96 w-96 rounded-full bg-red-100/40 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 rounded-full bg-rose-100/40 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-50/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* =========================================================
            HEADER
        ========================================================= */}

        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-red-500" />

            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />

              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-red-500">
                Featured Brands
              </span>
            </div>

            <span className="h-px w-10 bg-red-500" />
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
            Brands worth
            <span className="text-red-500"> knowing.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Discover our handpicked featured brands, bringing exceptional
            craftsmanship, distinctive designs and timeless sarees to you.
          </p>
        </div>

        {/* =========================================================
            LOADING
        ========================================================= */}

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm"
              >
                <div className="h-[320px] animate-pulse bg-gray-100 sm:h-[360px]" />

                <div className="space-y-4 p-6">
                  <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />

                  <div className="h-10 w-32 animate-pulse rounded-full bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =========================================================
            ERROR
        ========================================================= */}

        {isError && (
          <div className="rounded-[2rem] border border-red-100 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <Sparkles className="h-6 w-6 text-red-500" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              Featured brands unavailable
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Please try again shortly.
            </p>
          </div>
        )}

        {/* =========================================================
            EMPTY
        ========================================================= */}

        {!isLoading && !isError && featuredBrands.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white/70 px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
              <Crown className="h-6 w-6 text-gray-400" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              Featured brands coming soon
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Stay tuned for something special.
            </p>
          </div>
        )}

        {/* =========================================================
            FEATURED BRANDS
        ========================================================= */}

        {!isLoading && !isError && featuredBrands.length > 0 && (
          <div className="relative">
            {/* More than 2 → horizontal scroll */}
            <div
              className={`
                grid gap-6
                ${
                  featuredBrands.length <= 2
                    ? "md:grid-cols-2"
                    : "auto-cols-[85%] grid-flow-col grid-cols-none overflow-x-auto pb-6 sm:auto-cols-[60%] lg:auto-cols-[42%]"
                }
              `}
            >
              {featuredBrands.map((brand) => (
                <article
                  key={brand._id}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[2rem]
                    border
                    border-red-100/80
                    bg-white
                    shadow-[0_12px_45px_rgba(80,20,20,0.07)]
                    transition-all
                    duration-500
                    hover:-translate-y-1.5
                    hover:shadow-[0_25px_70px_rgba(80,20,20,0.14)]
                  "
                >
                  {/* =================================================
                      PREMIUM FEATURED BADGE
                  ================================================= */}

                  <div className="absolute left-5 top-5 z-20">
                    <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-600 shadow-lg backdrop-blur-md">
                      <Crown className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                      Featured
                    </div>
                  </div>

                  {/* =================================================
                      LOGO
                  ================================================= */}

                  <div className="relative flex h-[300px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#fffaf7] via-white to-[#f9eeee] sm:h-[340px]">
                    {/* Decorative circles */}

                    <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-red-100/70" />

                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border border-red-100/50" />

                    <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-red-50/70 blur-3xl" />

                    {/* Inner logo frame */}

                    <div className="relative z-10 flex h-48 w-[75%] max-w-[340px] items-center justify-center rounded-2xl border border-white/80 bg-white/70 px-8 shadow-[0_15px_45px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-transform duration-700 group-hover:scale-[1.03]">
                      <Image
                        src={brand.logo || "/images/placeholder-brand.jpg"}
                        alt={`${brand.name} logo`}
                        fill
                        sizes="(max-width: 768px) 80vw, 40vw"
                        className="object-contain p-8"
                      />
                    </div>

                    {/* Bottom fade */}

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/40 to-transparent" />
                  </div>

                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div className="p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-5">
                      <div className="min-w-0">
                        {/* Brand name */}

                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-2xl font-bold tracking-tight text-gray-950">
                            {brand.name}
                          </h3>

                          <CheckCircle2 className="h-5 w-5 shrink-0 fill-green-50 text-green-600" />
                        </div>

                        {/* Description */}

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                          {brand.description ||
                            "Discover beautiful sarees and timeless craftsmanship from this featured brand."}
                        </p>
                      </div>

                      {/* Arrow */}

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-700 transition-all duration-300 group-hover:border-red-500 group-hover:bg-red-500 group-hover:text-white cursor-pointer">
                        <Link
                          href={`/brands/${brand.slug}`}
                          aria-label={`View ${brand.name} details`}
                          className="
    flex h-11 w-11 shrink-0
    items-center justify-center
    rounded-full
    border border-gray-200
    bg-gray-50
    text-gray-700
    transition-all duration-300
    hover:border-red-500
    hover:bg-red-500
    hover:text-white
    group-hover:border-red-500
    group-hover:bg-red-500
    group-hover:text-white
  "
                        >
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>{" "}
                      </div>
                    </div>

                    {/* Bottom */}

                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50">
                          <Sparkles className="h-3.5 w-3.5 text-red-500" />
                        </span>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Spotlight
                          </p>

                          <p className="text-xs font-semibold text-gray-700">
                            Featured brand
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/sarees?brand=${encodeURIComponent(brand.slug)}`}
                        className="
    group/button
    inline-flex
    items-center
    gap-1.5
    text-xs
    font-bold
    text-gray-900
    transition-colors
    hover:text-red-500
  "
                      >
                        View collection
                        <ArrowRight
                          className="
      h-3.5
      w-3.5
      transition-transform
      duration-300
      group-hover/button:translate-x-1
    "
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* =====================================================
                SCROLL HINT WHEN MORE THAN 2
            ===================================================== */}

            {featuredBrands.length > 2 && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
                <span className="h-px w-8 bg-gray-200" />
                Swipe to explore
                <span className="h-px w-8 bg-gray-200" />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Brands;
