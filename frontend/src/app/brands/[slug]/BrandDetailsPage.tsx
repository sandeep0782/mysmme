"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Crown,
  Heart,
  Search,
  Sparkles,
  Star,
  ShoppingBag,
  Store,
} from "lucide-react";

import { useGetAllBrandsQuery } from "@/store/api/brandApi";

const BrandDetailsPage = () => {
  const params = useParams();

  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const { data: brands = [], isLoading, isError } = useGetAllBrandsQuery();

  const brand = brands.find((item) => item.slug === slug);

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return <BrandLoading />;
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (isError) {
    return (
      <main className="min-h-screen bg-[#fcfaf9] px-5 py-20">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-red-100 bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Sparkles className="h-7 w-7 text-red-500" />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-red-500">
            Something went wrong
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-950">
            Unable to load this brand
          </h1>

          <p className="mt-4 text-sm leading-7 text-gray-500">
            Please try again shortly.
          </p>

          <Link
            href="/brands"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-red-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse brands
          </Link>
        </div>
      </main>
    );
  }

  // =========================================================
  // BRAND NOT FOUND
  // =========================================================

  if (!brand) {
    return <BrandNotFound />;
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <main className="min-h-screen overflow-hidden bg-[#fcfaf9] text-[#241b18]">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-[#eadfd6] bg-gradient-to-br from-[#fffaf7] via-[#fdf4ef] to-[#f7e8e4]">
        {/* Background decorations */}

        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-red-200/30 blur-[110px]" />

        <div className="pointer-events-none absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-amber-200/20 blur-[120px]" />

        <div className="pointer-events-none absolute right-10 top-20 hidden h-80 w-80 rounded-full border border-red-200/40 lg:block" />

        <div className="pointer-events-none absolute right-20 top-32 hidden h-60 w-60 rounded-full border border-red-200/30 lg:block" />

        <div className="relative mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}

          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Link href="/" className="transition hover:text-red-600">
              Home
            </Link>

            <span>/</span>

            <Link href="/brands" className="transition hover:text-red-600">
              Brands
            </Link>

            <span>/</span>

            <span className="font-semibold text-gray-800">{brand.name}</span>
          </nav>

          {/* Hero content */}

          <div className="grid items-center gap-12 py-14 lg:grid-cols-[1fr_.85fr] lg:py-20">
            {/* Left */}

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
                <Crown className="h-4 w-4 text-amber-500" />

                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-600">
                  Saree Collection
                </span>
              </div>

              <h1 className="mt-7 max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
                {brand.name}

                <span className="mt-2 block bg-gradient-to-r from-red-600 via-red-500 to-amber-500 bg-clip-text text-transparent">
                  Sarees
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
                Discover the {brand.name} collection on MYSMME. Explore
                beautiful Indian sarees created for celebrations, special
                occasions and timeless everyday elegance.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sarees"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700"
                >
                  Explore Sarees
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/brands"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3.5 text-sm font-bold text-gray-700 transition hover:border-red-200 hover:text-red-600"
                >
                  All Brands
                </Link>
              </div>

              {/* Trust points */}

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                <TrustItem text="Curated sarees" />

                <TrustItem text="Indian fashion" />

                <TrustItem text="Shop online" />
              </div>
            </div>

            {/* Right brand card */}

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-5 rounded-[3rem] bg-red-100/40 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/85 p-5 shadow-[0_30px_100px_rgba(80,20,20,0.12)] backdrop-blur-xl">
                {/* Decorative top */}

                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-400">
                      Featured Brand
                    </span>
                  </div>

                  <Heart className="h-4 w-4 text-gray-300" />
                </div>

                {/* Logo */}

                <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fffaf7] via-white to-[#f9eeee]">
                  <div className="relative mx-auto h-64 w-full">
                    {brand.logo ? (
                      <Image
                        src={brand.logo}
                        alt={`${brand.name} sarees`}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        className="object-contain p-10"
                        priority
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-8 text-center">
                        <span className="text-4xl font-extrabold tracking-tight text-gray-950">
                          {brand.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-2 pb-2 pt-6 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-red-500">
                    Discover the collection
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold text-gray-950">
                    {brand.name}
                  </h2>

                  <div className="mx-auto mt-4 flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <Star
                        key={item}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge */}

              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <ShoppingBag className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">
                      Collection
                    </p>

                    <p className="text-sm font-extrabold text-gray-950">
                      Shop Sarees
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BRAND STORY
      ===================================================== */}

      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
          {/* Label */}

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600">
              About the brand
            </p>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-gray-950 sm:text-4xl">
              Discover {brand.name}
            </h2>

            <div className="mt-5 h-1 w-14 rounded-full bg-red-500" />
          </div>

          {/* Description */}

          <div>
            <p className="text-base leading-8 text-gray-600 sm:text-lg">
              {brand.description ||
                `Explore the ${brand.name} collection on MYSMME and discover beautiful sarees designed for modern Indian fashion.`}
            </p>

            <p className="mt-5 text-sm leading-7 text-gray-500">
              Browse the latest sarees from {brand.name} and discover styles
              that bring together traditional Indian elegance and contemporary
              fashion.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          COLLECTION PLACEHOLDER
      ===================================================== */}

      <section className="border-y border-[#eadfd6] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600">
                Shop the brand
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                {brand.name} Collection
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
                Explore sarees and discover your next favourite style.
              </p>
            </div>

            <Link
              href="/sarees"
              className="group inline-flex items-center gap-2 text-sm font-bold text-red-600"
            >
              View all sarees
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Empty collection card */}

          <div className="mt-12 overflow-hidden rounded-[2rem] border border-gray-100 bg-[#fcfaf9]">
            <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-red-500 shadow-sm">
                <ShoppingBag className="h-7 w-7" />
              </div>

              <h3 className="mt-6 text-2xl font-extrabold text-gray-950">
                More from {brand.name} is coming soon
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
                We're adding beautiful sarees from this brand to the
                marketplace. In the meantime, explore our complete saree
                collection.
              </p>

              <Link
                href="/sarees"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Browse Sarees
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY SHOP
      ===================================================== */}

      <section className="bg-[#fcfaf9]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600">
              The MYSMME experience
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-gray-950 sm:text-4xl">
              Saree shopping made beautiful
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
              Discover collections from different brands and find sarees for
              every occasion.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<ShoppingBag className="h-5 w-5" />}
              title="Curated Styles"
              text="Discover beautiful sarees across different styles and collections."
            />

            <FeatureCard
              icon={<Crown className="h-5 w-5" />}
              title="Beautiful Brands"
              text="Explore collections from saree brands available on MYSMME."
            />

            <FeatureCard
              icon={<Search className="h-5 w-5" />}
              title="Easy Discovery"
              text="Find sarees by style, category, brand and occasion."
            />

            <FeatureCard
              icon={<Store className="h-5 w-5" />}
              title="One Marketplace"
              text="Discover sarees from different sellers in one place."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#241b18]">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-600/20 blur-[100px]" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-xl shadow-red-600/20">
            <Sparkles className="h-6 w-6" />
          </div>

          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Find your perfect
            <span className="block text-[#e0b96b]">saree today.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            Explore beautiful sarees from brands and sellers across MYSMME.
          </p>

          <Link
            href="/sarees"
            className="group mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-red-500"
          >
            Explore Sarees
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
};

