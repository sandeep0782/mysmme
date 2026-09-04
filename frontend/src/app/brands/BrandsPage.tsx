"use client";

import Image from "next/image";
import Link from "next/link";
import { Crown, Sparkles, ArrowRight } from "lucide-react";

import { useGetAllBrandsQuery } from "@/store/api/brandApi";

export default function BrandsPage() {
  const { data: brands = [], isLoading, isError } = useGetAllBrandsQuery();

  return (
    <main className="min-h-screen bg-[#fcfaf9] text-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-red-100 bg-gradient-to-br from-[#fff8f5] via-white to-[#fdf1ef]">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-rose-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Crown className="h-5 w-5" />
          </div>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">
            Saree Collections
          </p>

          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Discover Beautiful Saree Brands
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base sm:leading-8">
            Explore saree brands featuring traditional craftsmanship, elegant
            designs, festive styles, and beautiful collections for every
            occasion.
          </p>
        </div>
      </section>

      {/* Brands */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-[2rem] border border-gray-100 bg-white p-6"
              >
                <div className="h-48 rounded-2xl bg-gray-100" />
                <div className="mx-auto mt-6 h-5 w-32 rounded bg-gray-100" />
                <div className="mx-auto mt-3 h-4 w-48 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-[2rem] border border-red-100 bg-white px-6 py-16 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-red-400" />

            <h2 className="mt-5 text-2xl font-bold">
              Unable to load saree brands
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Please try again shortly.
            </p>
          </div>
        )}

        {!isLoading && !isError && brands.length === 0 && (
          <div className="rounded-[2rem] border border-gray-100 bg-white px-6 py-16 text-center">
            <h2 className="text-2xl font-bold">Saree brands are coming soon</h2>

            <p className="mt-3 text-sm text-gray-500">
              New saree collections will appear here soon.
            </p>
          </div>
        )}

        {!isLoading && !isError && brands.length > 0 && (
          <>
            <div className="mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">
                Explore
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Shop by Saree Brand
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
                Find your next favourite saree collection from brands available
                on MYSMME.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {brands
                .filter((brand) => brand.isActive)
                .map((brand) => (
                  <Link
                    key={brand._id}
                    href={`/brands/${brand.slug}`}
                    className="group overflow-hidden rounded-[2rem] border border-red-100/70 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-900/10"
                  >
                    {/* Logo */}
                    <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-[#fffaf7] to-[#f9eeee]">
                      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-red-100/70" />

                      <div className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-red-50 blur-3xl" />

                      {brand.logo ? (
                        <div className="relative h-32 w-64">
                          <Image
                            src={brand.logo}
                            alt={`${brand.name} saree brand`}
                            fill
                            sizes="256px"
                            className="object-contain p-4 transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="relative px-6 text-center">
                          <Crown className="mx-auto h-7 w-7 text-amber-500" />

                          <p className="mt-3 text-xl font-bold">{brand.name}</p>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2">
                        {brand.isFeatured && (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700">
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 text-xl font-bold transition-colors group-hover:text-red-600">
                        {brand.name}
                      </h3>

                      {brand.description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                          {brand.description}
                        </p>
                      )}

                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-red-600">
                        Explore collection
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
