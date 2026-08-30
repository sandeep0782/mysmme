"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const bannerSlides = [
  {
    image: "/images/saree-1.jpg",
    eyebrow: "Timeless • Elegant • Indian",
    title: "Discover Your Perfect Saree",
    description:
      "Explore beautiful sarees crafted with timeless designs, graceful colors and elegant Indian craftsmanship.",
  },
  {
    image: "/images/saree-2.jpg",
    eyebrow: "Silk • Luxury • Tradition",
    title: "Elegance Woven in Silk",
    description:
      "Experience the richness of luxurious silk sarees, designed to make every celebration truly special.",
  },
  {
    image: "/images/saree-3.jpg",
    eyebrow: "Banarasi • Zari • Heritage",
    title: "The Timeless Charm of Banarasi",
    description:
      "Discover exquisite Banarasi sarees featuring intricate zari work, traditional motifs and timeless beauty.",
  },
  {
    image: "/images/saree-4.jpg",
    eyebrow: "Handloom • Craft • Culture",
    title: "Celebrate the Art of Handloom",
    description:
      "Embrace authentic handloom sarees created with beautiful weaves, natural textures and generations of craftsmanship.",
  },
  {
    image: "/images/saree-5.jpg",
    eyebrow: "Festive • Vibrant • Beautiful",
    title: "Dress for Every Celebration",
    description:
      "Find vibrant festive sarees that bring together beautiful colors, elegant designs and effortless glamour.",
  },
  {
    image: "/images/saree-6.jpg",
    eyebrow: "Modern • Graceful • You",
    title: "Sarees for Your Signature Style",
    description:
      "Discover contemporary sarees that blend traditional elegance with modern style for today's woman.",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = bannerSlides.length;
  const slide = bannerSlides[currentSlide];

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isPaused, totalSlides]);

  return (
    <section
      className="relative h-[520px] w-full overflow-hidden sm:h-[580px] lg:h-[620px]"
      aria-roledescription="carousel"
      aria-label="Featured sarees"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          priority={currentSlide === 0}
          fetchPriority={currentSlide === 0 ? "high" : "auto"}
          sizes="100vw"
          className="object-cover object-center brightness-110 saturate-110"
        />

        {/* Dark gradient for better text contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Slide content */}
      <div
        className="relative z-10 flex h-full items-center justify-center px-6 text-center text-white"
        role="group"
        aria-roledescription="slide"
        aria-label={`${currentSlide + 1} of ${totalSlides}`}
      >
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {slide.eyebrow}
          </p>

          <h1 className="text-4xl font-bold drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)] md:text-6xl">
            {slide.title}
          </h1>

          <p className="mt-5 text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:text-xl">
            {slide.description}
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/sarees"
              className="rounded-full bg-white px-7 py-3 font-semibold text-gray-900 shadow-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Explore Collection
            </Link>

            <Link
              href="/sarees"
              className="rounded-full border border-white bg-black/20 px-7 py-3 font-semibold text-white shadow-lg backdrop-blur-[2px] transition-colors hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Shop New Arrivals
            </Link>
          </div>
        </div>
      </div>

      {/* Previous button */}
      <button
        type="button"
        onClick={goToPrevious}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-2xl text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <span aria-hidden="true">‹</span>
      </button>

      {/* Next button */}
      <button
        type="button"
        onClick={goToNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-2xl text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <span aria-hidden="true">›</span>
      </button>

      {/* Pause / play button */}
      <button
        type="button"
        onClick={() => setIsPaused((prev) => !prev)}
        aria-label={isPaused ? "Play carousel" : "Pause carousel"}
        className="absolute bottom-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <span aria-hidden="true">{isPaused ? "▶" : "Ⅱ"}</span>
      </button>

      {/* Slide indicators */}
      <div
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2"
        role="tablist"
        aria-label="Choose a slide"
      >
        {bannerSlides.map((item, index) => {
          const isActive = index === currentSlide;

          return (
            <button
              key={item.image}
              type="button"
              onClick={() => goToSlide(index)}
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${index + 1}: ${item.title}`}
              className={`h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${
                isActive ? "w-8 bg-white" : "w-3 bg-white/50 hover:bg-white/80"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Hero;
