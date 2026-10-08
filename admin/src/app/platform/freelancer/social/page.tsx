"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  Heart,
  Link2,
  Loader2,
  MousePointerClick,
  Play,
  Plus,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";

import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaTiktok,
  FaPinterest,
} from "react-icons/fa";

/* ================================================================



   TYPES



================================================================ */

type SocialPlatform =
  | "Instagram"
  | "Facebook"
  | "YouTube"
  | "TikTok"
  | "Pinterest";

type SocialAccount = {
  _id: string;

  platform: SocialPlatform;

  username: string;

  profileUrl?: string;

  followers?: number;

  views?: number;

  engagement?: number;

  growth?: number;

  reach?: number;

  likes?: number;

  comments?: number;

  shares?: number;

  saves?: number;

  mediaCount?: number;

  creatorScore?: number;

  creatorStatus?: "Basic" | "Verified" | "In Review" | "Active" | "Inactive";

  isVerified?: boolean;

  instagramAccountId?: string;

  lastSyncedAt?: string;

  nextSyncAt?: string;

  syncStatus?: "idle" | "success" | "failed";

  syncError?: string;

  createdAt?: string;

  updatedAt?: string;
};

type SocialAccountApiResponse = {
  success?: boolean;

  message?: string;

  data?: SocialAccount[] | SocialAccount;
};

/* ================================================================



   DEMO CAMPAIGN DATA



   We can connect this with API later.



================================================================ */

const topContent = [
  {
    title: "Royal Banarasi Styling",

    platform: "Instagram",

    views: 28400,

    likes: 2840,

    shares: 420,

    saves: 186,

    sales: 6999,

    royalty: 699.9,
  },

  {
    title: "Festive Saree Look",

    platform: "Instagram",

    views: 18200,

    likes: 1980,

    shares: 290,

    saves: 120,

    sales: 4999,

    royalty: 499.9,
  },

  {
    title: "Wedding Guest Saree",

    platform: "Instagram",

    views: 11800,

    likes: 1240,

    shares: 180,

    saves: 94,

    sales: 3999,

    royalty: 319.92,
  },
];

const campaignPerformance = [
  {
    campaign: "Royal Banarasi Collection",

    reels: 2,

    views: 28400,

    clicks: 386,

    orders: 8,

    sales: 6999,

    royalty: 699.9,
  },

  {
    campaign: "Festive Saree Edit",

    reels: 1,

    views: 18200,

    clicks: 294,

    orders: 6,

    sales: 4999,

    royalty: 499.9,
  },

  {
    campaign: "Wedding Collection",

    reels: 3,

    views: 11800,

    clicks: 214,

    orders: 4,

    sales: 3999,

    royalty: 319.92,
  },
];

const audienceData = [
  { month: "Mar", value: 6200 },

  { month: "Apr", value: 7100 },

  { month: "May", value: 7900 },

  { month: "Jun", value: 9200 },

  { month: "Jul", value: 10800 },

  { month: "Aug", value: 12800 },
];

/* ================================================================



   PAGE



================================================================ */

