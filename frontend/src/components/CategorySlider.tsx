"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

import { useGetAllCategoriesQuery } from "@/store/api/categoryApi";
const CategorySlider = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const trackRef = useRef<HTMLDivElement | null>(null);

  const animationRef = useRef<number | null>(null);

  const positionRef = useRef(0);

  const directionRef = useRef(-1);

  const isHoveredRef = useRef(false);

  const speed = 0.5;

  // ============================================================
  // GET CATEGORIES FROM REDUX / RTK QUERY
  // ============================================================

  const {
    data: categories = [],
    isLoading,
    isError,
  } = useGetAllCategoriesQuery();

  // ============================================================
  // RESET SLIDER WHEN CATEGORIES CHANGE
  // ============================================================

  useEffect(() => {
    positionRef.current = 0;
    directionRef.current = -1;

    if (trackRef.current) {
      trackRef.current.style.transform = "translate3d(0, 0, 0)";
    }
  }, [categories]);

  // ============================================================
  // AUTO SLIDER
  // ============================================================

  useEffect(() => {
    const animate = () => {
      const container = containerRef.current;

      const track = trackRef.current;

      if (container && track && !isHoveredRef.current) {
        const containerWidth = container.clientWidth;

        const trackWidth = track.scrollWidth;

        const maxMovement = Math.max(0, trackWidth - containerWidth);

        // Only move when content is
        // wider than the container
        if (maxMovement > 0) {
          positionRef.current += speed * directionRef.current;

          // Reached left side
          if (positionRef.current <= -maxMovement) {
            positionRef.current = -maxMovement;

            directionRef.current = 1;
          }

          // Reached right side
          if (positionRef.current >= 0) {
            positionRef.current = 0;

            directionRef.current = -1;
          }

          track.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // ============================================================
  // HOVER HANDLERS
  // ============================================================

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* ==================================================
                    HEADING
                ================================================== */}

        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            Explore
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
            Shop by Category
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Explore our collection of beautiful sarees crafted for every style
            and occasion.
          </p>
        </div>

        {/* ==================================================
                    LOADING
                ================================================== */}

        {isLoading && (
          <div className="flex justify-center gap-8 overflow-hidden sm:gap-10 md:gap-12">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="w-28 flex-shrink-0 text-center sm:w-32 md:w-36"
              >
                <div className="mx-auto h-24 w-24 animate-pulse rounded-full bg-gray-200 sm:h-28 sm:w-28 md:h-32 md:w-32" />

                <div className="mx-auto mt-4 h-4 w-20 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* ==================================================
                    ERROR
                ================================================== */}

        {isError && (
          <p className="text-center text-sm text-gray-500">
            Unable to load categories.
          </p>
        )}

        {/* ==================================================
                    EMPTY
                ================================================== */}

        {!isLoading && !isError && categories.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            No categories available.
          </p>
        )}

        {/* ==================================================
                    CATEGORY SLIDER
                ================================================== */}

        {!isLoading && !isError && categories.length > 0 && (
          <div
            ref={containerRef}
            className="relative overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              ref={trackRef}
              className="flex w-max items-start gap-8 sm:gap-10 md:gap-12"
              style={{
                willChange: "transform",
              }}
            >
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/sarees?category=${category.slug}`}
                  className="group w-28 flex-shrink-0 cursor-pointer text-center sm:w-32 md:w-36"
                >
                  {/* ==================================================
                                                CATEGORY IMAGE
                                            ================================================== */}

                  <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md transition-all duration-300 group-hover:shadow-xl sm:h-28 sm:w-28 md:h-32 md:w-32">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                        No Image
                      </div>
                    )}

                    <div className="absolute inset-0 rounded-full bg-black/0 transition-all duration-300 group-hover:bg-black/25" />
                  </div>

                  {/* ==================================================
                                                CATEGORY NAME
                                            ================================================== */}

                  <h3 className="mt-4 text-sm font-semibold text-gray-800 transition-colors duration-300 group-hover:text-red-500 sm:text-base">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySlider;
