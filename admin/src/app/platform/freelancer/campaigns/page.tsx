"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  Filter,
  IndianRupee,
  Search,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import { FaInstagram, FaYoutube } from "react-icons/fa";

import {
  useAcceptCampaignMutation,
  useGetAvailableCampaignsQuery,
  useGetMyCampaignsQuery,
  type Campaign,
  type CampaignPlatform,
  type CampaignFilters,
} from "@/store/api/campaignApi";

/* =========================================================
   PAGE
========================================================= */

export default function FreelancerCampaignsPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"available" | "my-campaigns">(
    "available",
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const [sort, setSort] = useState<
    "recommended" | "highest_payout" | "deadline"
  >("recommended");

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );

  /* =====================================================
     AVAILABLE CAMPAIGNS
  ===================================================== */

  const availableParams: CampaignFilters = {
    search: search.trim() || undefined,
    category: category !== "All Categories" ? category : undefined,
    sort,
  };

  const {
    data: availableCampaigns = [],
    isLoading: availableLoading,
    isError: availableError,
  } = useGetAvailableCampaignsQuery(availableParams);

  /* =====================================================
     MY CAMPAIGNS
  ===================================================== */

  const {
    data: myCampaigns = [],
    isLoading: myCampaignsLoading,
    isError: myCampaignsError,
  } = useGetMyCampaignsQuery();

  /* =====================================================
     ACCEPT CAMPAIGN
  ===================================================== */

  const [acceptCampaign, { isLoading: acceptingCampaign }] =
    useAcceptCampaignMutation();

  /* =====================================================
     DISPLAYED CAMPAIGNS
  ===================================================== */

  const displayedCampaigns = useMemo(() => {
    if (activeTab === "my-campaigns") {
      return myCampaigns;
    }

    return availableCampaigns;
  }, [activeTab, availableCampaigns, myCampaigns]);

  /* =====================================================
     OPEN CAMPAIGN
     
     IMPORTANT:
     
     - Available campaign -> detail page
     - Accepted campaign -> submit/workspace page
  ===================================================== */

  const handleOpenCampaign = (campaign: Campaign) => {
    if (activeTab === "my-campaigns") {
      router.push(`/platform/freelancer/campaigns/${campaign.id}/submit`);

      return;
    }

    router.push(`/platform/freelancer/campaigns/${campaign.id}`);
  };

  /* =====================================================
     ACCEPT CAMPAIGN
     
     IMPORTANT:
     
     After accepting, we DO NOT go to the normal detail
     page.
     
     We go directly to the campaign submission workspace.
  ===================================================== */

  const handleAcceptCampaign = async (campaign: Campaign) => {
    try {
      const result = await acceptCampaign(campaign.id).unwrap();

      if (!result.success) {
        throw new Error(result.message || "Failed to accept campaign");
      }

      /*
       * Campaign has now been accepted.
       *
       * Send freelancer to the submission workspace.
       */
      router.push(`/platform/freelancer/campaigns/${campaign.id}/submit`);
    } catch (error) {
      console.error("Failed to accept campaign:", error);

      if (error instanceof Error) {
        console.error("Message:", error.message);
      }
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  const isLoading =
    activeTab === "available" ? availableLoading : myCampaignsLoading;

  /* =====================================================
     ERROR
  ===================================================== */

  const isError = activeTab === "available" ? availableError : myCampaignsError;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-[1600px] p-5 sm:p-7 lg:p-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-700">
                <Sparkles size={11} />
                MYSMME Creator
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Campaigns
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Discover MYSMME campaigns, create content for your audience and
              earn from your creativity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness size={17} className="text-violet-600" />

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Available
                  </p>

                  <p className="text-sm font-bold text-slate-900">
                    {availableCampaigns.length} campaigns
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            TABS
        ================================================= */}

        <div className="mt-8 border-b border-slate-200">
          <div className="flex gap-6">
            {/* AVAILABLE */}

            <button
              type="button"
              onClick={() => setActiveTab("available")}
              className={`relative pb-4 text-sm font-semibold transition ${
                activeTab === "available"
                  ? "text-violet-600"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Available Campaigns
              {activeTab === "available" && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-violet-600" />
              )}
            </button>

            {/* MY CAMPAIGNS */}

            <button
              type="button"
              onClick={() => setActiveTab("my-campaigns")}
              className={`relative pb-4 text-sm font-semibold transition ${
                activeTab === "my-campaigns"
                  ? "text-violet-600"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              My Campaigns
              {myCampaigns.length > 0 && (
                <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] text-violet-700">
                  {myCampaigns.length}
                </span>
              )}
              {activeTab === "my-campaigns" && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-violet-600" />
              )}
            </button>
          </div>
        </div>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="mt-6 flex flex-col gap-3 xl:flex-row">
          {/* SEARCH */}

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search campaigns..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
            />
          </div>

          {/* CATEGORY */}

          <div className="relative">
            <Filter
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-12 min-w-[190px] appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none focus:border-violet-400"
            >
              <option>All Categories</option>
              <option>Festive</option>
              <option>Everyday</option>
              <option>Wedding</option>
              <option>New Arrivals</option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* SORT */}

          <div className="relative">
            <select
              value={sort}
              onChange={(event) =>
                setSort(
                  event.target.value as
                    | "recommended"
                    | "highest_payout"
                    | "deadline",
                )
              }
              className="h-12 min-w-[180px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 outline-none focus:border-violet-400"
            >
              <option value="recommended">Recommended</option>

              <option value="highest_payout">Highest Payout</option>

              <option value="deadline">Deadline</option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {isLoading && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[430px] animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!isLoading && isError && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-6 py-12 text-center">
            <h3 className="text-base font-semibold text-red-700">
              Unable to load campaigns
            </h3>

            <p className="mt-2 text-sm text-red-600">
              Something went wrong while loading campaigns. Please try again.
            </p>
          </div>
        )}

        {/* =================================================
            CAMPAIGN GRID
        ================================================= */}

        {!isLoading && !isError && displayedCampaigns.length > 0 && (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {displayedCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                accepted={activeTab === "my-campaigns"}
                accepting={acceptingCampaign}
                onView={() => {
                  /*
                   * IMPORTANT:
                   *
                   * If campaign is already accepted,
                   * clicking View Details opens the
                   * submission workspace.
                   */
                  if (activeTab === "my-campaigns") {
                    handleOpenCampaign(campaign);
                    return;
                  }

                  setSelectedCampaign(campaign);
                }}
                onAccept={() => handleAcceptCampaign(campaign)}
              />
            ))}
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!isLoading && !isError && displayedCampaigns.length === 0 && (
          <EmptyState
            myCampaigns={activeTab === "my-campaigns"}
            onBrowse={() => setActiveTab("available")}
          />
        )}

        {/* =================================================
            CREATOR TIP
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
              <Sparkles size={20} />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900">
                Creator tip
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Campaigns with authentic styling, strong storytelling and good
                audience engagement are more likely to be selected for future
                collaborations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/platform/freelancer/profile")}
              className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              Improve profile
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          AVAILABLE CAMPAIGN DETAILS MODAL
      ===================================================== */}

      {selectedCampaign && (
        <CampaignModal
          campaign={selectedCampaign}
          accepted={false}
          accepting={acceptingCampaign}
          onClose={() => setSelectedCampaign(null)}
          onAccept={() => handleAcceptCampaign(selectedCampaign)}
        />
      )}
    </div>
  );
}