const FreelancerSocial = () => {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);

  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatform>("Instagram");

  const [socialUsername, setSocialUsername] = useState("");

  const [socialProfileUrl, setSocialProfileUrl] = useState("");

  const [socialFollowers, setSocialFollowers] = useState("");

  const [isConnecting, setIsConnecting] = useState(false);

  const [formError, setFormError] = useState("");

  const [syncingAccountId, setSyncingAccountId] = useState<string | null>(null);

  const [syncMessage, setSyncMessage] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  /* ================================================================



     FETCH SOCIAL ACCOUNTS



  ================================================================ */

  const fetchSocialAccounts = async () => {
    try {
      setIsLoadingAccounts(true);

      const url = `${API_URL}/freelancer/social-account`;

      console.log("GET SOCIAL ACCOUNTS:", url);

      const res = await fetch(url, {
        method: "GET",

        credentials: "include",

        cache: "no-store",
      });

      const raw = await res.text();

      let result: SocialAccountApiResponse | null = null;

      try {
        result = raw ? JSON.parse(raw) : null;
      } catch {
        console.error("INVALID SOCIAL ACCOUNT RESPONSE:", raw);
      }

      if (!res.ok) {
        if (res.status === 404) {
          setSocialAccounts([]);

          return;
        }

        throw new Error(result?.message || "Unable to load social accounts.");
      }

      const data = result?.data;

      if (Array.isArray(data)) {
        setSocialAccounts(data);
      } else if (data && typeof data === "object") {
        setSocialAccounts([data]);
      } else {
        setSocialAccounts([]);
      }
    } catch (error) {
      console.error("GET SOCIAL ACCOUNTS ERROR:", error);

      setSocialAccounts([]);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  useEffect(() => {
    fetchSocialAccounts();
  }, []);

  /* ================================================================



     MODAL



  ================================================================ */

  const openConnectModal = () => {
    setSelectedPlatform("Instagram");

    setSocialUsername("");

    setSocialProfileUrl("");

    setSocialFollowers("");

    setFormError("");

    setIsConnectModalOpen(true);
  };

  const closeConnectModal = () => {
    if (isConnecting) return;

    setIsConnectModalOpen(false);

    setFormError("");
  };

  /* ================================================================



     CONNECT ACCOUNT



  ================================================================ */

  const handleConnectAccount = async () => {
    try {
      setFormError("");

      if (!socialUsername.trim()) {
        setFormError("Please enter your username or social handle.");

        return;
      }

      if (!socialProfileUrl.trim()) {
        setFormError("Please enter your profile URL.");

        return;
      }

      try {
        new URL(socialProfileUrl);
      } catch {
        setFormError("Please enter a valid profile URL.");

        return;
      }

      const followerCount = Number(socialFollowers || 0);

      if (Number.isNaN(followerCount) || followerCount < 0) {
        setFormError("Followers must be a valid number.");

        return;
      }

      setIsConnecting(true);

      const url = `${API_URL}/freelancer/social-account`;

      console.log("CONNECT SOCIAL ACCOUNT:", url);

      const res = await fetch(url, {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          platform: selectedPlatform,

          username: socialUsername.trim(),

          profileUrl: socialProfileUrl.trim(),

          followers: followerCount,
        }),
      });

      const raw = await res.text();

      let result: SocialAccountApiResponse | null = null;

      try {
        result = raw ? JSON.parse(raw) : null;
      } catch {
        console.error("INVALID CONNECT RESPONSE:", raw);
      }

      if (!res.ok) {
        throw new Error(result?.message || "Unable to connect social account.");
      }

      console.log("SOCIAL ACCOUNT CONNECTED:", result);

      setIsConnectModalOpen(false);

      setSelectedPlatform("Instagram");

      setSocialUsername("");

      setSocialProfileUrl("");

      setSocialFollowers("");

      await fetchSocialAccounts();
    } catch (error) {
      console.error("CONNECT SOCIAL ACCOUNT ERROR:", error);

      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to connect social account.",
      );
    } finally {
      setIsConnecting(false);
    }
  };

  /* ================================================================



     TOTALS



  ================================================================ */

  const totalFollowers = useMemo(() => {
    return socialAccounts.reduce(
      (sum, account) => sum + Number(account.followers || 0),

      0,
    );
  }, [socialAccounts]);

  const totalViews = useMemo(() => {
    return socialAccounts.reduce(
      (sum, account) => sum + Number(account.views || 0),

      0,
    );
  }, [socialAccounts]);

  const totalEngagement = useMemo(() => {
    return socialAccounts.reduce(
      (sum, account) => sum + Number(account.engagement || 0),

      0,
    );
  }, [socialAccounts]);

  const totalClicks = campaignPerformance.reduce(
    (sum, campaign) => sum + campaign.clicks,

    0,
  );

  const totalOrders = campaignPerformance.reduce(
    (sum, campaign) => sum + campaign.orders,

    0,
  );

  const totalSales = campaignPerformance.reduce(
    (sum, campaign) => sum + campaign.sales,

    0,
  );

  const totalRoyalty = campaignPerformance.reduce(
    (sum, campaign) => sum + campaign.royalty,

    0,
  );

  /* ================================================================



     PLATFORM UI



  ================================================================ */

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case "Instagram":
        return FaInstagram;

      case "Facebook":
        return FaFacebook;

      case "YouTube":
        return FaYoutube;

      case "TikTok":
        return FaTiktok;

      case "Pinterest":
        return FaPinterest;

      default:
        return Link2;
    }
  };

  const getPlatformColor = (platform: SocialPlatform) => {
    switch (platform) {
      case "Instagram":
        return "from-pink-500 via-purple-500 to-orange-400";

      case "Facebook":
        return "from-blue-500 to-blue-700";

      case "YouTube":
        return "from-red-500 to-red-600";

      case "TikTok":
        return "from-slate-900 to-slate-700";

      case "Pinterest":
        return "from-red-600 to-red-700";

      default:
        return "from-violet-500 to-purple-600";
    }
  };

  const handleSyncAccount = async (account: SocialAccount) => {
    try {
      setSyncMessage("");

      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured.");
      }

      setSyncingAccountId(account._id);

      const url = `${API_URL}/freelancer/social-account/${account._id}/sync`;

      console.log("SYNC SOCIAL ACCOUNT:", url);

      const res = await fetch(url, {
        method: "POST",

        credentials: "include",
      });

      const raw = await res.text();

      let result: any = null;

      try {
        result = raw ? JSON.parse(raw) : null;
      } catch {
        console.error("INVALID SYNC RESPONSE:", raw);

        throw new Error("Invalid response received from server.");
      }

      console.log("SYNC RESULT:", result);

      if (!res.ok) {
        throw new Error(result?.message || "Unable to sync social statistics.");
      }

      setSyncMessage(`${account.platform} statistics synced successfully.`);

      await fetchSocialAccounts();
    } catch (error) {
      console.error("SYNC SOCIAL ACCOUNT ERROR:", error);

      setSyncMessage(
        error instanceof Error ? error.message : "Unable to sync statistics.",
      );
    } finally {
      setSyncingAccountId(null);
    }
  };

  const formatLastSynced = (date?: string) => {
    if (!date) {
      return "Never synced";
    }

    try {
      return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit",
      }).format(new Date(date));
    } catch {
      return "Unknown";
    }
  };

  /* ================================================================



     RENDER



  ================================================================ */

  return (
    <div className="min-h-full bg-[#f8f8fb]">
      <div className="mx-auto max-w-[1600px] p-5 sm:p-7 lg:p-8">
        {/* ============================================================



            HEADER



        ============================================================ */}

        <section className="mb-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-700">
                <Sparkles size={12} />
                Creator Social Studio
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Your Social Impact
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                See how your content turns audience attention into product sales
                and royalty earnings.
              </p>
            </div>

            <button
              type="button"
              onClick={openConnectModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Plus size={17} />
              Connect Account
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {socialAccounts.length}{" "}
              {socialAccounts.length === 1 ? "account" : "accounts"} connected
            </span>

            {socialAccounts.length > 0 && (
              <>
                <span>•</span>

                <span>Social accounts connected</span>
              </>
            )}
          </div>
        </section>

        {/* ============================================================



            OVERVIEW



        ============================================================ */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#171221] via-[#28163e] to-[#531d60] p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-fuchsia-400/10 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
              <div>
                <div className="flex items-center gap-2 text-violet-200">
                  <BarChart3 size={18} />

                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Social Performance
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                  Your audience is growing.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-violet-200/75">
                  Track your connected social platforms and see how your content
                  contributes to MYSMME sales.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <HeroMetric
                icon={<Users size={17} />}
                label="Followers"
                value={totalFollowers.toLocaleString("en-IN")}
              />

              <HeroMetric
                icon={<Eye size={17} />}
                label="Views"
                value={totalViews.toLocaleString("en-IN")}
              />

              <HeroMetric
                icon={<Heart size={17} />}
                label="Engagement"
                value={totalEngagement.toLocaleString("en-IN")}
              />

              <HeroMetric
                icon={<MousePointerClick size={17} />}
                label="Product Clicks"
                value={totalClicks.toLocaleString("en-IN")}
              />

              <HeroMetric
                icon={<ShoppingBag size={17} />}
                label="Orders"
                value={String(totalOrders)}
              />
            </div>
          </div>
        </section>

        {/* ============================================================



            CONNECTED ACCOUNTS



        ============================================================ */}

        {syncMessage && (
          <div
            className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${
              syncMessage.toLowerCase().includes("success")
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            {syncMessage}
          </div>
        )}

        <section className="mt-5">
          <SectionHeader
            icon={<Link2 size={18} />}
            title="Connected Accounts"
            description="Your connected social platforms and their performance."
            action="Manage accounts"
          />

          {isLoadingAccounts ? (
            <div className="mt-4 flex min-h-[180px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading accounts...
              </div>
            </div>
          ) : socialAccounts.length > 0 ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {socialAccounts.map((account) => {
                const Icon = getPlatformIcon(account.platform);

                const color = getPlatformColor(account.platform);

                return (
                  <div
                    key={account._id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-sm`}
                        >
                          <Icon size={20} />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {account.platform}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {account.username}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          account.creatorStatus === "Verified"
                            ? "bg-emerald-50 text-emerald-600"
                            : account.creatorStatus === "Active"
                              ? "bg-blue-50 text-blue-600"
                              : account.creatorStatus === "In Review"
                                ? "bg-amber-50 text-amber-700"
                                : account.creatorStatus === "Inactive"
                                  ? "bg-slate-100 text-slate-500"
                                  : "bg-violet-50 text-violet-600"
                        }`}
                      >
                        <CheckCircle2 size={11} />
                        {account.creatorStatus || "Basic"}
                      </span>
                    </div>

                    {/* CREATOR SCORE + STATUS */}

                    <div className="mt-5 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-violet-500">
                            Creator Score
                          </p>

                          <div className="mt-1 flex items-end gap-1.5">
                            <span className="text-2xl font-bold text-slate-950">
                              {Number(account.creatorScore || 0)}
                            </span>

                            <span className="pb-1 text-xs font-medium text-slate-400">
                              / 100
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            Status
                          </p>

                          <span
                            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              account.creatorStatus === "Verified"
                                ? "bg-emerald-100 text-emerald-700"
                                : account.creatorStatus === "Active"
                                  ? "bg-blue-100 text-blue-700"
                                  : account.creatorStatus === "In Review"
                                    ? "bg-amber-100 text-amber-700"
                                    : account.creatorStatus === "Inactive"
                                      ? "bg-slate-200 text-slate-600"
                                      : "bg-violet-100 text-violet-700"
                            }`}
                          >
                            {account.creatorStatus || "Basic"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-violet-100">
                        <div
                          className="h-full rounded-full bg-violet-600 transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, Number(account.creatorScore || 0)),
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* SOCIAL STATS */}

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <AccountMetric
                        label="Followers"
                        value={Number(account.followers || 0).toLocaleString(
                          "en-IN",
                        )}
                      />

                      <AccountMetric
                        label="Growth"
                        value={`${Number(account.growth || 0) >= 0 ? "+" : ""}${Number(
                          account.growth || 0,
                        )}%`}
                        green={Number(account.growth || 0) >= 0}
                      />

                      <AccountMetric
                        label="Views"
                        value={Number(account.views || 0).toLocaleString(
                          "en-IN",
                        )}
                      />

                      <AccountMetric
                        label="Engagement"
                        value={Number(account.engagement || 0).toLocaleString(
                          "en-IN",
                        )}
                      />

                      <AccountMetric
                        label="Reach"
                        value={Number(account.reach || 0).toLocaleString(
                          "en-IN",
                        )}
                      />

                      <AccountMetric
                        label="Media"
                        value={Number(account.mediaCount || 0).toLocaleString(
                          "en-IN",
                        )}
                      />
                    </div>

                    {/* VERIFIED ACCOUNT SYNC DETAILS */}

                    {(account.instagramAccountId ||
                      account.creatorStatus === "Verified") && (
                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                              Last synced
                            </p>

                            <p className="mt-1 text-xs font-semibold text-slate-600">
                              {formatLastSynced(account.lastSyncedAt)}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              account.syncStatus === "success"
                                ? "bg-emerald-50 text-emerald-600"
                                : account.syncStatus === "failed"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {account.syncStatus === "success"
                              ? "Synced"
                              : account.syncStatus === "failed"
                                ? "Sync failed"
                                : "Not synced"}
                          </span>
                        </div>

                        {account.syncError && (
                          <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5">
                            <p className="text-xs text-red-600">
                              {account.syncError}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ACTIONS */}

                    <div className="mt-5 flex gap-2">
                      {account.profileUrl && (
                        <a
                          href={account.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                        >
                          View Profile
                          <ArrowRight size={14} />
                        </a>
                      )}

                      {(account.instagramAccountId ||
                        account.creatorStatus === "Verified") && (
                        <button
                          type="button"
                          onClick={() => handleSyncAccount(account)}
                          disabled={syncingAccountId === account._id}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {syncingAccountId === account._id ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              Syncing...
                            </>
                          ) : (
                            <>
                              <RotateCcw size={14} />
                              Sync Stats
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                <Link2 size={20} />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                No social accounts connected
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Connect Instagram, YouTube, Facebook, TikTok or Pinterest to
                start tracking your creator performance.
              </p>

              <button
                type="button"
                onClick={openConnectModal}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
              >
                <Plus size={16} />
                Connect Account
              </button>
            </div>
          )}
        </section>

        {/* ============================================================



            FUNNEL



        ============================================================ */}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            icon={<TrendingUp size={18} />}
            title="From Content to Earnings"
            description="See how your social activity turns into real business."
            action="View details"
          />

          <div className="mt-7 grid gap-3 md:grid-cols-5">
            <FunnelStep
              icon={<Eye size={18} />}
              label="Views"
              value={totalViews.toLocaleString("en-IN")}
              color="violet"
            />

            <FunnelStep
              icon={<Heart size={18} />}
              label="Engagement"
              value={totalEngagement.toLocaleString("en-IN")}
              color="pink"
            />

            <FunnelStep
              icon={<MousePointerClick size={18} />}
              label="Product Clicks"
              value={totalClicks.toLocaleString("en-IN")}
              color="blue"
            />

            <FunnelStep
              icon={<ShoppingBag size={18} />}
              label="Orders"
              value={String(totalOrders)}
              color="amber"
            />

            <FunnelStep
              icon={<Wallet size={18} />}
              label="Your Royalty"
              value={`₹${totalRoyalty.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}`}
              color="emerald"
            />
          </div>

          <div className="mt-6 rounded-xl bg-gradient-to-r from-violet-50 via-fuchsia-50 to-emerald-50 p-4">
            <p className="text-xs font-semibold text-slate-700">
              Your content generated
            </p>

            <p className="mt-1 text-xl font-bold text-slate-950">
              ₹{totalSales.toLocaleString("en-IN")}
              <span className="ml-2 text-xs font-medium text-slate-400">
                in attributed sales
              </span>
            </p>
          </div>
        </section>

        {/* ============================================================



            AUDIENCE



        ============================================================ */}

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              icon={<Users size={18} />}
              title="Audience Growth"
              description="Your social audience over the last 6 months."
              action="Last 6 months"
            />

            <div className="mt-8">
              <div className="flex h-56 items-end gap-3 sm:gap-5">
                {audienceData.map((item) => {
                  const max = Math.max(
                    ...audienceData.map((data) => data.value),
                  );

                  const height = (item.value / max) * 100;

                  return (
                    <div
                      key={item.month}
                      className="group flex flex-1 flex-col items-center justify-end gap-2"
                    >
                      <div className="relative flex h-full w-full items-end justify-center">
                        <div
                          className="w-full max-w-12 rounded-t-xl bg-gradient-to-t from-violet-600 to-fuchsia-400"
                          style={{
                            height: `${height}%`,
                          }}
                        />
                      </div>

                      <span className="text-[10px] text-slate-400">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* INSIGHTS */}

          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                <Sparkles size={19} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">Creator Insights</h2>

                <p className="text-xs text-slate-400">
                  What your audience responds to
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Insight
                icon="🔥"
                title="Best performing format"
                value="Saree styling reels"
                description="Strong product discovery"
              />

              <Insight
                icon="📅"
                title="Content consistency"
                value="Post regularly"
                description="Stay visible to your audience"
              />

              <Insight
                icon="💰"
                title="Earn through MYSMME"
                value="Sales royalty"
                description="Royalty on attributed sales"
              />

              <Insight
                icon="🎥"
                title="Recommended campaign content"
                value="Minimum 5 reels"
                description="Follow campaign requirements"
              />
            </div>
          </div>
        </section>

        {/* ============================================================



            TOP CONTENT



        ============================================================ */}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            icon={<Play size={18} />}
            title="Top Performing Content"
            description="Content that is getting the strongest response."
            action="View all"
          />

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {topContent.map((content, index) => (
              <div
                key={content.title}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50"
              >
                <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-violet-200 via-fuchsia-100 to-orange-100">
                  <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600">
                    #{index + 1}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-violet-600 shadow">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">
                    {content.title}
                  </h3>

                  <div className="mt-4 grid grid-cols-4 gap-2">
                    <ContentMetric
                      label="Views"
                      value={`${(content.views / 1000).toFixed(1)}K`}
                    />

                    <ContentMetric
                      label="Likes"
                      value={`${(content.likes / 1000).toFixed(1)}K`}
                    />

                    <ContentMetric
                      label="Shares"
                      value={String(content.shares)}
                    />

                    <ContentMetric
                      label="Saves"
                      value={String(content.saves)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================



            CAMPAIGNS



        ============================================================ */}

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6">
            <SectionHeader
              icon={<ShoppingBag size={18} />}
              title="Campaign Performance"
              description="See which campaigns are generating results."
              action="View campaigns"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50/70">
                  <TableHead>Campaign</TableHead>

                  <TableHead>Reels</TableHead>

                  <TableHead>Views</TableHead>

                  <TableHead>Clicks</TableHead>

                  <TableHead>Orders</TableHead>

                  <TableHead>Sales</TableHead>

                  <TableHead>Your Royalty</TableHead>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {campaignPerformance.map((campaign) => (
                  <tr key={campaign.campaign}>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                      {campaign.campaign}
                    </td>

                    <td className="px-6 py-5 text-sm">{campaign.reels}</td>

                    <td className="px-6 py-5 text-sm">
                      {campaign.views.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-5 text-sm">{campaign.clicks}</td>

                    <td className="px-6 py-5 text-sm">{campaign.orders}</td>

                    <td className="px-6 py-5 text-sm font-semibold">
                      ₹{campaign.sales.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-5 font-bold text-emerald-600">
                      ₹{campaign.royalty.toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ================================================================



          CONNECT MODAL



      ================================================================ */}

      {isConnectModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeConnectModal();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Connect Social Account
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add your social profile to your MYSMME creator account.
                </p>
              </div>

              <button
                type="button"
                onClick={closeConnectModal}
                disabled={isConnecting}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <X size={17} />
              </button>
            </div>

            <div className="p-6">
              {/* PLATFORM */}

              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                Select Platform
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <PlatformButton
                  label="Instagram"
                  icon={<FaInstagram size={20} />}
                  active={selectedPlatform === "Instagram"}
                  onClick={() => setSelectedPlatform("Instagram")}
                />

                <PlatformButton
                  label="YouTube"
                  icon={<FaYoutube size={20} />}
                  active={selectedPlatform === "YouTube"}
                  onClick={() => setSelectedPlatform("YouTube")}
                />

                <PlatformButton
                  label="Facebook"
                  icon={<FaFacebook size={20} />}
                  active={selectedPlatform === "Facebook"}
                  onClick={() => setSelectedPlatform("Facebook")}
                />

                <PlatformButton
                  label="TikTok"
                  icon={<FaTiktok size={20} />}
                  active={selectedPlatform === "TikTok"}
                  onClick={() => setSelectedPlatform("TikTok")}
                />

                <PlatformButton
                  label="Pinterest"
                  icon={<FaPinterest size={20} />}
                  active={selectedPlatform === "Pinterest"}
                  onClick={() => setSelectedPlatform("Pinterest")}
                />
              </div>

              {/* INPUTS */}

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Username / Handle
                  </label>

                  <input
                    type="text"
                    value={socialUsername}
                    onChange={(event) => setSocialUsername(event.target.value)}
                    placeholder="@username"
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Profile URL
                  </label>

                  <input
                    type="url"
                    value={socialProfileUrl}
                    onChange={(event) =>
                      setSocialProfileUrl(event.target.value)
                    }
                    placeholder="https://instagram.com/username"
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Followers
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={socialFollowers}
                    onChange={(event) => setSocialFollowers(event.target.value)}
                    placeholder="e.g. 12500"
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    Enter your current follower count.
                  </p>
                </div>

                {formError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {formError}
                  </div>
                )}
              </div>

              {/* FOOTER */}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeConnectModal}
                  disabled={isConnecting}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConnectAccount}
                  disabled={isConnecting}
                  className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Link2 size={16} />
                      Connect Account
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================================================================



   HERO METRIC



================================================================ */

function HeroMetric({
  icon,

  label,

  value,
}: {
  icon: React.ReactNode;

  label: string;

  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-violet-200">
        {icon}

        <span className="text-[11px]">{label}</span>
      </div>

      <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
  );
}

/* ================================================================



   SECTION HEADER



================================================================ */

function SectionHeader({
  icon,

  title,

  description,

  action,
}: {
  icon: React.ReactNode;

  title: string;

  description: string;

  action: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          {icon}
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>

          <p className="mt-0.5 text-xs text-slate-400">{description}</p>
        </div>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700"
      >
        {action}

        <ArrowRight size={14} />
      </button>
    </div>
  );
}

/* ================================================================



   ACCOUNT METRIC



================================================================ */

function AccountMetric({
  label,

  value,

  green = false,
}: {
  label: string;

  value: string;

  green?: boolean;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] text-slate-400">{label}</p>

      <p
        className={`mt-1 text-sm font-bold ${
          green ? "text-emerald-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ================================================================



   PLATFORM BUTTON



================================================================ */

function PlatformButton({
  label,

  icon,

  active,

  onClick,
}: {
  label: string;

  icon: React.ReactNode;

  active: boolean;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border-violet-500 bg-violet-50 text-violet-700 ring-2 ring-violet-100"
          : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50"
      }`}
    >
      {icon}

      {label}
    </button>
  );
}

/* ================================================================



   FUNNEL STEP



================================================================ */

function FunnelStep({
  icon,

  label,

  value,

  color,
}: {
  icon: React.ReactNode;

  label: string;

  value: string;

  color: "violet" | "pink" | "blue" | "amber" | "emerald";
}) {
  const colors = {
    violet: "bg-violet-50 text-violet-600",

    pink: "bg-pink-50 text-pink-600",

    blue: "bg-blue-50 text-blue-600",

    amber: "bg-amber-50 text-amber-600",

    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors[color]}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-[11px] text-slate-400">{label}</p>

      <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

/* ================================================================



   INSIGHT



================================================================ */

function Insight({
  icon,

  title,

  value,

  description,
}: {
  icon: string;

  title: string;

  value: string;

  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white bg-white/80 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-lg">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] text-slate-400">{title}</p>

        <p className="truncate text-xs font-bold text-slate-900">{value}</p>

        <p className="text-[10px] text-emerald-600">{description}</p>
      </div>
    </div>
  );
}

/* ================================================================



   CONTENT METRIC



================================================================ */

function ContentMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] text-slate-400">{label}</p>

      <p className="mt-0.5 text-[11px] font-bold text-slate-700">{value}</p>
    </div>
  );
}

/* ================================================================



   TABLE HEAD



================================================================ */

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
      {children}
    </th>
  );
}

export default FreelancerSocial;
