"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileVideo,
  Loader2,
  Pause,
  Play,
  Plus,
  Sparkles,
  Volume2,
  VolumeX,
  XCircle,
} from "lucide-react";

import { useGetMyReelsQuery } from "@/store/api/reelApi";

/* =========================================================
   TYPES
========================================================= */

type Reel = {
  id?: string;
  _id?: string;

  campaignId?: string;

  title?: string;
  caption?: string;

  videoUrl?: string;
  thumbnailUrl?: string;

  instagramUrl?: string;
  youtubeUrl?: string;

  status?: string;
  featured?: boolean;
  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
};

/* =========================================================
   HELPERS
========================================================= */

function getReelId(reel: Reel): string {
  return String(reel.id ?? reel._id ?? "");
}

function getStatusConfig(status?: string) {
  switch (status) {
    case "submitted":
      return {
        label: "Submitted",
        className: "bg-blue-50 text-blue-700 border-blue-100",
        icon: <CheckCircle2 size={14} />,
      };

    case "under_review":
      return {
        label: "Under Review",
        className: "bg-amber-50 text-amber-700 border-amber-100",
        icon: <Clock3 size={14} />,
      };

    case "approved":
      return {
        label: "Approved",
        className: "bg-emerald-50 text-emerald-700 border-emerald-100",
        icon: <CheckCircle2 size={14} />,
      };

    case "rejected":
      return {
        label: "Rejected",
        className: "bg-red-50 text-red-700 border-red-100",
        icon: <XCircle size={14} />,
      };

    case "changes_requested":
      return {
        label: "Changes Requested",
        className: "bg-orange-50 text-orange-700 border-orange-100",
        icon: <XCircle size={14} />,
      };

    case "published":
      return {
        label: "Published",
        className: "bg-violet-50 text-violet-700 border-violet-100",
        icon: <CheckCircle2 size={14} />,
      };

    default:
      return {
        label: "Draft",
        className: "bg-slate-100 text-slate-600 border-slate-200",
        icon: <FileVideo size={14} />,
      };
  }
}

function formatDate(date?: string) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getYouTubeEmbedUrl(url?: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    /*
     * https://www.youtube.com/watch?v=VIDEO_ID
     */
    if (
      parsed.hostname.includes("youtube.com") &&
      parsed.pathname === "/watch"
    ) {
      const videoId = parsed.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      }
    }

    /*
     * https://youtu.be/VIDEO_ID
     */
    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.replace("/", "");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      }
    }

    /*
     * Already an embed URL
     */
    if (
      parsed.hostname.includes("youtube.com") &&
      parsed.pathname.startsWith("/embed/")
    ) {
      return url;
    }

    return null;
  } catch {
    return null;
  }
}

function isDirectVideoUrl(url?: string) {
  if (!url) return false;

  try {
    const parsed = new URL(url);

    const pathname = parsed.pathname.toLowerCase();

    return (
      pathname.endsWith(".mp4") ||
      pathname.endsWith(".webm") ||
      pathname.endsWith(".ogg") ||
      pathname.endsWith(".mov") ||
      pathname.endsWith(".m4v")
    );
  } catch {
    return false;
  }
}

/* =========================================================
   VIDEO PLAYER
========================================================= */