/* =============================================================
   CAMPAIGN CARD
============================================================= */

function CampaignCard({
  campaign,
  accepted,
  accepting,
  onView,
  onAccept,
}: {
  campaign: Campaign;
  accepted: boolean;
  accepting: boolean;
  onView: () => void;
  onAccept: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg">
      {/* IMAGE */}

      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {campaign.productImage ? (
          <img
            src={campaign.productImage}
            alt={campaign.productName || campaign.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-100 to-fuchsia-100">
            <BriefcaseBusiness size={40} className="text-violet-400" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {campaign.category && (
          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-800 shadow-sm backdrop-blur">
              {campaign.category}
            </span>
          </div>
        )}

        <div className="absolute bottom-4 right-4 rounded-xl bg-black/55 px-3 py-2 text-white backdrop-blur-md">
          <p className="text-[9px] uppercase tracking-wide text-white/60">
            Earn
          </p>

          <p className="flex items-center gap-0.5 text-sm font-bold">
            <IndianRupee size={13} />

            {campaign.payout.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* CONTENT */}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">
              {campaign.title}
            </h3>

            {campaign.productName && (
              <p className="mt-1 truncate text-xs text-slate-400">
                {campaign.productName}
              </p>
            )}
          </div>

          {accepted && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
              <CheckCircle2 size={12} />
              Accepted
            </span>
          )}
        </div>

        {campaign.description && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
            {campaign.description}
          </p>
        )}

        {/* META */}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <InfoItem
            icon={<Video size={14} />}
            label="Reels"
            value={`${campaign.reelsRequired}`}
          />

          <InfoItem
            icon={<CalendarDays size={14} />}
            label="Deadline"
            value={campaign.deadline}
          />

          <InfoItem
            icon={<Users size={14} />}
            label="Reach"
            value={campaign.estimatedReach || "—"}
          />

          <InfoItem
            icon={<Clock3 size={14} />}
            label="Applicants"
            value={
              campaign.applicants !== undefined ? `${campaign.applicants}` : "—"
            }
          />
        </div>

        {/* PLATFORMS */}

        <div className="mt-4 flex items-center gap-2">
          <span className="text-[10px] text-slate-400">Publish on</span>

          {campaign.platforms.map((platform) => (
            <PlatformIcon key={platform} platform={platform} />
          ))}
        </div>

        {/* TAGS */}

        {campaign.tags && campaign.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {campaign.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-50 px-2 py-1 text-[9px] font-medium text-slate-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ACTIONS */}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onView}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >
            {accepted ? (
              <>
                <Video size={14} />
                Submit Content
              </>
            ) : (
              <>
                <Eye size={14} />
                View Details
              </>
            )}
          </button>

          {!accepted && (
            <button
              type="button"
              onClick={onAccept}
              disabled={accepting}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {accepting ? "Accepting..." : "Accept"}

              {!accepting && <ArrowRight size={14} />}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/* =============================================================
   INFO ITEM
============================================================= */

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-2.5">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}

        <span className="text-[9px]">{label}</span>
      </div>

      <p className="mt-1 truncate text-[11px] font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* =============================================================
   EMPTY STATE
============================================================= */

function EmptyState({
  myCampaigns,
  onBrowse,
}: {
  myCampaigns: boolean;
  onBrowse: () => void;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
        <BriefcaseBusiness size={24} />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        {myCampaigns ? "No campaigns accepted yet" : "No campaigns found"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {myCampaigns
          ? "Browse available MYSMME campaigns and accept your first collaboration."
          : "Try changing your search or filters to find more campaigns."}
      </p>

      {myCampaigns && (
        <button
          type="button"
          onClick={onBrowse}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
        >
          Browse Campaigns
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

/* =============================================================
   CAMPAIGN MODAL
============================================================= */

function CampaignModal({
  campaign,
  accepted,
  accepting,
  onClose,
  onAccept,
}: {
  campaign: Campaign;
  accepted: boolean;
  accepting: boolean;
  onClose: () => void;
  onAccept: () => void;
}) {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        {/* IMAGE */}

        <div className="relative aspect-[2/1] overflow-hidden bg-slate-100">
          {campaign.productImage ? (
            <img
              src={campaign.productImage}
              alt={campaign.productName || campaign.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-100 to-fuchsia-100">
              <BriefcaseBusiness size={56} className="text-violet-400" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute bottom-6 left-6 text-white">
            {campaign.category && (
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-md">
                {campaign.category}
              </span>
            )}

            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {campaign.title}
            </h2>

            {campaign.productName && (
              <p className="mt-1 text-sm text-white/75">
                {campaign.productName}
              </p>
            )}
          </div>
        </div>

        {/* BODY */}

        <div className="p-6 sm:p-8">
          {/* STATS */}

          <div className="grid gap-4 sm:grid-cols-4">
            <ModalStat
              label="Payout"
              value={`₹${campaign.payout.toLocaleString("en-IN")}`}
            />

            <ModalStat label="Reels" value={`${campaign.reelsRequired}`} />

            <ModalStat label="Deadline" value={campaign.deadline} />

            <ModalStat label="Reach" value={campaign.estimatedReach || "—"} />
          </div>

          {/* DESCRIPTION */}

          <div className="mt-8">
            <h3 className="text-base font-semibold text-slate-900">
              About this campaign
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {campaign.description || "No campaign description provided."}
            </p>
          </div>

          {/* REQUIREMENTS */}

          <div className="mt-7">
            <h3 className="text-base font-semibold text-slate-900">
              Content requirements
            </h3>

            <div className="mt-3 space-y-3">
              <Requirement>
                Create {campaign.reelsRequired} short-form reel
                {campaign.reelsRequired > 1 ? "s" : ""}
              </Requirement>

              <Requirement>
                Publish the content on {campaign.platforms.join(" and ")}
              </Requirement>

              <Requirement>
                Tag and mention MYSMME according to the campaign brief
              </Requirement>

              <Requirement>
                Submit the live social URLs through your MYSMME workspace
              </Requirement>

              <Requirement>
                Content must remain public for the required campaign period
              </Requirement>
            </div>
          </div>

          {/* PLATFORMS */}

          <div className="mt-7">
            <h3 className="text-base font-semibold text-slate-900">
              Required platforms
            </h3>

            <div className="mt-3 flex flex-wrap gap-3">
              {campaign.platforms.map((platform) => (
                <PlatformBadge key={platform} platform={platform} />
              ))}
            </div>
          </div>

          {/* FOOTER */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Close
            </button>

            {accepted ? (
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/platform/freelancer/campaigns/${campaign.id}/submit`,
                  )
                }
                className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700"
              >
                <Video size={16} />
                Submit Content
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={onAccept}
                disabled={accepting}
                className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {accepting ? "Accepting..." : "Accept Campaign"}

                {!accepting && <ArrowRight size={16} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   MODAL STAT
============================================================= */

function ModalStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

/* =============================================================
   REQUIREMENT
============================================================= */

function Requirement({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
      <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-500" />

      <p className="text-sm leading-5 text-slate-600">{children}</p>
    </div>
  );
}

/* =============================================================
   PLATFORM ICON
============================================================= */

function PlatformIcon({ platform }: { platform: CampaignPlatform }) {
  const isInstagram = platform === "Instagram";

  return (
    <span
      title={platform}
      aria-label={platform}
      className={`flex h-7 w-7 items-center justify-center rounded-full ${
        isInstagram ? "bg-pink-50 text-pink-600" : "bg-red-50 text-red-600"
      }`}
    >
      {isInstagram ? <FaInstagram size={14} /> : <FaYoutube size={14} />}
    </span>
  );
}

/* =============================================================
   PLATFORM BADGE
============================================================= */

function PlatformBadge({ platform }: { platform: CampaignPlatform }) {
  const isInstagram = platform === "Instagram";

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${
        isInstagram
          ? "border-pink-100 bg-pink-50 text-pink-600"
          : "border-red-100 bg-red-50 text-red-600"
      }`}
    >
      {isInstagram ? <FaInstagram size={17} /> : <FaYoutube size={17} />}

      {platform}
    </div>
  );
}
