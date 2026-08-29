"use client";

import React from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Eye,
  Heart,
  Link2,
  MousePointerClick,
  Play,
  Plus,
  Share2,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaTiktok,
  FaPinterest,
} from "react-icons/fa";

const socialAccounts = [
  {
    platform: "Instagram",
    username: "@mysareeme",
    followers: 12800,
    growth: 4.8,
    views: 48200,
    engagement: 3820,
    color: "from-pink-500 via-purple-500 to-orange-400",
    icon: FaInstagram,
  },
  {
    platform: "TikTok",
    username: "@mysareeme",
    followers: 8450,
    growth: 8.2,
    views: 28400,
    engagement: 2140,
    color: "from-slate-900 to-slate-700",
    icon: Play,
  },
  {
    platform: "YouTube",
    username: "MYSMME Creator",
    followers: 5240,
    growth: 3.6,
    views: 18020,
    engagement: 1460,
    color: "from-red-500 to-red-600",
    icon: FaYoutube,
  },
];

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
    platform: "TikTok",
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

const FreelancerSocial = () => {
  const totalFollowers = socialAccounts.reduce(
    (sum, account) => sum + account.followers,
    0,
  );

  const totalViews = socialAccounts.reduce(
    (sum, account) => sum + account.views,
    0,
  );

  const totalEngagement = socialAccounts.reduce(
    (sum, account) => sum + account.engagement,
    0,
  );

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

  return (
    <div className="min-h-full bg-[#f8f8fb]">
      <div className="mx-auto max-w-[1600px] p-5 sm:p-7 lg:p-8">
        {/* =====================================================
            HEADER
        ===================================================== */}

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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Plus size={17} />
              Connect Account
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />3 accounts
              connected
            </span>

            <span>•</span>

            <span>Last synced 12 minutes ago</span>
          </div>
        </section>

        {/* =====================================================
            SOCIAL OVERVIEW HERO
        ===================================================== */}

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
                  Your content has reached{" "}
                  <span className="font-bold text-white">
                    {totalViews.toLocaleString("en-IN")}
                  </span>{" "}
                  people across connected platforms.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
                <p className="text-xs text-violet-200">Audience growth</p>

                <div className="mt-1 flex items-center gap-2">
                  <TrendingUp size={18} className="text-emerald-300" />

                  <span className="text-2xl font-bold">+18.4%</span>
                </div>

                <p className="mt-1 text-[11px] text-violet-200/60">
                  Compared with last month
                </p>
              </div>
            </div>

            {/* HERO METRICS */}

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

        {/* =====================================================
            SOCIAL ACCOUNTS
        ===================================================== */}

        <section className="mt-5">
          <SectionHeader
            icon={<Link2 size={18} />}
            title="Connected Accounts"
            description="Your connected social platforms and their performance."
            action="Manage accounts"
          />

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {socialAccounts.map((account) => {
              const Icon = account.icon;

              return (
                <div
                  key={account.platform}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${account.color} text-white shadow-sm`}
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

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                      <CheckCircle2 size={11} />
                      Connected
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <AccountMetric
                      label="Followers"
                      value={account.followers.toLocaleString("en-IN")}
                    />

                    <AccountMetric
                      label="Growth"
                      value={`+${account.growth}%`}
                      green
                    />

                    <AccountMetric
                      label="Views"
                      value={account.views.toLocaleString("en-IN")}
                    />

                    <AccountMetric
                      label="Engagement"
                      value={account.engagement.toLocaleString("en-IN")}
                    />
                  </div>

                  <button
                    type="button"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                  >
                    View Insights
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            SOCIAL TO SALES FUNNEL
        ===================================================== */}

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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
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

              <div className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-emerald-600 shadow-sm">
                <TrendingUp size={14} />
                Content is converting
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            AUDIENCE + INSIGHTS
        ===================================================== */}

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
          {/* AUDIENCE GROWTH */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              icon={<Users size={18} />}
              title="Audience Growth"
              description="Your Instagram audience over the last 6 months."
              action="Last 6 months"
            />

            <div className="mt-7 flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-400">Current followers</p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                  12.8K
                </p>

                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <TrendingUp size={13} />
                  +2,840 this period
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex h-56 items-end gap-3 sm:gap-5">
                {audienceData.map((item, index) => {
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
                          className="w-full max-w-12 rounded-t-xl bg-gradient-to-t from-violet-600 to-fuchsia-400 transition-all duration-300 group-hover:from-violet-500 group-hover:to-fuchsia-300"
                          style={{
                            height: `${height}%`,
                          }}
                        />

                        <div className="absolute -top-7 rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                          {(item.value / 1000).toFixed(1)}K
                        </div>
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

          <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl" />

            <div className="relative">
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
                  description="2.4× more product clicks"
                />

                <Insight
                  icon="📅"
                  title="Best posting day"
                  value="Saturday"
                  description="32% higher engagement"
                />

                <Insight
                  icon="💰"
                  title="Best converting content"
                  value="Festive collections"
                  description="Highest royalty per reel"
                />

                <Insight
                  icon="⏱"
                  title="Best reel length"
                  value="18–25 seconds"
                  description="Strongest completion rate"
                />
              </div>

              <div className="mt-5 rounded-xl bg-white p-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-500">
                  Creator tip
                </p>

                <p className="mt-2 text-sm font-semibold leading-5 text-slate-900">
                  Your styling content is generating more product interest.
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Consider creating another styling Reel for your next campaign.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            TOP CONTENT
        ===================================================== */}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            icon={<Play size={18} />}
            title="Top Performing Content"
            description="Content that is getting the strongest response from your audience."
            action="View all"
          />

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {topContent.map((content, index) => (
              <div
                key={content.title}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 transition hover:border-violet-200 hover:shadow-sm"
              >
                <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-violet-200 via-fuchsia-100 to-orange-100">
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-600 shadow-sm">
                    #{index + 1}
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-violet-600 shadow-lg transition group-hover:scale-110">
                    <Play size={20} fill="currentColor" />
                  </div>

                  <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
                    {content.platform}
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

                  <div className="mt-4 flex items-center justify-between rounded-xl bg-white p-3">
                    <div>
                      <p className="text-[10px] text-slate-400">
                        Sales generated
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        ₹{content.sales.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">Your royalty</p>

                      <p className="mt-1 font-bold text-emerald-600">
                        ₹{content.royalty.toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            CAMPAIGN PERFORMANCE
        ===================================================== */}

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6">
            <SectionHeader
              icon={<ShoppingBag size={18} />}
              title="Campaign Performance"
              description="See which campaigns are generating the strongest results."
              action="View campaigns"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50/70 text-left">
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
                  <tr
                    key={campaign.campaign}
                    className="transition hover:bg-violet-50/30"
                  >
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-slate-900">
                        {campaign.campaign}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Campaign attribution active
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {campaign.reels}
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                      {campaign.views.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                      {campaign.clicks}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                        {campaign.orders}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                      ₹{campaign.sales.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-5">
                      <span className="font-bold text-emerald-600">
                        ₹{campaign.royalty.toFixed(0)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* =====================================================
            EARN MORE
        ===================================================== */}

        <section className="relative mt-5 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-6 text-white shadow-lg sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-violet-200">
                <Sparkles size={18} />

                <span className="text-xs font-bold uppercase tracking-[0.18em]">
                  Keep creating
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-bold">
                Turn your audience into more earnings.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-violet-100/80">
                Your content has already generated{" "}
                <span className="font-bold text-white">
                  ₹{totalSales.toLocaleString("en-IN")}
                </span>{" "}
                in attributed sales. Explore campaigns and keep growing.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-sm transition hover:bg-violet-50"
            >
              Explore Campaigns
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

/* =============================================================
   HERO METRIC
============================================================= */

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

/* =============================================================
   SECTION HEADER
============================================================= */

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

/* =============================================================
   ACCOUNT METRIC
============================================================= */

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

/* =============================================================
   FUNNEL STEP
============================================================= */

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
    <div className="relative rounded-2xl border border-slate-100 bg-slate-50 p-4">
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

/* =============================================================
   INSIGHT
============================================================= */

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

/* =============================================================
   CONTENT METRIC
============================================================= */

function ContentMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] text-slate-400">{label}</p>

      <p className="mt-0.5 text-[11px] font-bold text-slate-700">{value}</p>
    </div>
  );
}

/* =============================================================
   TABLE HEAD
============================================================= */

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wide text-slate-400">
      {children}
    </th>
  );
}

export default FreelancerSocial;
