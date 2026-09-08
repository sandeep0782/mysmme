"use client";

import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Maximize2,
  Share2,
  X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

/* =========================================================
   REELS DATA
========================================================= */

const allReels = [
  {
    id: "3k97PfKYFP8",
    title: "Elegant Saree Look",
    subtitle: "Timeless elegance for every occasion",
  },
  {
    id: "ehMaEJtqVlo",
    title: "Festive Edit",
    subtitle: "Make every celebration special",
  },
  {
    id: "K3qL6tEO4-0",
    title: "Style Inspiration",
    subtitle: "Traditional beauty, modern styling",
  },
  {
    id: "1D2ghhMqttc",
    title: "New Arrivals",
    subtitle: "Fresh styles you'll love",
  },
  {
    id: "MD6dVpyJbbU",
    title: "Graceful Drapes",
    subtitle: "Effortless elegance in every drape",
  },
  {
    id: "vuoJDIrCiaQ",
    title: "Classic Beauty",
    subtitle: "A timeless look for every celebration",
  },
  {
    id: "TmmPQXXC13Q",
    title: "Festive Glam",
    subtitle: "Perfect looks for special moments",
  },
  {
    id: "09SJZ_LyB34",
    title: "Saree Styling",
    subtitle: "Simple styling, beautiful results",
  },
  {
    id: "cKzG_qXLzv8",
    title: "Modern Tradition",
    subtitle: "Where contemporary meets tradition",
  },
  {
    id: "MDpxq8iN8ic",
    title: "Everyday Elegance",
    subtitle: "Beautiful styles for every day",
  },
  {
    id: "_hUykpprRWY",
    title: "The Saree Edit",
    subtitle: "Discover your next favourite look",
  },
];

/*
 * Keep the homepage light.
 * We can later create a dedicated /reels page for all videos.
 */
const reels = allReels.slice(0, 6);

/* =========================================================
   YOUTUBE URL
========================================================= */

function getYouTubeUrl(id: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    cc_load_policy: "0",
    rel: "0",
    playsinline: "1",
    loop: "1",
    playlist: id,
  });

  if (typeof window !== "undefined") {
    params.set("origin", window.location.origin);
  }

  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

/* =========================================================
   VIDEO
========================================================= */

function ReelVideo({ id, title }: { id: string; title: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-neutral-200">
      <iframe
        src={getYouTubeUrl(id)}
        title={title}
        loading="lazy"
        tabIndex={-1}
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[112%]
          w-[112%]
          -translate-x-1/2
          -translate-y-1/2
          border-0
        "
      />

      {/* Prevent direct YouTube iframe interaction */}
      <div className="absolute inset-0 z-10" aria-hidden="true" />
    </div>
  );
}

/* =========================================================
   REEL CARD
========================================================= */

