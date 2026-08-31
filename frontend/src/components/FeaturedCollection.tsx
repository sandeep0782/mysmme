"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useGetProductsQuery } from "@/store/api/productApi";

const FALLBACK_IMAGE = "/images/saree-1.jpg";

interface Product {
  _id: string;
  title: string;
  slug: string;
  collectionName?: string;
  images?: string[];
}

interface Collection {
  name: string;
  image: string;
  productCount: number;
}

const FeaturedCollection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const { data, isLoading } = useGetProductsQuery({});

  const products: Product[] = data?.data ?? [];

  // ============================================================
  // CREATE UNIQUE COLLECTIONS FROM PRODUCTS
  // ============================================================

  const collections = useMemo<Collection[]>(() => {
    const collectionMap = new Map<
      string,
      {
        image: string;
        productCount: number;
      }
    >();

    products.forEach((product) => {
      const collectionName = product.collectionName?.trim();

      // Ignore products without a collection
      if (!collectionName) return;

      const existing = collectionMap.get(collectionName);

      if (existing) {
        existing.productCount += 1;

        // If current image is fallback, try to use a real product image
        if (existing.image === FALLBACK_IMAGE && product.images?.[0]) {
          existing.image = product.images[0];
        }
      } else {
        collectionMap.set(collectionName, {
          image: product.images?.[0] || FALLBACK_IMAGE,
          productCount: 1,
        });
      }
    });

    return Array.from(collectionMap.entries()).map(([name, value]) => ({
      name,
      image: value.image,
      productCount: value.productCount,
    }));
  }, [products]);

  // ============================================================
  // RESPONSIVE ITEMS PER SLIDE
  // ============================================================

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth >= 1280) {
        // Large desktop → 4 cards
        setItemsPerSlide(4);
      } else if (window.innerWidth >= 1024) {
        // Desktop → 3 cards
        setItemsPerSlide(3);
      } else if (window.innerWidth >= 640) {
        // Tablet → 2 cards
        setItemsPerSlide(2);
      } else {
        // Mobile → 1 card
        setItemsPerSlide(1);
      }
    };

    updateItemsPerSlide();

    window.addEventListener("resize", updateItemsPerSlide);

    return () => {
      window.removeEventListener("resize", updateItemsPerSlide);
    };
  }, []);

  // ============================================================
  // TOTAL SLIDES
  // ============================================================

  const totalSlides =
    itemsPerSlide > 0 ? Math.ceil(collections.length / itemsPerSlide) : 0;

  // ============================================================
  // KEEP CURRENT SLIDE VALID
  // ============================================================

  useEffect(() => {
    if (totalSlides === 0) {
      setCurrentSlide(0);
      return;
    }

    if (currentSlide >= totalSlides) {
      setCurrentSlide(totalSlides - 1);
    }
  }, [currentSlide, totalSlides]);

  // ============================================================
  // AUTO CAROUSEL
  // ============================================================

  useEffect(() => {
    if (totalSlides <= 1 || isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [totalSlides, isPaused]);

  // ============================================================
  // PREVIOUS SLIDE
  // ============================================================

  const prevSlide = () => {
    if (totalSlides <= 1) return;

    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // ============================================================
  // NEXT SLIDE
  // ============================================================

  const nextSlide = () => {
    if (totalSlides <= 1) return;

    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (isLoading) {
    return (
      <section className="bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Heading */}
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">
              Featured Collections
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Find Your Signature Style
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              From traditional weaves to modern styles, discover a saree
              collection made for every occasion.
            </p>
          </div>

          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  h-[340px]
                  animate-pulse
                  overflow-hidden
                  rounded-xl
                  bg-gray-200
                  sm:h-[360px]
                  lg:h-[380px]
                  xl:h-[400px]
                "
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ============================================================
  // EMPTY STATE
  // ============================================================

  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* ======================================================
            SECTION HEADING
        ====================================================== */}

        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">
            Featured Collections
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Find Your Signature Style
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            From traditional weaves to modern styles, discover a saree
            collection made for every occasion.
          </p>
        </div>

        {/* ======================================================
            CAROUSEL
        ====================================================== */}

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* ====================================================
              VIEWPORT
          ==================================================== */}

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {Array.from({
                length: totalSlides,
              }).map((_, slideIndex) => {
                const slideCollections = collections.slice(
                  slideIndex * itemsPerSlide,
                  slideIndex * itemsPerSlide + itemsPerSlide,
                );

                return (
                  <div key={slideIndex} className="min-w-full">
                    {/* ==================================================
                        CARDS
                    ================================================== */}

                    <div className="flex justify-center gap-5 sm:gap-6">
                      {slideCollections.map((collection) => (
                        <Link
                          key={collection.name}
                          href={`/sarees?collection=${encodeURIComponent(
                            collection.name,
                          )}`}
                          className="
                            group
                            min-w-0
                            w-full
                            overflow-hidden
                            rounded-xl
                            bg-white
                            shadow-md
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:shadow-xl

                            sm:w-[calc(50%-12px)]

                            lg:w-[calc(33.333%-16px)]

                            xl:w-[calc(25%-18px)]
                          "
                        >
                          {/* ==================================================
                              IMAGE
                          ================================================== */}

                          <div
                            className="
                              relative
                              h-[340px]
                              overflow-hidden
                              bg-gray-100

                              sm:h-[360px]

                              lg:h-[380px]

                              xl:h-[400px]
                            "
                          >
                            <Image
                              src={collection.image || FALLBACK_IMAGE}
                              alt={`${collection.name} Sarees`}
                              fill
                              priority={slideIndex === 0}
                              loading={slideIndex === 0 ? "eager" : "lazy"}
                              sizes="
    (min-width: 1280px) 25vw,
    (min-width: 1024px) 33vw,
    (min-width: 640px) 50vw,
    100vw
  "
                              className="
    object-contain
    transition-transform
    duration-500
    group-hover:scale-105
  "
                            />

                            {/* ==================================================
                                DARK GRADIENT
                            ================================================== */}

                            <div
                              className="
                                absolute
                                inset-0
                                bg-gradient-to-t
                                from-black/85
                                via-black/25
                                to-transparent
                              "
                            />

                            {/* ==================================================
                                COLLECTION LABEL
                            ================================================== */}

                            <div className="absolute left-4 top-4">
                              <span
                                className="
                                  rounded-full
                                  bg-white/90
                                  px-3
                                  py-1.5
                                  text-[11px]
                                  font-semibold
                                  uppercase
                                  tracking-wider
                                  text-gray-900
                                  backdrop-blur-sm
                                "
                              >
                                Collection
                              </span>
                            </div>

                            {/* ==================================================
                                CONTENT
                            ================================================== */}

                            <div
                              className="
                                absolute
                                bottom-0
                                left-0
                                w-full
                                p-5
                                text-white
                              "
                            >
                              {/* Collection Name */}

                              <h3
                                className="
                                  line-clamp-2
                                  text-xl
                                  font-bold
                                  sm:text-2xl
                                "
                              >
                                {collection.name}
                              </h3>

                              {/* Product Count */}

                              <p className="mt-1 text-sm text-gray-200">
                                {collection.productCount}{" "}
                                {collection.productCount === 1
                                  ? "Saree"
                                  : "Sarees"}
                              </p>

                              {/* ==================================================
                                  BUTTON
                              ================================================== */}

                              <span
                                className="
                                  mt-4
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-full
                                  bg-white
                                  px-4
                                  py-2
                                  text-sm
                                  font-semibold
                                  text-gray-900
                                  transition-all
                                  duration-300
                                  group-hover:bg-red-500
                                  group-hover:text-white
                                "
                              >
                                View Collection
                                <span
                                  className="
                                    text-base
                                    transition-transform
                                    duration-300
                                    group-hover:translate-x-1
                                  "
                                >
                                  →
                                </span>
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ======================================================
              PREVIOUS / NEXT BUTTONS
          ====================================================== */}

          {totalSlides > 1 && (
            <>
              {/* Previous */}

              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous collections"
                className="
                  absolute
                  left-1
                  top-1/2
                  z-20
                  flex
                  h-9
                  w-9
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-white/95
                  text-gray-900
                  shadow-lg
                  transition-all
                  duration-300
                  hover:bg-red-500
                  hover:text-white
                  focus:outline-none

                  sm:left-2
                  sm:h-10
                  sm:w-10
                "
              >
                <span aria-hidden="true">&#10094;</span>
              </button>

              {/* Next */}

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next collections"
                className="
                  absolute
                  right-1
                  top-1/2
                  z-20
                  flex
                  h-9
                  w-9
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-white/95
                  text-gray-900
                  shadow-lg
                  transition-all
                  duration-300
                  hover:bg-red-500
                  hover:text-white
                  focus:outline-none

                  sm:right-2
                  sm:h-10
                  sm:w-10
                "
              >
                <span aria-hidden="true">&#10095;</span>
              </button>
            </>
          )}

          {/* ======================================================
              DOTS
          ====================================================== */}

          {totalSlides > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({
                length: totalSlides,
              }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to collection slide ${index + 1}`}
                  aria-current={currentSlide === index ? "true" : undefined}
                  className={`
                    h-2
                    rounded-full
                    transition-all
                    duration-300

                    ${
                      currentSlide === index
                        ? "w-7 bg-red-500"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    }
                  `}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
