"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Crown, Sparkles } from "lucide-react";

import { useGetAllBrandsQuery } from "@/store/api/brandApi";

const BrandDetailsPage = () => {
  const params = useParams();

  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const { data: brands = [], isLoading, isError } = useGetAllBrandsQuery();

  // Find brand using URL slug
  const brand = brands.find((item) => item.slug === slug);

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#fcfaf9]">
        <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-red-100/50 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-rose-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 py-5 sm:px-6 lg:px-8">
          <div className="mb-6 h-10 w-32 animate-pulse rounded-full bg-gray-200" />

          <section className="overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-sm">
            <div className="px-6 py-14 text-center sm:px-10 sm:py-16 lg:px-20 lg:py-20">
              <div className="mx-auto h-10 w-40 animate-pulse rounded-full bg-gray-100" />

              <div className="mx-auto mt-7 h-16 max-w-xl animate-pulse rounded-xl bg-gray-100" />

              <div className="mx-auto mt-6 h-12 max-w-2xl animate-pulse rounded-xl bg-gray-50" />

              <div className="mx-auto mt-9 h-48 max-w-xl animate-pulse rounded-[2rem] bg-gray-100" />

              <div className="mx-auto mt-8 h-5 w-48 animate-pulse rounded bg-gray-100" />
            </div>
          </section>
        </div>
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (isError) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fcfaf9] px-5">
        <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-red-100/50 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-rose-100/50 blur-3xl" />

        <div className="relative w-full max-w-xl rounded-[2.5rem] border border-red-100 bg-white px-6 py-14 text-center shadow-[0_30px_100px_rgba(80,20,20,0.08)] sm:px-10 sm:py-20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Sparkles className="h-7 w-7 text-red-500" />
          </div>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">
            Something went wrong
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            We couldn't load this brand.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500">
            Please try again shortly.
          </p>

          <Link
            href="/"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  // =========================================================
  // BRAND NOT FOUND
  // =========================================================

  if (!brand) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fcfaf9] px-5">
        <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-red-100/50 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-rose-100/50 blur-3xl" />

        <div className="relative w-full max-w-xl rounded-[2.5rem] border border-red-100 bg-white px-6 py-14 text-center shadow-[0_30px_100px_rgba(80,20,20,0.08)] sm:px-10 sm:py-20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Crown className="h-7 w-7 text-red-500" />
          </div>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">
            Brand not found
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            This brand doesn't exist.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500">
            We couldn't find a brand matching this link. It may have been
            removed or the URL may be incorrect.
          </p>

          <Link
            href="/"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fcfaf9]">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-red-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-rose-100/50 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-amber-50/60 blur-3xl" />

      {/* Decorative rings */}

      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full border border-red-100/70" />

      <div className="pointer-events-none absolute -right-20 top-32 h-72 w-72 rounded-full border border-red-100/50" />

      <div className="pointer-events-none absolute -left-40 bottom-20 h-80 w-80 rounded-full border border-amber-100/60" />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative mx-auto max-w-6xl px-5 py-5 sm:px-6 lg:px-8">
        {/* =====================================================
            BACK
        ===================================================== */}

        <Link
          href="/"
          className="group mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-red-200 hover:bg-white hover:text-red-600"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to home
        </Link>

        {/* =====================================================
            MAIN CARD
        ===================================================== */}

        <section className="relative overflow-hidden rounded-[2.5rem] border border-red-100/70 bg-white/80 px-6 py-12 text-center shadow-[0_30px_100px_rgba(80,20,20,0.08)] backdrop-blur-xl sm:px-10 sm:py-16 lg:px-20 lg:py-20">
          {/* Inner glow */}

          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-red-50/70 blur-3xl" />

          {/* =================================================
              TOP DECORATION
          ================================================= */}

          <div className="relative mb-7 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-red-300" />

            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-red-50">
              <Crown className="h-4 w-4 fill-amber-400 text-amber-500" />
            </span>

            <span className="h-px w-12 bg-gradient-to-l from-transparent to-red-300" />
          </div>

          {/* =================================================
              COMING SOON
          ================================================= */}

          <div className="relative inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50/70 px-4 py-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />

            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600">
              Coming Soon
            </span>

            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          </div>

          {/* =================================================
              HEADING
          ================================================= */}

          <h1 className="relative mx-auto mt-7 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
            A beautiful story
            <br />
            <span className="text-red-600">is being woven.</span>
          </h1>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p className="relative mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
            We're carefully crafting the brand experience for you. Soon, you'll
            be able to discover the story, craftsmanship and beautiful
            collection behind this brand.
          </p>

          {/* =================================================
              BRAND PREVIEW
          ================================================= */}

          <div className="relative mx-auto mt-9 max-w-xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-red-100 bg-gradient-to-br from-[#fffaf7] via-white to-[#f9eeee] px-6 py-8 shadow-[0_15px_50px_rgba(80,20,20,0.06)]">
              {/* Decorative circles */}

              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border border-red-100/70" />

              <div className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-red-50/60 blur-3xl" />

              {/* Logo */}

              <div className="relative mx-auto flex h-28 max-w-xs items-center justify-center">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    fill
                    sizes="320px"
                    className="object-contain p-4"
                  />
                ) : (
                  <span className="text-2xl font-bold tracking-tight text-gray-950">
                    {brand.name}
                  </span>
                )}
              </div>

              <p className="relative mt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
                Brand Experience
              </p>

              <h2 className="relative mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                {brand.name}
              </h2>

              <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-red-400 to-transparent" />

              <p className="relative mt-4 text-xs leading-6 text-gray-500">
                Something special is on its way.
              </p>
            </div>
          </div>

          {/* =================================================
              BRAND DESCRIPTION
          ================================================= */}

          {brand.description && (
            <p className="relative mx-auto mt-7 max-w-xl text-sm leading-7 text-gray-500">
              {brand.description}
            </p>
          )}

          {/* =================================================
              STATUS
          ================================================= */}

          <div className="relative mx-auto mt-8 flex max-w-md items-center justify-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-50" />

              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>

            <p className="text-xs font-medium text-gray-500">
              We're working behind the scenes
            </p>
          </div>

          {/* =================================================
              CTA
          ================================================= */}

          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl"
            >
              Explore homepage
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/sarees"
              className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-red-200 hover:text-red-600"
            >
              Browse sarees
            </Link>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="relative mt-10 border-t border-gray-100 pt-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
              Timeless craftsmanship · Modern elegance · Coming soon
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default BrandDetailsPage;
