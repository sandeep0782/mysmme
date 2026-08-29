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
YOUTUBE TYPES
========================================================= */

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

/* =========================================================
YOUTUBE API LOADER
Loaded only when a reel actually needs it.
========================================================= */

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeAPI() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise<void>((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");

    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;

    document.body.appendChild(script);
  });

  return youtubeApiPromise;
}

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
========================================================= */

function getYouTubeUrl(id: string, autoplay = false, muted = true) {
  const params = new URLSearchParams({
    enablejsapi: "1",
    autoplay: autoplay ? "1" : "0",
    mute: muted ? "1" : "0",
    controls: "0",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    cc_load_policy: "0",
    rel: "0",
    modestbranding: "1",
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
LAZY VIDEO
Only creates the iframe when close to viewport.
========================================================= */

function LazyYouTubeVideo({
  reelId,
  active,
  onPlayerReady,
}: {
  reelId: string;
  active: boolean;
  onPlayerReady?: (player: any) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);

  const [shouldLoad, setShouldLoad] = useState(false);

  /* -------------------------------------------------------
Detect nearby viewport
------------------------------------------------------- */

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    // Load immediately if already visible.
    const rect = element.getBoundingClientRect();

    if (
      rect.top < window.innerHeight * 1.5 &&
      rect.bottom > -window.innerHeight * 0.5
    ) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "600px 0px",
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  /* -------------------------------------------------------
Create player only after lazy load
------------------------------------------------------- */

  useEffect(() => {
    if (!shouldLoad || !iframeRef.current) {
      return;
    }

    let mounted = true;

    loadYouTubeAPI().then(() => {
      if (!mounted || !iframeRef.current || !window.YT?.Player) {
        return;
      }

      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (event: any) => {
            if (!mounted) {
              return;
            }

            const player = event.target;

            try {
              player.mute();
            } catch {}

            onPlayerReady?.(player);
          },
        },
      });
    });

    return () => {
      mounted = false;

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}

        playerRef.current = null;
      }
    };
  }, [shouldLoad, reelId, onPlayerReady]);

  /* -------------------------------------------------------
Play / pause
------------------------------------------------------- */

  useEffect(() => {
    const player = playerRef.current;

    if (!player || !active) {
      return;
    }

    try {
      player.mute();
      player.playVideo();
    } catch {}
  }, [active]);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-neutral-200">
      {shouldLoad ? (
        <iframe
          ref={iframeRef}
          src={getYouTubeUrl(reelId)}
          title="Reel video"
          loading="lazy"
          className="
         pointer-events-none
         absolute
         inset-0
         h-full
         w-full
         scale-[1.01]
         border-0
       "
          allow="autoplay; encrypted-media"
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-200" />
      )}{" "}
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
  const cardRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(false);
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(true);
  const [player, setPlayer] = useState<any>(null);

  /* =======================================================
VIEWPORT DETECTION
======================================================= */

  useEffect(() => {
    const element = cardRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.6;

        setActive(visible);

        if (!visible && player) {
          try {
            player.pauseVideo();
          } catch {}
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.6, 0.8, 1],
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [player]);

  /* =======================================================
MUTE
======================================================= */

  const toggleMute = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!player) {
      return;
    }

    try {
      if (muted) {
        player.unMute();
        setMuted(false);
      } else {
        player.mute();
        setMuted(true);
      }
    } catch {}
  };

  /* =======================================================
LIKE
======================================================= */

  const toggleLike = (event: React.MouseEvent) => {
    event.stopPropagation();

    setLiked((value) => !value);
  };

  /* =======================================================
SHARE
======================================================= */

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
    } catch {}
  };

  return (
    <article
      ref={cardRef}
      className="
     group
     relative
     aspect-[9/16]
     w-full
     overflow-hidden
     rounded-[22px]
     bg-neutral-100
     shadow-[0_10px_35px_rgba(0,0,0,0.08)]
     transition-all
     duration-500
     hover:-translate-y-1
     hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]
   "
    >
      {/* =================================================
LAZY VIDEO
================================================= */}

      <LazyYouTubeVideo
        reelId={reel.id}
        active={active}
        onPlayerReady={setPlayer}
      />

      {/* =================================================
      TOP ACTIONS
  ================================================= */}

      <div className="absolute right-3 top-3 z-30 flex gap-2">
        <button
          type="button"
          onClick={toggleLike}
          aria-label="Like reel"
          className={`
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        backdrop-blur-md
        transition-all
        duration-200
        ${
          liked
            ? "scale-110 bg-white text-red-500"
            : "bg-black/20 text-white hover:bg-black/40"
        }
      `}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
        </button>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Turn sound on" : "Mute sound"}
          className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        bg-black/20
        text-white
        backdrop-blur-md
        transition
        hover:bg-black/40
      "
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
          aria-label="Open reel"
          className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        bg-black/20
        text-white
        backdrop-blur-md
        transition
        hover:bg-black/40
      "
        >
          <Maximize2 size={15} />
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
      right-3
      bottom-[150px]
      z-30
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-full
      bg-black/20
      text-white
      backdrop-blur-md
      transition
      hover:scale-105
      hover:bg-black/40
    "
      >
        <Share2 size={17} />
      </button>

      {/* =================================================
      BOTTOM GRADIENT
  ================================================= */}

      <div
        className="
      pointer-events-none
      absolute
      inset-x-0
      bottom-0
      z-10
      h-64
      bg-gradient-to-t
      from-black/65
      via-black/10
      to-transparent
    "
      />

      {/* =================================================
      HOVER CONTENT
  ================================================= */}

      <div
        className="
      pointer-events-none
      absolute
      inset-x-0
      bottom-0
      z-30
      translate-y-3
      p-5
      text-white
      opacity-0
      transition-all
      duration-300
      group-hover:translate-y-0
      group-hover:opacity-100
    "
      >
        <p
          className="
        text-[9px]
        font-semibold
        uppercase
        tracking-[0.25em]
        text-white/70
      "
        >
          Style Inspiration
        </p>

        <h3 className="mt-2 text-lg font-medium tracking-tight sm:text-xl">
          {reel.title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-white/75 sm:text-sm">
          {reel.subtitle}
        </p>

        <div
          className="
        pointer-events-auto
        mt-4
        flex
        items-center
        justify-between
        gap-3
        rounded-xl
        border
        border-white/15
        bg-white/10
        p-3
        backdrop-blur-lg
      "
        >
          <div className="min-w-0">
            <p className="truncate text-xs font-medium">{reel.product}</p>

            <p className="mt-1 text-[11px] text-white/70">{reel.price}</p>
          </div>

          <button
            type="button"
            aria-label={`Shop ${reel.product}`}
            className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white
          text-black
          opacity-0
          scale-90
          transition-all
          duration-300
          group-hover:scale-100
          group-hover:opacity-100
          hover:bg-white/90
        "
          >
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
FULLSCREEN VIEWER
This intentionally loads the selected video immediately.
========================================================= */

function FullscreenViewer({
  startIndex,
  onClose,
}: {
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  const [muted, setMuted] = useState(true);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);

  const reel = reels[current];

  const previous = () => {
    setCurrent((value) => (value - 1 + reels.length) % reels.length);
    setMuted(true);
  };

  const next = () => {
    setCurrent((value) => (value + 1) % reels.length);
    setMuted(true);
  };

  /* =======================================================
FULLSCREEN PLAYER
======================================================= */

  useEffect(() => {
    let mounted = true;

    playerRef.current = null;

    loadYouTubeAPI().then(() => {
      if (!mounted || !iframeRef.current || !window.YT?.Player) {
        return;
      }

      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (event: any) => {
            if (!mounted) {
              return;
            }

            try {
              event.target.mute();
              event.target.playVideo();
            } catch {}
          },
        },
      });
    });

    return () => {
      mounted = false;

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}

        playerRef.current = null;
      }
    };
  }, [current]);

  /* =======================================================
MUTE
======================================================= */

  const toggleMute = () => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    try {
      if (muted) {
        player.unMute();
        setMuted(false);
      } else {
        player.mute();
        setMuted(true);
      }
    } catch {}
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
  }, []);

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
     overflow-hidden
     bg-black
   "
    >
      {" "}
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
       bg-black/40
       text-white
       backdrop-blur-md
       transition
       hover:bg-black/60
     "
      >
        {" "}
        <X size={19} />{" "}
      </button>
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
      md:flex
    "
      >
        <ChevronLeft size={25} />
      </button>
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
      md:flex
    "
      >
        <ChevronRight size={25} />
      </button>
      <div
        className="
      relative
      flex
      aspect-[9/16]
      h-[100dvh]
      max-h-[100dvh]
      w-auto
      max-w-[100vw]
      overflow-hidden
      bg-black
      sm:h-[94dvh]
      sm:max-h-[900px]
      sm:rounded-2xl
      sm:shadow-2xl
    "
      >
        <iframe
          ref={iframeRef}
          key={reel.id}
          src={getYouTubeUrl(reel.id, true, true)}
          title="Reel video"
          className="
        absolute
        inset-0
        h-full
        w-full
        border-0
      "
          allow="autoplay; encrypted-media"
        />

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Turn sound on" : "Mute"}
          className="
        absolute
        right-4
        top-4
        z-30
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        bg-black/35
        text-white
        backdrop-blur-md
        transition
        hover:bg-black/55
      "
        >
          {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
      </div>
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
        bg-black/40
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
        bg-black/40
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
MAIN REELS
========================================================= */

export default function Reels() {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollReels = (direction: "left" | "right") => {
    const container = sliderRef.current;

    if (!container) {
      return;
    }

    const firstCard = container.querySelector<HTMLElement>("[data-reel-card]");

    const cardWidth = firstCard?.offsetWidth ?? container.clientWidth * 0.25;

    const distance = cardWidth + 20;

    container.scrollBy({
      left: direction === "right" ? distance : -distance,
      behavior: "smooth",
    });
  };

  const scrollToEnd = () => {
    const container = sliderRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      left: container.scrollWidth,
      behavior: "smooth",
    });
  };

  return (
    <>
      {" "}
      <section
        className="
       overflow-hidden
       bg-[#faf9f7]
       py-16
       sm:py-20
       lg:py-24
     "
      >
        {" "}
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
          mb-8
          flex
          items-end
          justify-between
          gap-6
          sm:mb-10
        "
          >
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px w-7 bg-neutral-400" />

                <p
                  className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.28em]
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
              mt-3
              max-w-xl
              text-sm
              leading-6
              text-neutral-500
              sm:text-base
            "
              >
                Discover beautiful drapes, styling inspiration and our latest
                saree looks.
              </p>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <button
                type="button"
                onClick={() => scrollReels("left")}
                aria-label="Previous reels"
                className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-neutral-200
              bg-white
              text-neutral-800
              shadow-sm
              transition-all
              hover:border-neutral-900
              hover:bg-neutral-900
              hover:text-white
            "
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => scrollReels("right")}
                aria-label="Next reels"
                className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-neutral-200
              bg-white
              text-neutral-800
              shadow-sm
              transition-all
              hover:border-neutral-900
              hover:bg-neutral-900
              hover:text-white
            "
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* CAROUSEL */}

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
            pb-5
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
                min-w-[78%]
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

          <div
            className="
          mt-5
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
            text-xs
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
            gap-2
            border-b
            border-neutral-300
            pb-1
            text-xs
            font-medium
            text-neutral-700
            transition
            hover:border-neutral-900
            hover:text-neutral-900
          "
            >
              Explore all {reels.length} reels
              <ChevronRight
                size={14}
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
      {fullscreenIndex !== null && (
        <FullscreenViewer
          startIndex={fullscreenIndex}
          onClose={() => setFullscreenIndex(null)}
        />
      )}
    </>
  );
}
