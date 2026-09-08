"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Crown,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import { useGetAllBrandsQuery } from "@/store/api/brandApi";

const AUTO_ROTATE_MS = 4000;

const Brands = () => {
  const { data: brands = [], isLoading, isError } = useGetAllBrandsQuery();

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const isPausedRef = useRef(false);
  const touchResumeTimerRef = useRef<number | null>(null);

  /* ============================================================
     FEATURED BRANDS

     Show every active + featured brand in the carousel.
  ============================================================ */

  const featuredBrands = brands.filter(
    (brand) => brand.isActive && brand.isFeatured,
  );

  /* ============================================================
     GET CARD SCROLL DISTANCE
  ============================================================ */

  const getScrollInfo = useCallback(() => {
    const container = sliderRef.current;

    if (!container) return null;

    const firstCard = container.querySelector<HTMLElement>("[data-brand-card]");

    if (!firstCard) return null;

    const styles = window.getComputedStyle(container);

    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 24;

    const distance = firstCard.offsetWidth + gap;

    const maxScroll = Math.max(
      0,
      container.scrollWidth - container.clientWidth,
    );

    return {
      container,
      distance,
      maxScroll,
    };
  }, []);

  /* ============================================================
     SCROLL BRANDS

     RIGHT:
     Move one card.
     At the end, return to the beginning.

     LEFT:
     Move one card backwards.
     At the beginning, move to the end.
  ============================================================ */

  const scrollBrands = useCallback(
    (direction: "left" | "right") => {
      const info = getScrollInfo();

      if (!info) return;

      const { container, distance, maxScroll } = info;

      if (maxScroll <= 0) return;

      const tolerance = 10;

      if (direction === "right") {
        const reachedEnd = container.scrollLeft >= maxScroll - tolerance;

        if (reachedEnd) {
          container.scrollTo({
            left: 0,
            behavior: "smooth",
          });

          return;
        }

        container.scrollBy({
          left: distance,
          behavior: "smooth",
        });

        return;
      }

      const reachedStart = container.scrollLeft <= tolerance;

      if (reachedStart) {
        container.scrollTo({
          left: maxScroll,
          behavior: "smooth",
        });

        return;
      }

      container.scrollBy({
        left: -distance,
        behavior: "smooth",
      });
    },
    [getScrollInfo],
  );

  /* ============================================================
     AUTO ROTATION
  ============================================================ */

  useEffect(() => {
    if (featuredBrands.length <= 1) return;

    /*
     * Respect the visitor's operating-system accessibility
     * preference. Manual scrolling/arrows still work.
     */
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      if (isPausedRef.current) return;

      scrollBrands("right");
    }, AUTO_ROTATE_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [featuredBrands.length, scrollBrands]);

  /* ============================================================
     CLEAN TOUCH TIMER
  ============================================================ */

  useEffect(() => {
    return () => {
      if (touchResumeTimerRef.current) {
        window.clearTimeout(touchResumeTimerRef.current);
      }
    };
  }, []);

  /* ============================================================
     PAUSE / RESUME
  ============================================================ */

  const pauseCarousel = () => {
    isPausedRef.current = true;
  };

  const resumeCarousel = () => {
    isPausedRef.current = false;
  };

  const handleTouchStart = () => {
    isPausedRef.current = true;

    if (touchResumeTimerRef.current) {
      window.clearTimeout(touchResumeTimerRef.current);
      touchResumeTimerRef.current = null;
    }
  };

  const handleTouchEnd = () => {
    if (touchResumeTimerRef.current) {
      window.clearTimeout(touchResumeTimerRef.current);
    }

    /*
     * Give the visitor time to finish reading after swiping.
     */
    touchResumeTimerRef.current = window.setTimeout(() => {
      isPausedRef.current = false;
    }, 2500);
  };

  /* ============================================================
     MANUAL NAVIGATION
  ============================================================ */

  const handleManualScroll = (direction: "left" | "right") => {
    /*
     * Briefly pause automatic movement when the visitor
     * explicitly uses an arrow.
     */
    isPausedRef.current = true;

    scrollBrands(direction);

    window.setTimeout(() => {
      isPausedRef.current = false;
    }, 2500);
  };

  return (
    <section
      aria-labelledby="featured-brands-heading"
      className="
        relative
        overflow-hidden
        bg-[#fcfaf9]
        py-16
        sm:py-20
        lg:py-24
      "
    >
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-0
          top-20
          h-96
          w-96
          rounded-full
          bg-red-100/40
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-0
          top-1/2
          h-96
          w-96
          rounded-full
          bg-rose-100/40
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/2
          h-80
          w-80
          -translate-x-1/2
          rounded-full
          bg-amber-50/50
          blur-3xl
        "
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* =========================================================
            HEADER
        ========================================================= */}

        <div className="mb-10 sm:mb-12">
          <div
            className="
              flex
              flex-col
              gap-6
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-10 bg-red-500" />

                <div className="flex items-center gap-2">
                  <Sparkles
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-amber-500"
                  />

                  <span
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.3em]
                      text-red-500
                    "
                  >
                    Featured Brands
                  </span>
                </div>
              </div>

              <h2
                id="featured-brands-heading"
                className="
                  text-3xl
                  font-bold
                  tracking-tight
                  text-gray-950
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Featured Saree
                <span className="text-red-500"> Brands.</span>
              </h2>

              <p
                className="
                  mt-4
                  max-w-2xl
                  text-sm
                  leading-7
                  text-gray-600
                  sm:text-base
                "
              >
                Discover featured saree brands bringing beautiful craftsmanship,
                distinctive designs and timeless styles to MYSMME.
              </p>
            </div>

            {/* DESKTOP ARROWS */}

            {!isLoading && !isError && featuredBrands.length > 1 && (
              <div className="hidden shrink-0 items-center gap-2.5 sm:flex">
                <button
                  type="button"
                  onClick={() => handleManualScroll("left")}
                  aria-label="Previous featured brands"
                  className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-gray-200
                      bg-white
                      text-gray-800
                      shadow-sm
                      transition-all
                      duration-300
                      hover:border-red-500
                      hover:bg-red-500
                      hover:text-white
                      focus:outline-none
                      focus:ring-2
                      focus:ring-red-500
                      focus:ring-offset-2
                    "
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => handleManualScroll("right")}
                  aria-label="Next featured brands"
                  className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-gray-200
                      bg-white
                      text-gray-800
                      shadow-sm
                      transition-all
                      duration-300
                      hover:border-red-500
                      hover:bg-red-500
                      hover:text-white
                      focus:outline-none
                      focus:ring-2
                      focus:ring-red-500
                      focus:ring-offset-2
                    "
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            LOADING
        ========================================================= */}

        {isLoading && (
          <div
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  shadow-sm
                "
              >
                <div className="h-[230px] animate-pulse bg-gray-100 sm:h-[250px]" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-36 animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =========================================================
            ERROR
        ========================================================= */}

        {isError && (
          <div
            className="
              rounded-2xl
              border
              border-red-100
              bg-white
              px-6
              py-12
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-red-50
              "
            >
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
          <div
            className="
                rounded-2xl
                border
                border-dashed
                border-gray-200
                bg-white/70
                px-6
                py-12
                text-center
              "
          >
            <div
              className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-50
                "
            >
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
            FEATURED BRAND CAROUSEL
        ========================================================= */}

        {!isLoading && !isError && featuredBrands.length > 0 && (
          <>
            <div className="relative">
              <div
                ref={sliderRef}
                onMouseEnter={pauseCarousel}
                onMouseLeave={resumeCarousel}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="
                    flex
                    snap-x
                    snap-mandatory
                    gap-4
                    overflow-x-auto
                    scroll-smooth
                    pb-5
                    sm:gap-5
                    lg:gap-6
                  "
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {featuredBrands.map((brand) => (
                  <article
                    key={brand._id}
                    data-brand-card
                    className="
                        group
                        relative
                        min-w-[85%]
                        snap-start
                        overflow-hidden
                        rounded-2xl
                        border
                        border-red-100/80
                        bg-white
                        shadow-[0_10px_35px_rgba(80,20,20,0.06)]
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-[0_20px_50px_rgba(80,20,20,0.12)]

                        sm:min-w-[calc((100%-20px)/2)]

                        lg:min-w-[calc((100%-48px)/3)]

                        xl:min-w-[calc((100%-72px)/4)]
                      "
                  >
                    {/* =============================================
                          FEATURED BADGE
                      ============================================= */}

                    <div className="absolute left-4 top-4 z-20">
                      <div
                        className="
                            flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            border-white/80
                            bg-white/90
                            px-3
                            py-1.5
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.16em]
                            text-red-600
                            shadow-md
                            backdrop-blur-md
                          "
                      >
                        <Crown className="h-3 w-3 fill-amber-400 text-amber-500" />
                        Featured
                      </div>
                    </div>

                    {/* =============================================
                          BRAND LOGO
                      ============================================= */}

                    <Link
                      href={`/brands/${brand.slug}`}
                      aria-label={`View ${brand.name}`}
                      className="
                          relative
                          flex
                          h-[230px]
                          items-center
                          justify-center
                          overflow-hidden
                          bg-gradient-to-br
                          from-[#fffaf7]
                          via-white
                          to-[#f9eeee]
                          sm:h-[250px]
                          lg:h-[260px]
                        "
                    >
                      <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            -right-20
                            -top-20
                            h-52
                            w-52
                            rounded-full
                            border
                            border-red-100/70
                          "
                      />

                      <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            -right-8
                            -top-8
                            h-32
                            w-32
                            rounded-full
                            border
                            border-red-100/50
                          "
                      />

                      <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            -bottom-16
                            -left-16
                            h-48
                            w-48
                            rounded-full
                            bg-red-50/70
                            blur-3xl
                          "
                      />

                      {/* INNER LOGO FRAME */}

                      <div
                        className="
                            relative
                            z-10
                            flex
                            h-36
                            w-[72%]
                            max-w-[250px]
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-white/80
                            bg-white/75
                            shadow-[0_12px_35px_rgba(0,0,0,0.05)]
                            backdrop-blur-sm
                            transition-transform
                            duration-500
                            group-hover:scale-[1.03]
                          "
                      >
                        <Image
                          src={brand.logo || "/images/placeholder-brand.jpg"}
                          alt={`${brand.name} logo`}
                          fill
                          sizes="
                              (min-width: 1280px) 20vw,
                              (min-width: 1024px) 28vw,
                              (min-width: 640px) 40vw,
                              70vw
                            "
                          className="object-contain p-6"
                        />
                      </div>

                      <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            inset-x-0
                            bottom-0
                            h-20
                            bg-gradient-to-t
                            from-white
                            via-white/30
                            to-transparent
                          "
                      />
                    </Link>

                    {/* =============================================
                          CONTENT
                      ============================================= */}

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <Link
                            href={`/brands/${brand.slug}`}
                            className="
                                transition-colors
                                hover:text-red-500
                              "
                          >
                            <h3
                              className="
                                  truncate
                                  text-xl
                                  font-bold
                                  tracking-tight
                                  text-gray-950
                                "
                            >
                              {brand.name}
                            </h3>
                          </Link>

                          <p
                            className="
                                mt-2
                                line-clamp-2
                                min-h-[48px]
                                text-sm
                                leading-6
                                text-gray-500
                              "
                          >
                            {brand.description ||
                              `Discover beautiful sarees and timeless styles from ${brand.name}.`}
                          </p>
                        </div>

                        <Link
                          href={`/brands/${brand.slug}`}
                          aria-label={`View ${brand.name}`}
                          className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              border
                              border-gray-200
                              bg-gray-50
                              text-gray-700
                              transition-all
                              duration-300
                              hover:border-red-500
                              hover:bg-red-500
                              hover:text-white
                            "
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>

                      {/* =============================================
                            CARD FOOTER
                        ============================================= */}

                      <div
                        className="
                            mt-5
                            flex
                            items-center
                            justify-between
                            border-t
                            border-gray-100
                            pt-4
                          "
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-full
                                bg-red-50
                              "
                          >
                            <Sparkles className="h-3.5 w-3.5 text-red-500" />
                          </span>

                          <div>
                            <p
                              className="
                                  text-[9px]
                                  font-bold
                                  uppercase
                                  tracking-wider
                                  text-gray-400
                                "
                            >
                              Spotlight
                            </p>

                            <p className="text-xs font-semibold text-gray-700">
                              Featured brand
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/sarees?brand=${encodeURIComponent(
                            brand.slug,
                          )}`}
                          className="
                              group/button
                              inline-flex
                              items-center
                              gap-1
                              text-xs
                              font-bold
                              text-gray-900
                              transition-colors
                              hover:text-red-500
                            "
                        >
                          Shop Sarees
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
            </div>

            {/* =====================================================
                  MOBILE SWIPE HINT
              ===================================================== */}

            {featuredBrands.length > 1 && (
              <div
                className="
                    mt-1
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-[11px]
                    font-medium
                    text-gray-400
                    sm:hidden
                  "
              >
                <span className="h-px w-7 bg-gray-200" />
                Swipe to explore
                <span className="h-px w-7 bg-gray-200" />
              </div>
            )}

            {/* =====================================================
                  VIEW ALL BRANDS
              ===================================================== */}

            <div className="mt-8 flex justify-center">
              <Link
                href="/brands"
                className="
                    group
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-gray-950
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-red-500
                    hover:shadow-md
                    focus:outline-none
                    focus:ring-2
                    focus:ring-red-500
                    focus:ring-offset-2
                  "
              >
                View All Brands
                <ArrowRight
                  className="
                      h-4
                      w-4
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Brands;
