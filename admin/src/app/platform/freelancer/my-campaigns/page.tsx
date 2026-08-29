"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileVideo,
  IndianRupee,
  Loader2,
  Search,
  Upload,
  Video,
} from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";

import {
  useGetMyCampaignsQuery,
  type FreelancerCampaign,
} from "@/store/api/campaignApi";

/* =========================================================
   TYPES
========================================================= */

type CampaignStatus =
  | "accepted"
  | "in_progress"
  | "submitted"
  | "approved"
  | "completed";

type Platform = "Instagram" | "YouTube";

/* =========================================================
   HELPERS
========================================================= */

function getCampaignStatus(campaign: FreelancerCampaign): CampaignStatus {
  /*
   * Your Campaign API currently does not expose a `status`
   * field in FreelancerCampaign.
   *
   * Until backend adds status, we derive it from dates.
   */
  if (campaign.completedAt) {
    return "completed";
  }

  if (campaign.startedAt) {
    return "in_progress";
  }

  return "accepted";
}

function getProgress(campaign: FreelancerCampaign, submittedReels = 0) {
  const required = Math.max(campaign.reelsRequired || 0, 1);

  return Math.min(100, Math.round((submittedReels / required) * 100));
}

/* =========================================================
   PAGE
========================================================= */

export default function FreelancerMyCampaignsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<"all" | CampaignStatus>(
    "all",
  );

  /* =====================================================
     API
  ===================================================== */

  const {
    data: myCampaigns = [],
    isLoading,
    isError,
    refetch,
  } = useGetMyCampaignsQuery();

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredCampaigns = useMemo(() => {
    let result = [...myCampaigns];

    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter((campaign) => {
        return (
          campaign.title.toLowerCase().includes(query) ||
          campaign.productName?.toLowerCase().includes(query) ||
          campaign.category?.toLowerCase().includes(query)
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (campaign) => getCampaignStatus(campaign) === statusFilter,
      );
    }

    return result;
  }, [myCampaigns, search, statusFilter]);

  /* =====================================================
     STATS
  ===================================================== */

  const totalEarnings = myCampaigns.reduce(
    (total, campaign) => total + Number(campaign.payout || 0),
    0,
  );

  const requiredReels = myCampaigns.reduce(
    (total, campaign) => total + Number(campaign.reelsRequired || 0),
    0,
  );

  /*
   * IMPORTANT:
   *
   * Campaign API currently doesn't return reelsSubmitted.
   *
   * Therefore we cannot accurately calculate submitted reels
   * from campaignApi alone.
   *
   * For now this remains 0 until we connect getMyReels.
   */
  const completedReels = 0;

  const awaitingReview = 0;

  /* =====================================================
     LOADING
  ===================================================== */

  if (isLoading) {
    return (
      <div className="min-h-full bg-slate-50">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 size={20} className="animate-spin text-violet-600" />
            Loading your campaigns...
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (isError) {
    return (
      <div className="min-h-full bg-slate-50">
        <div className="mx-auto max-w-[1600px] p-5 sm:p-7 lg:p-8">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
            <h2 className="text-base font-semibold text-red-800">
              Unable to load your campaigns
            </h2>

            <p className="mt-2 text-sm text-red-600">
              Something went wrong while loading your accepted campaigns.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-[1600px] p-5 sm:p-7 lg:p-8">
        {/* HEADER */}

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-700">
              MYSMME Creator
            </span>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Campaigns
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your accepted campaigns, submit reels and track your
              collaboration progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/platform/freelancer/campaigns")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
          >
            Browse Campaigns
            <ArrowRight size={16} />
          </button>
        </div>

        {/* STATS */}

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Active Campaigns"
            value={`${myCampaigns.length}`}
            icon={<Video size={19} />}
            color="violet"
          />

          <StatCard
            label="Reels Submitted"
            value={`${completedReels}/${requiredReels}`}
            icon={<FileVideo size={19} />}
            color="blue"
          />

          <StatCard
            label="Awaiting Review"
            value={`${awaitingReview}`}
            icon={<Clock3 size={19} />}
            color="amber"
          />

          <StatCard
            label="Campaign Value"
            value={`₹${totalEarnings.toLocaleString("en-IN")}`}
            icon={<IndianRupee size={19} />}
            color="emerald"
          />
        </div>

        {/* FILTERS */}

        <div className="mt-8 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search my campaigns..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | CampaignStatus)
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-violet-400"
          >
            <option value="all">All Status</option>
            <option value="accepted">Accepted</option>
            <option value="in_progress">In Progress</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* CAMPAIGNS */}

        {filteredCampaigns.length > 0 ? (
          <div className="mt-6 space-y-5">
            {filteredCampaigns.map((campaign) => (
              <MyCampaignCard
                key={campaign.id}
                campaign={campaign}
                onView={() =>
                  router.push(`/platform/freelancer/campaigns/${campaign.id}`)
                }
                onSubmit={() =>
                  router.push(
                    `/platform/freelancer/campaigns/${campaign.id}/submit`,
                  )
                }
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
              <Video size={24} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              No campaigns found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Try changing your search or status filter.
            </p>
          </div>
        )}
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
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: "violet" | "blue" | "amber" | "emerald";
}) {
  const colors = {
    violet: "bg-violet-50 text-violet-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-xs font-medium text-slate-500">{label}</p>

      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

/* =========================================================
   CAMPAIGN CARD
========================================================= */

function MyCampaignCard({
  campaign,
  onView,
  onSubmit,
}: {
  campaign: FreelancerCampaign;
  onView: () => void;
  onSubmit: () => void;
}) {
  const status = getCampaignStatus(campaign);

  /*
   * Campaign API does not currently provide submitted reel count.
   *
   * This will be replaced with real reel data when we connect
   * getMyReels.
   */
  const reelsSubmitted = 0;

  const reelsRequired = campaign.reelsRequired || 0;

  const progress = getProgress(campaign, reelsSubmitted);

  const canSubmit = status !== "completed" && reelsSubmitted < reelsRequired;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-violet-200 hover:shadow-md">
      <div className="flex flex-col lg:flex-row">
        {/* IMAGE */}

        <div className="relative h-56 shrink-0 bg-slate-100 lg:h-auto lg:w-72">
          {campaign.productImage ? (
            <img
              src={campaign.productImage}
              alt={campaign.productName || campaign.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-56 items-center justify-center text-slate-300">
              <Video size={42} />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {campaign.category && (
            <div className="absolute left-4 top-4">
              <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-800 shadow-sm">
                {campaign.category}
              </span>
            </div>
          )}

          <div className="absolute bottom-4 left-4">
            <p className="text-[10px] uppercase tracking-wide text-white/70">
              Campaign Value
            </p>

            <p className="flex items-center gap-1 text-lg font-bold text-white">
              <IndianRupee size={16} />

              {Number(campaign.payout || 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* CONTENT */}

        <div className="min-w-0 flex-1 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {campaign.title}
                </h2>

                <StatusBadge status={status} />
              </div>

              <p className="mt-1 text-xs text-slate-400">
                {campaign.productName || "Campaign"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(campaign.platforms || []).map((platform) => (
                <PlatformIcon key={platform} platform={platform} />
              ))}
            </div>
          </div>

          {/* META */}

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MetaItem
              icon={<CalendarDays size={15} />}
              label="Deadline"
              value={formatDate(campaign.deadline)}
            />

            <MetaItem
              icon={<Video size={15} />}
              label="Reels"
              value={`${reelsSubmitted}/${reelsRequired}`}
            />

            <MetaItem
              icon={<Clock3 size={15} />}
              label="Accepted"
              value={formatDate(campaign.acceptedAt)}
            />
          </div>

          {/* PROGRESS */}

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-700">
                Content Progress
              </p>

              <p className="text-xs font-semibold text-violet-600">
                {progress}%
              </p>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-violet-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* FOOTER */}

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {reelsSubmitted >= reelsRequired ? (
                <>
                  <CheckCircle2 size={16} className="text-emerald-500" />

                  <span className="text-xs font-medium text-emerald-600">
                    All required reels submitted
                  </span>
                </>
              ) : (
                <>
                  <Clock3 size={16} className="text-amber-500" />

                  <span className="text-xs font-medium text-amber-600">
                    {reelsRequired - reelsSubmitted} reel
                    {reelsRequired - reelsSubmitted > 1 ? "s" : ""} remaining
                  </span>
                </>
              )}
            </div>

            <div className="flex gap-2">
              {/* VIEW */}

              <button
                type="button"
                onClick={onView}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                <Eye size={14} />
                View Campaign
              </button>

              {/* SUBMIT */}

              {canSubmit && (
                <button
                  type="button"
                  onClick={onSubmit}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-700"
                >
                  <Upload size={14} />
                  Submit Content
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   META ITEM
========================================================= */

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}

        <span className="text-[10px]">{label}</span>
      </div>

      <p className="mt-1 truncate text-xs font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({ status }: { status: CampaignStatus }) {
  const config: Record<
    CampaignStatus,
    {
      label: string;
      className: string;
    }
  > = {
    accepted: {
      label: "Accepted",
      className: "bg-blue-50 text-blue-600",
    },

    in_progress: {
      label: "In Progress",
      className: "bg-violet-50 text-violet-600",
    },

    submitted: {
      label: "Under Review",
      className: "bg-amber-50 text-amber-600",
    },

    approved: {
      label: "Approved",
      className: "bg-emerald-50 text-emerald-600",
    },

    completed: {
      label: "Completed",
      className: "bg-emerald-50 text-emerald-600",
    },
  };

  const item = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${item.className}`}
    >
      {status === "submitted" ? (
        <Clock3 size={11} />
      ) : status === "approved" || status === "completed" ? (
        <CheckCircle2 size={11} />
      ) : (
        <Video size={11} />
      )}

      {item.label}
    </span>
  );
}

/* =========================================================
   PLATFORM ICON
========================================================= */

function PlatformIcon({ platform }: { platform: Platform }) {
  const isInstagram = platform === "Instagram";

  return (
    <span
      title={platform}
      className={`flex h-8 w-8 items-center justify-center rounded-full ${
        isInstagram ? "bg-pink-50 text-pink-600" : "bg-red-50 text-red-600"
      }`}
    >
      {isInstagram ? <FaInstagram size={15} /> : <FaYoutube size={15} />}
    </span>
  );
}

/* =========================================================
   DATE
========================================================= */

function formatDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
