"use client";

import { useGetProductsQuery } from "@/store/api/productApi";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const FALLBACK_IMAGE = "/images/saree-1.jpg";

const NewSarees = () => {
  const [currentSareeSlide, setCurrentSareeSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const { data, isLoading } = useGetProductsQuery({});

  const sarees = data?.data ?? [];

  // ============================================
  // RESPONSIVE ITEMS PER SLIDE
  // ============================================
  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerSlide(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(1);
      }
    };

    updateItemsPerSlide();

    window.addEventListener("resize", updateItemsPerSlide);

    return () => {
      window.removeEventListener("resize", updateItemsPerSlide);
    };
  }, []);

  // ============================================
  // TOTAL COMPLETE SLIDES
  // ============================================
  const totalSlides =
    itemsPerSlide > 0 ? Math.floor(sarees.length / itemsPerSlide) : 0;

  // ============================================
  // ONLY SHOW COMPLETE GROUPS
  // ============================================
  const visibleSarees = sarees.slice(0, totalSlides * itemsPerSlide);

  // ============================================
  // KEEP CURRENT SLIDE VALID
  // ============================================
  useEffect(() => {
    if (totalSlides === 0) {
      setCurrentSareeSlide(0);
      return;
    }

    if (currentSareeSlide >= totalSlides) {
      setCurrentSareeSlide(totalSlides - 1);
    }
  }, [currentSareeSlide, totalSlides]);

  // ============================================
  // AUTO SLIDE
  // ============================================
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentSareeSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [totalSlides, isPaused]);

  // ============================================
  // PREVIOUS SLIDE
  // ============================================
  const prevSlide = () => {
    if (totalSlides <= 1) return;

    setCurrentSareeSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // ============================================
  // NEXT SLIDE
  // ============================================
  const nextSlide = () => {
    if (totalSlides <= 1) return;

    setCurrentSareeSlide((prev) => (prev + 1) % totalSlides);
  };

  // ============================================
  // DISCOUNT
  // ============================================
  const calculatedDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }

    return 0;
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (isLoading) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
              New Arrivals
            </p>

            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Discover Our Latest Sarees
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Explore our newest sarees featuring elegant designs, beautiful
              colors and timeless craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-xl bg-white shadow-md"
              >
                <div className="aspect-[3/4] bg-gray-200" />

                <div className="space-y-3 p-5">
                  <div className="h-6 w-3/4 rounded bg-gray-200" />
                  <div className="h-5 w-1/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* ============================================
                    SECTION HEADING
        ============================================ */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            New Arrivals
          </p>

          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Discover Our Latest Sarees
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Explore our newest sarees featuring elegant designs, beautiful
            colors and timeless craftsmanship.
          </p>
        </div>

        {/* ============================================
                    EMPTY STATE
        ============================================ */}
        {totalSlides === 0 ? (
          <p className="flex items-center justify-center py-16 text-2xl text-gray-600">
            No Sarees Available
          </p>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* ============================================
                        CAROUSEL
            ============================================ */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentSareeSlide * 100}%)`,
                }}
              >
                {Array.from({
                  length: totalSlides,
                }).map((_, slideIndex) => (
                  <div
                    key={slideIndex}
                    className="
                      grid
                      min-w-full
                      grid-cols-1
                      gap-4
                      sm:grid-cols-2
                      sm:gap-6
                      lg:grid-cols-3
                    "
                  >
                    {visibleSarees
                      .slice(
                        slideIndex * itemsPerSlide,
                        slideIndex * itemsPerSlide + itemsPerSlide,
                      )
                      .map((saree: any) => {
                        const price = Number(saree.price) || 0;

                        const finalPrice = Number(saree.finalPrice) || 0;

                        const discount = calculatedDiscount(price, finalPrice);

                        const imageUrl = saree.images?.[0] || FALLBACK_IMAGE;

                        return (
                          <div
                            key={saree._id}
                            className="
                              group
                              relative
                              min-w-0
                              overflow-hidden
                              rounded-xl
                              bg-white
                              shadow-md
                              transition-shadow
                              duration-300
                              hover:shadow-xl
                            "
                          >
                            {/* ============================================
                                        IMAGE
                            ============================================ */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                              <Image
                                src={imageUrl}
                                alt={saree.title || "Saree"}
                                fill
                                priority={slideIndex === 0}
                                loading={slideIndex === 0 ? "eager" : "lazy"}
                                sizes="
                                  (min-width: 1024px) 33vw,
                                  (min-width: 640px) 50vw,
                                  100vw
                                "
                                className="
                                  object-contain
                                  p-2
                                  transition-transform
                                  duration-300
                                  lg:group-hover:scale-105
                                "
                              />

                              {/* ============================================
                                        DISCOUNT
                              ============================================ */}
                              {discount > 0 && (
                                <span
                                  className="
                                    absolute
                                    left-3
                                    top-3
                                    z-10
                                    rounded-full
                                    bg-red-500
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    text-white
                                    shadow-md
                                    sm:left-4
                                    sm:top-4
                                    sm:px-3
                                    sm:py-1.5
                                    sm:text-sm
                                  "
                                >
                                  {discount}% OFF
                                </span>
                              )}

                              {/* ============================================
                                MOBILE / TABLET CONTENT
                                
                                Always visible below lg.
                              ============================================ */}
                              <div
                                className="
                                  absolute
                                  inset-x-0
                                  bottom-0
                                  z-10
                                  bg-gradient-to-t
                                  from-black/90
                                  via-black/60
                                  to-transparent
                                  p-4
                                  pt-12
                                  lg:hidden
                                "
                              >
                                <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white sm:text-xl">
                                  {saree.title}
                                </h3>

                                <div className="mb-3 flex items-center gap-3">
                                  <span className="text-xl font-bold text-white">
                                    ₹{finalPrice}
                                  </span>

                                  {price > finalPrice && (
                                    <span className="text-sm text-gray-300 line-through">
                                      ₹{price}
                                    </span>
                                  )}
                                </div>

                                <Link
                                  href={`/sarees/${saree.slug}`}
                                  className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    bg-white
                                    px-5
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-gray-900
                                    shadow-md
                                    transition-colors
                                    hover:bg-red-500
                                    hover:text-white
                                  "
                                >
                                  View Details
                                  <span className="text-lg">→</span>
                                </Link>
                              </div>

                              {/* ============================================
                                DESKTOP HOVER OVERLAY
                                
                                Only active at lg and above.
                              ============================================ */}
                              <div
                                className="
                                  absolute
                                  inset-0
                                  hidden
                                  items-end
                                  bg-gradient-to-t
                                  from-black/85
                                  via-black/30
                                  to-transparent
                                  opacity-0
                                  transition-opacity
                                  duration-500
                                  lg:flex
                                  lg:group-hover:opacity-100
                                "
                              >
                                <div
                                  className="
                                    w-full
                                    translate-y-5
                                    p-5
                                    text-white
                                    transition-transform
                                    duration-500
                                    group-hover:translate-y-0
                                    sm:p-6
                                  "
                                >
                                  {/* Title */}
                                  <h3 className="mb-3 line-clamp-2 text-xl font-bold sm:text-2xl">
                                    {saree.title}
                                  </h3>

                                  {/* Price */}
                                  <div className="mb-5 flex items-center gap-3">
                                    <span className="text-2xl font-bold">
                                      ₹{finalPrice}
                                    </span>

                                    {price > finalPrice && (
                                      <span className="text-base text-gray-300 line-through">
                                        ₹{price}
                                      </span>
                                    )}
                                  </div>

                                  {/* Button */}
                                  <Link
                                    href={`/sarees/${saree.slug}`}
                                    className="
                                      inline-flex
                                      items-center
                                      gap-2
                                      rounded-full
                                      bg-white
                                      px-6
                                      py-3
                                      text-sm
                                      font-semibold
                                      text-gray-900
                                      transition-all
                                      duration-300
                                      hover:bg-red-500
                                      hover:text-white
                                    "
                                  >
                                    View Details
                                    <span className="text-lg">→</span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>

            {/* ============================================
                        PREVIOUS / NEXT
            ============================================ */}
            {totalSlides > 1 && (
              <>
                {/* Previous */}
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous sarees"
                  className="
                    absolute
                    left-2
                    top-1/2
                    z-20
                    flex
                    h-10
                    w-10
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    bg-white/90
                    text-gray-900
                    shadow-lg
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    hover:bg-red-500
                    hover:text-white
                    focus:outline-none
                    focus:ring-2
                    focus:ring-red-500
                    sm:left-3
                    sm:h-11
                    sm:w-11
                  "
                >
                  <span aria-hidden="true">&#10094;</span>
                </button>

                {/* Next */}
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next sarees"
                  className="
                    absolute
                    right-2
                    top-1/2
                    z-20
                    flex
                    h-10
                    w-10
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    bg-white/90
                    text-gray-900
                    shadow-lg
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    hover:bg-red-500
                    hover:text-white
                    focus:outline-none
                    focus:ring-2
                    focus:ring-red-500
                    sm:right-3
                    sm:h-11
                    sm:w-11
                  "
                >
                  <span aria-hidden="true">&#10095;</span>
                </button>

                {/* ============================================
                            DOTS
                ============================================ */}
                <div
                  className="mt-8 flex justify-center gap-2"
                  role="tablist"
                  aria-label="Choose saree slide"
                >
                  {Array.from({
                    length: totalSlides,
                  }).map((_, index) => {
                    const isActive = currentSareeSlide === index;

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentSareeSlide(index)}
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Go to saree slide ${index + 1}`}
                        className={`
                          h-2
                          rounded-full
                          transition-all
                          duration-300
                          focus:outline-none
                          focus:ring-2
                          focus:ring-red-500
                          focus:ring-offset-2
                          ${
                            isActive
                              ? "w-8 bg-red-500"
                              : "w-2 bg-gray-300 hover:bg-gray-400"
                          }
                        `}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewSarees;
