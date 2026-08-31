"use client";

import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Maximize2,
  Share2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

/* =========================================================
   REELS DATA
========================================================= */

const reels = [
  {
    id: "3k97PfKYFP8",
    title: "Elegant Saree Look",
    subtitle: "Timeless elegance for every occasion",
    product: "Featured Saree",
    price: "₹4,999",
  },
  {
    id: "ehMaEJtqVlo",
    title: "Festive Edit",
    subtitle: "Make every celebration special",
    product: "Festive Saree",
    price: "₹3,999",
  },
  {
    id: "K3qL6tEO4-0",
    title: "Style Inspiration",
    subtitle: "Traditional beauty, modern styling",
    product: "Designer Saree",
    price: "₹3,499",
  },
  {
    id: "1D2ghhMqttc",
    title: "New Arrivals",
    subtitle: "Fresh styles you'll love",
    product: "New Collection",
    price: "₹2,999",
  },
  {
    id: "MD6dVpyJbbU",
    title: "Graceful Drapes",
    subtitle: "Effortless elegance in every drape",
    product: "Signature Saree",
    price: "₹4,499",
  },
  {
    id: "vuoJDIrCiaQ",
    title: "Classic Beauty",
    subtitle: "A timeless look for every celebration",
    product: "Classic Collection",
    price: "₹3,999",
  },
  {
    id: "TmmPQXXC13Q",
    title: "Festive Glam",
    subtitle: "Perfect looks for special moments",
    product: "Festive Collection",
    price: "₹4,299",
  },
  {
    id: "09SJZ_LyB34",
    title: "Saree Styling",
    subtitle: "Simple styling, beautiful results",
    product: "Style Edit",
    price: "₹3,799",
  },
  {
    id: "cKzG_qXLzv8",
    title: "Modern Tradition",
    subtitle: "Where contemporary meets tradition",
    product: "Modern Sarees",
    price: "₹4,599",
  },
  {
    id: "MDpxq8iN8ic",
    title: "Everyday Elegance",
    subtitle: "Beautiful styles for every day",
    product: "Everyday Collection",
    price: "₹2,999",
  },
  {
    id: "_hUykpprRWY",
    title: "The Saree Edit",
    subtitle: "Discover your next favourite look",
    product: "Latest Collection",
    price: "₹3,999",
  },
];

/* =========================================================
   YOUTUBE URL

   IMPORTANT:
   controls=0
   autoplay=1
   loop=1
   playlist=id

   playlist is required for YouTube looping.
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
    modestbranding: "1",
    playsinline: "1",

    // Loop this exact video
    loop: "1",
    playlist: id,

    // Do not show video annotations
    showinfo: "0",
  });

  if (typeof window !== "undefined") {
    params.set("origin", window.location.origin);
  }

  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

/* =========================================================
   VIDEO

   No YouTube API.
   No YT.Player.
   No play/pause handling.
   The iframe handles autoplay + loop itself.
========================================================= */