function ReelCard({
  reel,
  onOpen,
}: {
  reel: (typeof reels)[number];
  onOpen: () => void;
}) {
  const [liked, setLiked] = useState(false);

  const toggleLike = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setLiked((value) => !value);
  };

  const shareReel = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const url = `https://www.youtube.com/shorts/${reel.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: reel.title,
          text: reel.subtitle,
          url,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // User cancelled share or sharing was unavailable.
    }
  };

  return (
    <article
      className="
        group
        relative
        aspect-[9/16]
        w-full
        overflow-hidden
        rounded-[18px]
        bg-neutral-100
        shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)]
      "
    >
      {/* VIDEO */}

      <ReelVideo id={reel.id} title={reel.title} />

      {/* TOP ACTIONS */}

      <div className="absolute right-2.5 top-2.5 z-40 flex gap-1.5">
        <button
          type="button"
          onClick={toggleLike}
          aria-label={liked ? "Unlike reel" : "Like reel"}
          aria-pressed={liked}
          className={`
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            backdrop-blur-md
            transition-all
            ${
              liked
                ? "bg-white text-red-500"
                : "bg-black/25 text-white hover:bg-black/45"
            }
          `}
        >
          <Heart size={14} fill={liked ? "currentColor" : "none"} />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
          aria-label={`Open ${reel.title}`}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-black/25
            text-white
            backdrop-blur-md
            transition
            hover:bg-black/45
          "
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* SHARE */}

      <button
        type="button"
        onClick={shareReel}
        aria-label={`Share ${reel.title}`}
        className="
          absolute
          bottom-24
          right-2.5
          z-40
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          bg-black/25
          text-white
          backdrop-blur-md
          transition
          hover:scale-105
          hover:bg-black/45
        "
      >
        <Share2 size={14} />
      </button>

      {/* GRADIENT */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-20
          h-48
          bg-gradient-to-t
          from-black/75
          via-black/20
          to-transparent
        "
        aria-hidden="true"
      />

      {/* CONTENT */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-30
          p-4
          text-white
        "
      >
        <p
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.22em]
            text-white/70
          "
        >
          Style Inspiration
        </p>

        <h3 className="mt-1.5 text-base font-medium tracking-tight">
          {reel.title}
        </h3>

        <p className="mt-1 text-[11px] leading-4 text-white/75">
          {reel.subtitle}
        </p>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
          className="
            pointer-events-auto
            mt-3
            inline-flex
            items-center
            rounded-full
            border
            border-white/25
            bg-white/10
            px-3
            py-1.5
            text-[11px]
            font-medium
            text-white
            backdrop-blur-md
            transition
            hover:bg-white
            hover:text-neutral-900
          "
        >
          Watch Reel
        </button>
      </div>
    </article>
  );
}

/* =========================================================
   FULLSCREEN VIEWER
========================================================= */

function FullscreenViewer({
  startIndex,
  onClose,
}: {
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);

  const reel = reels[current];

  const previous = () => {
    setCurrent((value) => (value - 1 + reels.length) % reels.length);
  };

  const next = () => {
    setCurrent((value) => (value + 1) % reels.length);
  };

  /* =======================================================
     KEYBOARD
  ======================================================= */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft") {
        setCurrent((value) => (value - 1 + reels.length) % reels.length);
      }

      if (event.key === "ArrowRight") {
        setCurrent((value) => (value + 1) % reels.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  /* =======================================================
     LOCK BODY SCROLL
  ======================================================= */

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, []);

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black
      "
      role="dialog"
      aria-modal="true"
      aria-label={`${reel.title} video`}
    >
      {/* CLOSE */}

      <button
        type="button"
        onClick={onClose}
        aria-label="Close reel"
        className="
          absolute
          right-4
          top-4
          z-50
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-white/10
          text-white
          backdrop-blur-md
          transition
          hover:bg-white/20
          focus:outline-none
          focus:ring-2
          focus:ring-white
        "
      >
        <X size={19} />
      </button>

      {/* DESKTOP PREVIOUS */}

      {reels.length > 1 && (
        <button
          type="button"
          onClick={previous}
          aria-label="Previous reel"
          className="
            absolute
            left-5
            top-1/2
            z-50
            hidden
            h-12
            w-12
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-white/10
            text-white
            backdrop-blur-md
            transition
            hover:bg-white/20
            focus:outline-none
            focus:ring-2
            focus:ring-white
            md:flex
          "
        >
          <ChevronLeft size={25} />
        </button>
      )}

      {/* DESKTOP NEXT */}

      {reels.length > 1 && (
        <button
          type="button"
          onClick={next}
          aria-label="Next reel"
          className="
            absolute
            right-5
            top-1/2
            z-50
            hidden
            h-12
            w-12
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-white/10
            text-white
            backdrop-blur-md
            transition
            hover:bg-white/20
            focus:outline-none
            focus:ring-2
            focus:ring-white
            md:flex
          "
        >
          <ChevronRight size={25} />
        </button>
      )}

      {/* VIDEO */}

      <div
        className="
          relative
          h-[100dvh]
          w-[min(100vw,56.25dvh)]
          overflow-hidden
          bg-black
          sm:h-[94dvh]
          sm:w-[calc(94dvh*0.5625)]
          sm:rounded-2xl
        "
      >
        <iframe
          key={reel.id}
          src={getYouTubeUrl(reel.id)}
          title={reel.title}
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex={-1}
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[112%]
            w-[112%]
            -translate-x-1/2
            -translate-y-1/2
            border-0
          "
        />

        <div className="absolute inset-0 z-20" aria-hidden="true" />
      </div>

      {/* MOBILE NAVIGATION */}

      {reels.length > 1 && (
        <div
          className="
            absolute
            bottom-5
            left-1/2
            z-50
            flex
            -translate-x-1/2
            gap-3
            md:hidden
          "
        >
          <button
            type="button"
            onClick={previous}
            aria-label="Previous reel"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              backdrop-blur-md
              transition
              hover:bg-white/20
              focus:outline-none
              focus:ring-2
              focus:ring-white
            "
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next reel"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              backdrop-blur-md
              transition
              hover:bg-white/20
              focus:outline-none
              focus:ring-2
              focus:ring-white
            "
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Reels() {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  /* =======================================================
     CAROUSEL SCROLL
  ======================================================= */

  const scrollReels = (direction: "left" | "right") => {
    const container = sliderRef.current;

    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>("[data-reel-card]");

    if (!firstCard) return;

    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 20;

    const distance = firstCard.offsetWidth + gap;

    container.scrollBy({
      left: direction === "right" ? distance : -distance,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section
        aria-labelledby="reels-heading"
        className="
          overflow-hidden
          bg-[#faf9f7]
          py-14
          sm:py-16
          lg:py-20
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-5
            sm:px-6
            lg:px-8
          "
        >
          {/* HEADER */}

          <div
            className="
              mb-7
              flex
              items-end
              justify-between
              gap-6
              sm:mb-9
            "
          >
            <div>
              <div className="mb-2.5 flex items-center gap-2">
                <span className="h-px w-6 bg-neutral-400" aria-hidden="true" />

                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-neutral-500
                  "
                >
                  Watch &amp; Discover
                </p>
              </div>

              <h2
                id="reels-heading"
                className="
                  font-serif
                  text-3xl
                  tracking-tight
                  text-neutral-900
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Sarees in Motion
              </h2>

              <p
                className="
                  mt-2
                  max-w-xl
                  text-sm
                  leading-6
                  text-neutral-500
                "
              >
                Discover beautiful drapes, styling inspiration and our latest
                saree looks.
              </p>
            </div>

            {/* DESKTOP NAVIGATION */}

            {reels.length > 1 && (
              <div className="hidden items-center gap-2.5 sm:flex">
                <button
                  type="button"
                  onClick={() => scrollReels("left")}
                  aria-label="Previous reels"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-neutral-200
                    bg-white
                    text-neutral-800
                    shadow-sm
                    transition
                    hover:border-neutral-900
                    hover:bg-neutral-900
                    hover:text-white
                    focus:outline-none
                    focus:ring-2
                    focus:ring-neutral-900
                  "
                >
                  <ChevronLeft size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => scrollReels("right")}
                  aria-label="Next reels"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-neutral-200
                    bg-white
                    text-neutral-800
                    shadow-sm
                    transition
                    hover:border-neutral-900
                    hover:bg-neutral-900
                    hover:text-white
                    focus:outline-none
                    focus:ring-2
                    focus:ring-neutral-900
                  "
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            )}
          </div>

          {/* REELS CAROUSEL */}

          <div className="relative">
            <div
              ref={sliderRef}
              className="
                flex
                snap-x
                snap-mandatory
                gap-4
                overflow-x-auto
                scroll-smooth
                pb-4
                sm:gap-5
              "
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {reels.map((reel, index) => (
                <div
                  key={reel.id}
                  data-reel-card
                  className="
                    min-w-[76%]
                    snap-center
                    sm:min-w-[calc((100%-20px)/2)]
                    lg:min-w-[calc((100%-60px)/4)]
                  "
                >
                  <ReelCard
                    reel={reel}
                    onOpen={() => setFullscreenIndex(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}

          <div className="mt-4 flex items-center justify-center">
            <div
              className="
                flex
                items-center
                gap-2
                text-[11px]
                text-neutral-400
              "
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-neutral-400"
                aria-hidden="true"
              />

              <span className="sm:hidden">Swipe to explore</span>

              <span className="hidden sm:inline">
                Explore our latest saree reels
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FULLSCREEN */}

      {fullscreenIndex !== null && (
        <FullscreenViewer
          startIndex={fullscreenIndex}
          onClose={() => setFullscreenIndex(null)}
        />
      )}
    </>
  );
}
