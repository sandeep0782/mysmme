"use client";

import React from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Play,
  Sparkles,
  TrendingUp,
  Upload,
  Video,
} from "lucide-react";
import { useGetMyCampaignsQuery } from "@/store/api/campaignApi";
import { useGetMyReelsQuery } from "@/store/api/reelApi";

const FreelancerDashboard = () => {
  const router = useRouter();
  const { data, isLoading } = useGetMyCampaignsQuery();
  const campaignCount = data?.length || 0;

  const { data: reels = [], isLoading: reelsLoading } = useGetMyReelsQuery();
  const reelCount = reels.length;

  const pendingReviewCount = reels.filter(
    (reel) => reel.status === "submitted" || reel.status === "under_review",
  ).length;

  const approvedReelCount = reels.filter(
    (reel) => reel.status === "approved",
  ).length;

  return (
    <div className="min-h-full">
      {/* =====================================================
                CONTENT
            ===================================================== */}

      <div className="mx-auto max-w-[1600px] p-5 sm:p-7 lg:p-8">
        {/* =================================================
                    WELCOME
                ================================================= */}

        <section className="mb-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-violet-700">
                <Sparkles size={12} />
                Creator
              </span>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Welcome to <span className="text-red-700">MYSMME </span>
                Creator Studio
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Discover campaigns, create beautiful saree content, publish it
                to your audience and earn with MYSMME.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/platform/freelancer/reels/submit")}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              <Upload size={17} />
              Submit a Reel
            </button>
          </div>
        </section>

        {/* STATS */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Active Campaigns"
            value={isLoading ? "..." : String(campaignCount)}
            icon={<BriefcaseBusiness size={20} />}
            color="violet"
          />

          <StatCard
            label="Reels Submitted"
            value={isLoading ? "..." : String(reelCount)}
            icon={<Video size={20} />}
            color="blue"
          />

          <StatCard
            label="Pending Review"
            value={reelsLoading ? "..." : String(pendingReviewCount)}
            icon={<Clock3 size={20} />}
            color="amber"
          />

          <StatCard
            label="Total Earnings"
            value="₹0"
            icon={<CircleDollarSign size={20} />}
            color="emerald"
          />
        </section>
        {/* =================================================
                    MAIN GRID
                ================================================= */}

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          {/* =================================================
                        ACTIVE CAMPAIGNS
                    ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Available Campaigns
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Find campaigns that match your content style.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/platform/freelancer/campaigns")}
                className="hidden items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700 sm:flex"
              >
                View all
                <ArrowRight size={15} />
              </button>
            </div>
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <BriefcaseBusiness size={21} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Available Campaigns
                    </p>

                    <h3 className="mt-1 text-2xl font-bold text-slate-900">
                      {isLoading ? "..." : campaignCount}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/platform/freelancer/campaigns")}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-600"
                >
                  Browse Campaigns
                  <ArrowRight size={14} />
                </button>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                {campaignCount > 0
                  ? `You have ${campaignCount} campaign${campaignCount === 1 ? "" : "s"} available to explore.`
                  : "New campaigns will appear here when they're available for you."}
              </p>
            </div>
          </section>

          {/* =================================================
                        CREATOR PROFILE
                    ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Creator Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Build your creator presence.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/platform/freelancer/profile")}
                className="text-sm font-medium text-violet-600 hover:text-violet-700"
              >
                Edit
              </button>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xl font-bold text-white">
                F
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Your Creator Profile
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Complete your profile to get better campaigns.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-slate-500">Profile completion</span>

                <span className="font-semibold text-violet-600">20%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[20%] rounded-full bg-violet-600" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/platform/freelancer/profile")}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Complete Profile
              <ArrowRight size={15} />
            </button>
          </section>
        </div>

        {/* =================================================
                    REELS + EARNINGS
                ================================================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* REELS */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Your Reels
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track your submitted content.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/platform/freelancer/reels")}
                className="flex items-center gap-1 text-sm font-medium text-violet-600"
              >
                View
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <MiniStat
                label="Submitted"
                value={reelsLoading ? "..." : String(reelCount)}
              />
              <MiniStat
                label="Approved"
                value={reelsLoading ? "..." : String(approvedReelCount)}
              />
              <MiniStat label="Views" value="0" />
            </div>

            <div className="mt-4 flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
              <div className="mt-4">
                {reelsLoading ? (
                  <div className="flex min-h-28 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                    <p className="text-xs text-slate-400">Loading reels...</p>
                  </div>
                ) : reels.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {reels.slice(0, 4).map((reel) => (
                      <button
                        key={reel.id}
                        type="button"
                        onClick={() =>
                          router.push(`/platform/freelancer/reels/${reel.id}`)
                        }
                        className="group relative aspect-video overflow-hidden rounded-xl bg-slate-100"
                      >
                        {reel.videoUrl ? (
                          <video
                            src={reel.videoUrl}
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Video size={20} className="text-slate-300" />
                          </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm transition group-hover:opacity-100">
                            <Play
                              size={15}
                              className="ml-0.5 text-violet-600"
                              fill="currentColor"
                            />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
                    <div className="text-center">
                      <Play size={20} className="mx-auto text-slate-300" />

                      <p className="mt-2 text-xs text-slate-400">
                        Your submitted reels will appear here.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* EARNINGS */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Earnings Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track your creator income.
                </p>
              </div>

              <TrendingUp size={20} className="text-emerald-500" />
            </div>

            <div className="mt-6">
              <p className="text-3xl font-bold text-slate-900">₹0</p>

              <p className="mt-1 text-xs text-slate-400">Total earnings</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <MiniStat label="Pending" value="₹0" />

              <MiniStat label="Paid" value="₹0" />
            </div>
          </section>
        </div>

        {/* =================================================
                    HOW IT WORKS
                ================================================= */}

        <section className="mt-6 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-6">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-600">
              How it works
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Create. Publish. Earn.
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Pick a campaign, create your reel, publish it on your social
              accounts and submit the links to MySareeMe.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Step
              number="01"
              title="Choose a campaign"
              description="Find a campaign that fits your audience and content style."
            />

            <Step
              number="02"
              title="Create & publish"
              description="Create your reel and publish it on your social channels."
            />

            <Step
              number="03"
              title="Submit & earn"
              description="Submit your post links, get approved and earn."
            />
          </div>
        </section>

        {/* MOBILE QUICK LINK */}

        <button
          type="button"
          onClick={() => router.push("/platform/freelancer/campaigns")}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 sm:hidden"
        >
          Browse Campaigns
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

/* =============================================================
   STAT CARD
============================================================= */

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
    violet: {
      bg: "bg-violet-50",
      text: "text-violet-600",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
  };

  const theme = colors[color];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme.bg} ${theme.text}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   MINI STAT
============================================================= */

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">{label}</p>

      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

/* =============================================================
   STEP
============================================================= */

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white bg-white/80 p-5 shadow-sm">
      <span className="text-xs font-bold tracking-widest text-violet-500">
        {number}
      </span>

      <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>

      <div className="mt-4 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 size={15} />
      </div>
    </div>
  );
}

export default FreelancerDashboard;