function ReelPlayer({ reel }: { reel: Reel }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const youtubeEmbedUrl = useMemo(
    () => getYouTubeEmbedUrl(reel.videoUrl),
    [reel.videoUrl],
  );

  const directVideo = isDirectVideoUrl(reel.videoUrl);

  /*
   * YOUTUBE
   */
  if (youtubeEmbedUrl) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-black">
        <iframe
          src={youtubeEmbedUrl}
          title={reel.title || "Campaign reel"}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />

        <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
          YouTube
        </div>
      </div>
    );
  }

  /*
   * DIRECT VIDEO
   */
  if (directVideo && reel.videoUrl) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-black">
        <video
          src={reel.videoUrl}
          poster={reel.thumbnailUrl || undefined}
          className="h-full w-full object-cover"
          playsInline
          muted={isMuted}
          loop
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Custom top controls */}

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span className="rounded-full bg-black/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            Video
          </span>

          <button
            type="button"
            onClick={() => setIsMuted((value) => !value)}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        {!isPlaying && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-violet-600 shadow-xl">
              <Play size={21} fill="currentColor" className="ml-0.5" />
            </div>
          </div>
        )}
      </div>
    );
  }

  /*
   * FALLBACK
   */
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-gradient-to-br from-violet-100 via-slate-100 to-indigo-100"
      style={
        reel.thumbnailUrl
          ? {
              backgroundImage: `url("${reel.thumbnailUrl}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/90 text-violet-600 shadow-xl backdrop-blur">
          <FileVideo size={28} />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="rounded-xl bg-black/55 p-3 text-xs text-white backdrop-blur">
          Video preview unavailable
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function FreelancerReelsPage() {
  const router = useRouter();

  const {
    data: reels = [],
    isLoading,
    isError,
  } = useGetMyReelsQuery() as {
    data?: Reel[];
    isLoading: boolean;
    isError: boolean;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 size={20} className="animate-spin text-violet-600" />
          Loading your reels...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-full bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">
            <div className="flex items-center gap-3">
              <XCircle size={20} />

              <div>
                <h2 className="font-semibold">Unable to load your reels</h2>

                <p className="mt-1 text-sm text-red-600">
                  Please refresh the page and try again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const submittedCount = reels.filter((reel) =>
    ["submitted", "under_review", "approved", "published"].includes(
      reel.status ?? "",
    ),
  ).length;

  const draftCount = reels.filter((reel) => reel.status === "draft").length;

  const approvedCount = reels.filter((reel) =>
    ["approved", "published"].includes(reel.status ?? ""),
  ).length;

  return (
    <div className="min-h-full bg-[#f8f9fc]">
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-violet-700">
              <Sparkles size={12} />
              Creator Studio
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Reels
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Watch, manage, edit and track all your campaign reel submissions
              from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/platform/freelancer/my-campaigns")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md"
          >
            <Plus size={17} />
            Create Reel
          </button>
        </div>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Reels"
            value={reels.length}
            icon={<FileVideo size={20} />}
            iconClass="bg-violet-50 text-violet-600"
          />

          <StatCard
            label="Submitted"
            value={submittedCount}
            icon={<Clock3 size={20} />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="Approved"
            value={approvedCount}
            icon={<CheckCircle2 size={20} />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            label="Drafts"
            value={draftCount}
            icon={<FileVideo size={20} />}
            iconClass="bg-slate-100 text-slate-600"
          />
        </div>

        {/* =====================================================
            REELS
        ===================================================== */}

        <div className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Your Submissions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Preview your campaign content directly here.
              </p>
            </div>

            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200">
              {reels.length} {reels.length === 1 ? "Reel" : "Reels"}
            </span>
          </div>

          {reels.length === 0 ? (
            <EmptyState
              onCreate={() => router.push("/platform/freelancer/my-campaigns")}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {reels.map((reel) => {
                const status = getStatusConfig(reel.status);
                const reelId = getReelId(reel);

                return (
                  <article
                    key={reelId || `${reel.campaignId}-${reel.createdAt}`}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* =================================================
                        VIDEO
                    ================================================= */}

                    <div className="relative h-[390px] overflow-hidden bg-black sm:h-[430px]">
                      <ReelPlayer reel={reel} />

                      {/* STATUS */}

                      <div className="absolute right-4 top-4 z-20">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold shadow-lg backdrop-blur ${status.className}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-bold text-slate-900">
                            {reel.title || "Untitled Reel"}
                          </h3>

                          {reel.caption && (
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                              {reel.caption}
                            </p>
                          )}
                        </div>

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                          <Play size={15} fill="currentColor" />
                        </div>
                      </div>

                      {/* META */}

                      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
                        <CalendarDays size={14} />

                        <span>{formatDate(reel.createdAt)}</span>
                      </div>

                      {/* ACTION */}

                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          disabled={!reelId}
                          onClick={() => {
                            if (!reelId) return;

                            router.push(
                              `/platform/freelancer/reels/${reelId}/edit`,
                            );
                          }}
                          className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span>
                            {reel.status === "draft"
                              ? "Continue Editing"
                              : "View / Edit Submission"}
                          </span>

                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  icon,
  iconClass,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium text-slate-400">{label}</p>

        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
        <FileVideo size={28} />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        No reels yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Start creating content for one of your active campaigns. Your submitted
        reels will appear here.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
      >
        <Plus size={17} />
        Find a Campaign
      </button>
    </div>
  );
}