// =========================================================
// FEATURE CARD
// =========================================================

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-[#eadfd6] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#6d4535]/10">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-sm font-extrabold text-gray-950">{title}</h3>

      <p className="mt-2 text-xs leading-6 text-gray-500">{text}</p>
    </div>
  );
}

// =========================================================
// TRUST ITEM
// =========================================================

function TrustItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
      <CheckCircle2 className="h-4 w-4 text-red-500" />
      {text}
    </div>
  );
}

// =========================================================
// LOADING
// =========================================================

function BrandLoading() {
  return (
    <main className="min-h-screen bg-[#fcfaf9] px-5 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-5 w-52 animate-pulse rounded bg-gray-200" />

        <section className="mt-8 overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-sm">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="h-8 w-36 animate-pulse rounded-full bg-gray-100" />

              <div className="mt-8 h-28 max-w-xl animate-pulse rounded-2xl bg-gray-100" />

              <div className="mt-6 h-20 max-w-xl animate-pulse rounded-xl bg-gray-50" />

              <div className="mt-8 h-12 w-40 animate-pulse rounded-full bg-gray-100" />
            </div>

            <div className="mx-auto h-96 w-full max-w-lg animate-pulse rounded-[2.5rem] bg-gray-100" />
          </div>
        </section>
      </div>
    </main>
  );
}

// =========================================================
// NOT FOUND
// =========================================================

function BrandNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fcfaf9] px-5 py-20">
      <div className="w-full max-w-xl rounded-[2rem] border border-gray-100 bg-white p-10 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <Crown className="h-7 w-7 text-red-500" />
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-red-500">
          Brand not found
        </p>

        <h1 className="mt-3 text-3xl font-bold text-gray-950">
          We couldn't find this brand
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500">
          The brand may have been removed or the link may be incorrect.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/brands"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-red-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Brands
          </Link>

          <Link
            href="/sarees"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:text-red-600"
          >
            Browse Sarees
          </Link>
        </div>
      </div>
    </main>
  );
}

export default BrandDetailsPage;
