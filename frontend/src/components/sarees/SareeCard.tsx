"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface SareeCardProps {
  saree: any;
}

// =========================
// HELPERS
// =========================

const getDisplayValue = (value: unknown): string => {
  if (value == null) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }

  if (typeof value === "object") {
    const obj = value as {
      name?: unknown;
      slug?: unknown;
      title?: unknown;
      label?: unknown;
    };

    return String(obj.name ?? obj.title ?? obj.label ?? obj.slug ?? "").trim();
  }

  return "";
};

// =========================
// IMAGE URL VALIDATION
// =========================

const isValidImageUrl = (value: unknown): value is string => {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return false;
    }

    // Ignore dummy/test images
    if (url.hostname === "example.com" || url.hostname === "www.example.com") {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

const SareeCard = ({ saree }: SareeCardProps) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // =========================
  // PRODUCT VALUES
  // =========================

  const brand = getDisplayValue(saree?.brand);

  const color = getDisplayValue(saree?.color);

  const title = getDisplayValue(saree?.title);

  // =========================
  // IMAGES
  // =========================

  const images: string[] = Array.isArray(saree?.images)
    ? saree.images.filter(isValidImageUrl)
    : [];

  // =========================
  // RESET ACTIVE IMAGE
  // =========================

  useEffect(() => {
    if (activeImage >= images.length) {
      setActiveImage(0);
    }
  }, [images.length, activeImage]);

  // =========================
  // PRICE
  // =========================

  const price = Number(saree?.price ?? 0);

  const finalPrice = Number(saree?.finalPrice ?? 0);

  const discount =
    price > finalPrice && price > 0
      ? Math.round(((price - finalPrice) / price) * 100)
      : 0;

  // =========================
  // AUTO IMAGE SLIDER
  // =========================

  useEffect(() => {
    if (!isHovered || images.length <= 1) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setActiveImage((prev) => {
        return (prev + 1) % images.length;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovered, images.length]);

  // =========================
  // MOUSE HANDLERS
  // =========================

  const handleMouseEnter = () => {
    if (images.length > 1) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setActiveImage(0);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <Card
        className="
          group
          relative
          overflow-hidden
          rounded-xs
          border-0
          bg-white
          p-0
          transition-shadow
          duration-300
          hover:shadow-2xl
        "
      >
        <CardContent className="p-0">
          <Link href={`/sarees/${saree?.slug}`}>
            {/* =========================
                IMAGE AREA
            ========================= */}

            <div
              className="
                relative
                aspect-[4/5]
                overflow-hidden
                bg-gray-50
              "
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {images.length > 0 ? (
                images.map((image: string, index: number) => (
                  <Image
                    key={`${image}-${index}`}
                    src={image}
                    alt={`${title || "Saree"} - image ${index + 1}`}
                    fill
                    sizes="
                        (max-width: 640px) 50vw,
                        (max-width: 1024px) 33vw,
                        25vw
                      "
                    priority={index === 0}
                    className={`
                        absolute
                        inset-0
                        object-cover
                        transition-opacity
                        duration-700
                        ease-in-out
                        ${
                          index === activeImage
                            ? "z-10 opacity-100"
                            : "z-0 opacity-0"
                        }
                      `}
                  />
                ))
              ) : (
                <div
                  className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    bg-gray-100
                    text-sm
                    text-gray-400
                  "
                >
                  No image available
                </div>
              )}

              {/* =========================
                  DISCOUNT
              ========================= */}

              {discount > 0 && (
                <div
                  className="
                    absolute
                    left-0
                    top-0
                    z-20
                    p-2
                  "
                >
                  <Badge
                    className="
                      bg-red-600/90
                      text-white
                      hover:bg-red-700
                    "
                  >
                    {discount}% Off
                  </Badge>
                </div>
              )}

              {/* =========================
                  WISHLIST
              ========================= */}

              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="
                  absolute
                  right-2
                  top-2
                  z-30
                  h-8
                  w-8
                  rounded-full
                  bg-white/80
                  backdrop-blur-sm
                  hover:bg-white
                "
              >
                <Heart
                  className="
                    h-4
                    w-4
                    text-red-500
                  "
                />
              </Button>

              {/* =========================
                  SLIDER INDICATORS
              ========================= */}

              {isHovered && images.length > 1 && (
                <div
                  className="
                      absolute
                      bottom-3
                      left-1/2
                      z-30
                      flex
                      -translate-x-1/2
                      gap-1.5
                    "
                >
                  {images.map((_: string, index: number) => (
                    <span
                      key={index}
                      className={`
                            h-1
                            rounded-full
                            transition-all
                            duration-300
                            ${
                              activeImage === index
                                ? "w-5 bg-red-500"
                                : "w-2 bg-white/80"
                            }
                          `}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* =========================
                PRODUCT INFO
            ========================= */}

            <div className="space-y-2 p-4">
              {/* BRAND + COLOR */}

              <div className="relative min-h-[28px]">
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    transition-opacity
                    duration-200
                    group-hover:opacity-0
                  "
                >
                  <h3
                    className="
                      truncate
                      text-lg
                      font-semibold
                      text-red-500
                    "
                  >
                    {brand}
                  </h3>

                  <h3
                    className="
                      truncate
                      text-lg
                      font-semibold
                      text-gray-700
                    "
                  >
                    {color}
                  </h3>
                </div>

                {/* BUY NOW */}

                <Button
                  type="button"
                  className="
                    absolute
                    inset-0
                    w-full
                    cursor-pointer
                    rounded-xs
                    border
                    border-red-500
                    bg-white
                    text-sm
                    font-semibold
                    text-red-500
                    opacity-0
                    transition-all
                    duration-200
                    group-hover:opacity-100
                    hover:bg-red-500
                    hover:text-white
                  "
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    console.log("Buy Now:", saree?._id);
                  }}
                >
                  Buy Now
                </Button>
              </div>

              {/* TITLE */}

              <h3
                className="
                  line-clamp-1
                  font-semibold
                  text-zinc-400
                "
              >
                {title}
              </h3>

              {/* PRICE */}

              <div className="flex items-baseline gap-2">
                <span
                  className="
                    text-2xl
                    font-bold
                    text-black
                  "
                >
                  ₹{finalPrice}
                </span>

                {price > 0 && (
                  <span
                    className="
                      text-sm
                      text-zinc-500
                      line-through
                    "
                  >
                    ₹{price}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </CardContent>

        {/* =========================
            DECORATIVE GLOW
        ========================= */}

        <div
          className="
            absolute
            -right-8
            -top-8
            h-24
            w-24
            rounded-full
            bg-orange-500/10
            blur-2xl
          "
        />

        <div
          className="
            absolute
            -bottom-8
            -left-8
            h-24
            w-24
            rounded-full
            bg-orange-500/10
            blur-2xl
          "
        />
      </Card>
    </motion.div>
  );
};

export default SareeCard;
