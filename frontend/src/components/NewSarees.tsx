"use client";

import { useGetProductsQuery } from "@/store/api/productApi";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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
  // TOTAL SLIDES
  // ============================================
  const totalSlides = Math.ceil(sarees.length / itemsPerSlide);

  // ============================================
  // KEEP CURRENT SLIDE VALID
  // ============================================
  useEffect(() => {
    if (currentSareeSlide >= totalSlides) {
      setCurrentSareeSlide(Math.max(0, totalSlides - 1));
    }
  }, [currentSareeSlide, totalSlides]);

  // ============================================
  // AUTO SLIDE
  // ============================================
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSareeSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalSlides, isPaused]);

  // ============================================
  // PREVIOUS SLIDE
  // ============================================
  const prevSlide = () => {
    setCurrentSareeSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // ============================================
  // NEXT SLIDE
  // ============================================
  const nextSlide = () => {
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

        {sarees.length > 0 ? (
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
                    className="min-w-full flex gap-4 sm:gap-6"
                  >
                    {sarees
                      .slice(
                        slideIndex * itemsPerSlide,
                        slideIndex * itemsPerSlide + itemsPerSlide,
                      )
                      .map((saree: any) => {
                        const discount = calculatedDiscount(
                          saree.price,
                          saree.finalPrice,
                        );

                        return (
                          <div
                            key={saree._id}
                            className="
                                                            group
                                                            relative
                                                            min-w-0
                                                            flex-1
                                                            overflow-hidden
                                                            rounded-xl
                                                            bg-gray-50
                                                            shadow-md
                                                            transition-shadow
                                                            duration-300
                                                            hover:shadow-xl
                                                        "
                          >
                            {/* ============================================
                                                            IMAGE
                                                        ============================================ */}
                            <div className="relative">
                              <Image
                                src={saree.images[0]}
                                alt={saree.title}
                                width={400}
                                height={500}
                                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                className="
    h-auto
    w-full
    object-contain
    transition-transform
    duration-300
    md:h-[450px]
    md:object-cover
    md:group-hover:scale-105
  "
                              />
                              {/* ============================================
                                                                DISCOUNT
                                                            ============================================ */}
                              {discount > 0 && (
                                <span className="absolute left-4 top-4 z-10 rounded-full bg-red-500 px-3 py-1.5 text-sm font-semibold text-white shadow-md">
                                  {discount}% OFF
                                </span>
                              )}

                              {/* ============================================
                                                                HOVER OVERLAY
                                                            ============================================ */}
                              <div
                                className="
                                                                absolute
                                                                inset-0
                                                                flex
                                                                items-end
                                                                bg-gradient-to-t
                                                                from-black/85
                                                                via-black/30
                                                                to-transparent
                                                                opacity-0
                                                                transition-opacity
                                                                duration-500
                                                                group-hover:opacity-100
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
                                  <h3
                                    className="
                                                                        mb-3
                                                                        line-clamp-2
                                                                        text-xl
                                                                        font-bold
                                                                        sm:text-2xl
                                                                    "
                                  >
                                    {saree.title}
                                  </h3>

                                  {/* Price */}
                                  <div className="mb-5 flex items-center gap-3">
                                    <span className="text-2xl font-bold">
                                      ₹{saree.finalPrice}
                                    </span>

                                    {saree.price > saree.finalPrice && (
                                      <span className="text-base text-gray-300 line-through">
                                        ₹{saree.price}
                                      </span>
                                    )}
                                  </div>

                                  {/* Button */}
                                  <Link
                                    href={`/sarees/${saree.slug}`}
                                    className="
                                                                            inline-flex
                                                                            cursor-pointer
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
                                        sm:left-3
                                        sm:h-11
                                        sm:w-11
                                    "
                >
                  &#10094;
                </button>

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
                                        sm:right-3
                                        sm:h-11
                                        sm:w-11
                                    "
                >
                  &#10095;
                </button>

                {/* ============================================
                                    DOTS
                                ============================================ */}
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({
                    length: totalSlides,
                  }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentSareeSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      className={`
                                                h-2
                                                rounded-full
                                                transition-all
                                                duration-300
                                                ${
                                                  currentSareeSlide === index
                                                    ? "w-8 bg-red-500"
                                                    : "w-2 bg-gray-300"
                                                }
                                            `}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="flex items-center justify-center text-2xl">
            No Sarees Available
          </p>
        )}
      </div>
    </section>
  );
};

export default NewSarees;