function ReelVideo({ id }: { id: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-neutral-200">
      <iframe
        src={getYouTubeUrl(id)}
        title="Saree reel"
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

      {/* Invisible layer prevents iframe interaction */}
      <div className="absolute inset-0 z-10" />
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
  const [muted, setMuted] = useState(true);

  /*
   * NOTE:
   * Because the iframe itself is pointer-events-none,
   * YouTube controls cannot be clicked.
   *
   * The UI buttons belong to our application.
   */

  const toggleLike = (event: React.MouseEvent) => {
    event.stopPropagation();

    setLiked((value) => !value);
  };

  const toggleMute = (event: React.MouseEvent) => {
    event.stopPropagation();

    /*
     * A YouTube iframe cannot reliably be unmuted without
     * communicating with the YouTube player API.
     *
     * We therefore keep the visual button here but the
     * video remains muted for reliable autoplay.
     */
    setMuted((value) => !value);
  };

  const shareReel = async (event: React.MouseEvent) => {
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
      // User cancelled share.
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
      {/* =================================================
          VIDEO
      ================================================= */}

      <ReelVideo id={reel.id} />

      {/* =================================================
          TOP ACTIONS
      ================================================= */}

      <div className="absolute right-2.5 top-2.5 z-40 flex gap-1.5">
        {/* LIKE */}

        <button
          type="button"
          onClick={toggleLike}
          aria-label="Like reel"
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

        {/* MUTE */}

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Turn sound on" : "Mute sound"}
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
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>

        {/* FULLSCREEN */}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
          aria-label="Open reel"
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

      {/* =================================================
          SHARE
      ================================================= */}

      <button
        type="button"
        onClick={shareReel}
        aria-label="Share reel"
        className="
          absolute
          right-2.5
          bottom-24
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

      {/* =================================================
          GRADIENT
      ================================================= */}

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
      />

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-30
          p-3.5
          text-white
        "
      >
        <p
          className="
            text-[8px]
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

        <div
          className="
            mt-2.5
            flex
            items-center
            justify-between
            gap-2
            rounded-lg
            border
            border-white/15
            bg-white/10
            p-2
            backdrop-blur-lg
          "
        >
          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium">{reel.product}</p>

            <p className="mt-0.5 text-[9px] text-white/65">{reel.price}</p>
          </div>

          <button
            type="button"
            aria-label={`Shop ${reel.product}`}
            className="
              pointer-events-auto
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white
              text-black
              transition
              hover:bg-white/90
            "
          >
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   FULLSCREEN
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
        previous();
      }

      if (event.key === "ArrowRight") {
        next();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  /* =======================================================
     LOCK BODY
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
    >
      {/* CLOSE */}

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
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
          hover:bg-white/20
        "
      >
        <X size={19} />
      </button>

      {/* PREVIOUS */}

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
          hover:bg-white/20
          md:flex
        "
      >
        <ChevronLeft size={25} />
      </button>

      {/* NEXT */}

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
          hover:bg-white/20
          md:flex
        "
      >
        <ChevronRight size={25} />
      </button>

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

        {/* BLOCK ALL YOUTUBE INTERACTION */}

        <div className="absolute inset-0 z-20" />
      </div>

      {/* MOBILE NAV */}

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
          aria-label="Previous"
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
          "
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next"
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
          "
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN
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

    const gap = 20;

    const distance = firstCard.offsetWidth + gap;

    container.scrollBy({
      left: direction === "right" ? distance : -distance,
      behavior: "smooth",
    });
  };

  /* =======================================================
     END
  ======================================================= */

  const scrollToEnd = () => {
    const container = sliderRef.current;

    if (!container) return;

    container.scrollTo({
      left: container.scrollWidth,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section
        className="
          overflow-hidden
          bg-[#faf9f7]
          py-14
          sm:py-18
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
          {/* =================================================
              HEADER
          ================================================= */}

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
                <span className="h-px w-6 bg-neutral-400" />

                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-neutral-500
                  "
                >
                  Watch & Discover
                </p>
              </div>

              <h2
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
                "
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>

          {/* =================================================
              CAROUSEL
              
              MOBILE:
              1 card

              TABLET:
              2 cards

              DESKTOP:
              EXACTLY 4 cards
          ================================================= */}

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

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              mt-4
              flex
              items-center
              justify-between
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                text-[11px]
                text-neutral-400
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />

              <span className="sm:hidden">Swipe to explore</span>

              <span className="hidden sm:inline">Explore our latest reels</span>
            </div>

            <button
              type="button"
              onClick={scrollToEnd}
              className="
                group
                flex
                items-center
                gap-1.5
                border-b
                border-neutral-300
                pb-1
                text-[11px]
                font-medium
                text-neutral-700
                transition
                hover:border-neutral-900
                hover:text-neutral-900
              "
            >
              Explore all {reels.length} reels
              <ChevronRight
                size={13}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          FULLSCREEN
      ===================================================== */}

      {fullscreenIndex !== null && (
        <FullscreenViewer
          startIndex={fullscreenIndex}
          onClose={() => setFullscreenIndex(null)}
        />
      )}
    </>
  );
}
