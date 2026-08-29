"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  FileText,
  IndianRupee,
  Info,
  Link2,
  MessageCircle,
  Play,
  Send,
  Sparkles,
  Users,
  Video,
  X,
} from "lucide-react";

import { FaInstagram, FaYoutube } from "react-icons/fa";

/* =========================================================
   TYPES
========================================================= */

type Platform = "Instagram" | "YouTube";

type CampaignStatus = "available" | "accepted" | "in_progress" | "completed";

interface Campaign {
  id: string;
  title: string;
  brand: string;
  description: string;

  productName: string;
  productImage: string;

  category: string;
  payout: number;

  reelsRequired: number;
  deadline: string;

  platforms: Platform[];

  estimatedReach: string;
  applicants: number;

  status: CampaignStatus;

  tags: string[];

  brief?: string;

  requirements?: string[];

  hashtags?: string[];

  mentions?: string[];
}

/* =========================================================
   LOCAL STORAGE KEY
========================================================= */

const ACCEPTED_CAMPAIGNS_KEY = "mysmme_freelancer_accepted_campaigns";

/* =========================================================
   CAMPAIGNS
========================================================= */

const campaigns: Campaign[] = [
  {
    id: "mysmme-festive-001",
    title: "Festive Saree Stories",
    brand: "MYSMME",
    description:
      "Create an elegant festive reel featuring our latest saree collection. Show the drape, fabric movement and your personal styling.",
    productName: "Festive Silk Saree",
    productImage:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
    category: "Festive",
    payout: 5000,
    reelsRequired: 2,
    deadline: "Sep 15, 2026",
    platforms: ["Instagram", "YouTube"],
    estimatedReach: "10K - 50K",
    applicants: 38,
    status: "available",
    tags: ["Festive", "Silk", "Styling"],
    brief:
      "Create beautiful short-form content that showcases the elegance, movement and styling possibilities of the MYSMME festive saree collection.",
    requirements: [
      "Create 2 vertical short-form videos.",
      "Each video should be between 15 and 60 seconds.",
      "Show the saree clearly in the first few seconds.",
      "Include at least one styling or draping moment.",
      "Mention MYSMME naturally in the video or caption.",
      "Publish the content publicly on the required platforms.",
      "Submit all live URLs through your freelancer workspace.",
    ],
    hashtags: ["#MYSMME", "#MYSMMESarees", "#SareeStyle", "#FestiveLook"],
    mentions: ["@mysmme"],
  },

  {
    id: "mysmme-everyday-002",
    title: "Everyday Elegance",
    brand: "MYSMME",
    description:
      "Show your audience how a beautiful saree can become part of an effortless everyday wardrobe.",
    productName: "Everyday Cotton Saree",
    productImage:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85",
    category: "Everyday",
    payout: 3500,
    reelsRequired: 1,
    deadline: "Sep 22, 2026",
    platforms: ["Instagram"],
    estimatedReach: "5K - 25K",
    applicants: 21,
    status: "available",
    tags: ["Cotton", "Everyday", "Lifestyle"],
    brief:
      "Create an authentic everyday styling reel showing how comfortable and versatile a MYSMME saree can be.",
    requirements: [
      "Create 1 vertical reel.",
      "Keep the content between 15 and 60 seconds.",
      "Show the product clearly.",
      "Demonstrate your personal styling.",
      "Mention MYSMME in the caption.",
      "Keep the post public during the campaign period.",
      "Submit the live Instagram URL.",
    ],
    hashtags: ["#MYSMME", "#EverydaySaree", "#SareeStyle"],
    mentions: ["@mysmme"],
  },

  {
    id: "mysmme-wedding-003",
    title: "Wedding Guest Edit",
    brand: "MYSMME",
    description:
      "Create a premium wedding guest styling reel showcasing how to style a statement saree for a special occasion.",
    productName: "Designer Wedding Saree",
    productImage:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
    category: "Wedding",
    payout: 7500,
    reelsRequired: 2,
    deadline: "Oct 02, 2026",
    platforms: ["Instagram", "YouTube"],
    estimatedReach: "20K - 100K",
    applicants: 64,
    status: "available",
    tags: ["Wedding", "Designer", "Premium"],
    brief:
      "Create premium wedding-focused content that positions the MYSMME saree as a beautiful choice for wedding guests and festive celebrations.",
    requirements: [
      "Create 2 short-form videos.",
      "Use vertical 9:16 format.",
      "Show full saree details.",
      "Include a complete wedding guest look.",
      "Use good lighting and clear visuals.",
      "Publish on the required platforms.",
      "Submit the live URLs for review.",
    ],
    hashtags: ["#MYSMME", "#WeddingSaree", "#WeddingGuestLook", "#SareeLook"],
    mentions: ["@mysmme"],
  },

  {
    id: "mysmme-reels-004",
    title: "New Collection Reveal",
    brand: "MYSMME",
    description:
      "Introduce your audience to the newest MYSMME collection through a visually engaging short-form video.",
    productName: "MYSMME New Collection",
    productImage:
      "https://images.unsplash.com/photo-1610189012906-0e2f5e6f4d5c?auto=format&fit=crop&w=1200&q=85",
    category: "New Arrivals",
    payout: 4500,
    reelsRequired: 1,
    deadline: "Sep 30, 2026",
    platforms: ["Instagram", "YouTube"],
    estimatedReach: "10K - 50K",
    applicants: 47,
    status: "available",
    tags: ["New", "Collection", "Reels"],
    brief:
      "Reveal the latest MYSMME collection with an engaging, energetic and visually strong short-form video.",
    requirements: [
      "Create 1 vertical short-form video.",
      "Introduce the collection clearly.",
      "Show at least 3 product details or styling shots.",
      "Include a clear MYSMME mention.",
      "Publish publicly on required platforms.",
      "Submit the published URLs.",
    ],
    hashtags: ["#MYSMME", "#NewCollection", "#SareeReels"],
    mentions: ["@mysmme"],
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function FreelancerCampaignDetailPage() {
  const router = useRouter();
  const params = useParams();

  const campaignId = String(params?.id ?? "");

  const campaign = useMemo(
    () => campaigns.find((item) => item.id === campaignId),
    [campaignId],
  );

  const [accepted, setAccepted] = useState(false);

  const [showApplyModal, setShowApplyModal] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const [copied, setCopied] = useState(false);

  const [note, setNote] = useState("");

  const [loadingAcceptance, setLoadingAcceptance] = useState(true);

  /* =======================================================
     LOAD ACCEPTED STATE
  ======================================================= */

  useEffect(() => {
    if (!campaignId) {
      setLoadingAcceptance(false);
      return;
    }

    try {
      const stored = localStorage.getItem(ACCEPTED_CAMPAIGNS_KEY);

      if (!stored) {
        setAccepted(false);
        setLoadingAcceptance(false);
        return;
      }

      const acceptedCampaigns: string[] = JSON.parse(stored);

      setAccepted(acceptedCampaigns.includes(campaignId));
    } catch (error) {
      console.error("Unable to load accepted campaigns", error);

      setAccepted(false);
    } finally {
      setLoadingAcceptance(false);
    }
  }, [campaignId]);

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!campaign) {
    return (
      <div className="min-h-full bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <Info size={28} />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Campaign not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This campaign may have been removed or is no longer available.
          </p>

          <button
            type="button"
            onClick={() => router.push("/platform/freelancer/campaigns")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            <ArrowLeft size={16} />
            Back to campaigns
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     ACCEPT CAMPAIGN
  ======================================================= */

  const handleAccept = () => {
    try {
      const stored = localStorage.getItem(ACCEPTED_CAMPAIGNS_KEY);

      const acceptedCampaigns: string[] = stored ? JSON.parse(stored) : [];

      if (!acceptedCampaigns.includes(campaign.id)) {
        acceptedCampaigns.push(campaign.id);
      }

      localStorage.setItem(
        ACCEPTED_CAMPAIGNS_KEY,
        JSON.stringify(acceptedCampaigns),
      );

      setAccepted(true);
      setShowApplyModal(false);

      /*
       * Small delay allows the modal to close naturally
       * before moving to My Campaigns.
       */
      setTimeout(() => {
        router.push("/platform/freelancer/campaigns");
      }, 300);
    } catch (error) {
      console.error("Unable to accept campaign", error);
    }
  };

  /* =======================================================
     SUBMIT REEL
  ======================================================= */

  const handleSubmitReel = () => {
    router.push(`/platform/freelancer/campaigns/${campaign.id}/submit`);
  };

  /* =======================================================
     COPY HASHTAGS
  ======================================================= */

  const copyHashtags = async () => {
    const text = [
      ...(campaign.hashtags ?? []),
      ...(campaign.mentions ?? []),
    ].join(" ");

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Unable to copy hashtags");
    }
  };

  /* =======================================================
     LOADING ACCEPTANCE
  ======================================================= */

  if (loadingAcceptance) {
    return (
      <div className="min-h-full bg-slate-50">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />
            Loading campaign...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50">
      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 sm:px-7 lg:px-8">
          <button
            type="button"
            onClick={() => router.push("/platform/freelancer/campaigns")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-violet-600"
          >
            <ArrowLeft size={17} />
            Back to campaigns
          </button>

          <span className="hidden items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600 sm:flex">
            <Sparkles size={13} />
            MYSMME Creator
          </span>
        </div>
      </div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1600px] gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          {/* IMAGE */}

          <div className="relative min-h-[360px] overflow-hidden bg-slate-100 sm:min-h-[480px] lg:min-h-[620px]">
            <img
              src={campaign.productImage}
              alt={campaign.productName}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute bottom-6 left-5 right-5 sm:bottom-8 sm:left-8">
              <span className="inline-flex rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-800 backdrop-blur">
                {campaign.category}
              </span>

              <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {campaign.title}
              </h1>

              <p className="mt-2 text-sm text-white/75">
                {campaign.productName}
              </p>
            </div>
          </div>

          {/* DETAILS */}

          <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-violet-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-violet-700">
                {campaign.brand}
              </span>

              {accepted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-600">
                  <CheckCircle2 size={12} />
                  Accepted
                </span>
              )}
            </div>

            <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {campaign.title}
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
              {campaign.description}
            </p>

            {/* STATS */}

            <div className="mt-7 grid grid-cols-2 gap-3">
              <DetailStat
                icon={<IndianRupee size={17} />}
                label="Payout"
                value={`₹${campaign.payout.toLocaleString("en-IN")}`}
                highlight
              />

              <DetailStat
                icon={<Video size={17} />}
                label="Videos"
                value={`${campaign.reelsRequired} Reel${
                  campaign.reelsRequired > 1 ? "s" : ""
                }`}
              />

              <DetailStat
                icon={<CalendarDays size={17} />}
                label="Deadline"
                value={campaign.deadline}
              />

              <DetailStat
                icon={<Users size={17} />}
                label="Expected reach"
                value={campaign.estimatedReach}
              />
            </div>

            {/* PLATFORMS */}

            <div className="mt-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Publish on
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {campaign.platforms.map((platform) => (
                  <PlatformBadge key={platform} platform={platform} />
                ))}
              </div>
            </div>

            {/* CTA */}

            <div className="mt-8">
              {!accepted ? (
                <button
                  type="button"
                  onClick={() => setShowApplyModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 hover:shadow-xl"
                >
                  Accept Campaign
                  <ArrowRight size={17} />
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-6 py-3.5 text-sm font-semibold text-emerald-600">
                    <CheckCircle2 size={18} />
                    Campaign Accepted
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitReel}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 hover:shadow-xl"
                  >
                    Submit Reel
                    <Send size={17} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-[1400px] px-5 py-8 sm:px-7 lg:px-8 lg:py-12">
        <div className="grid gap-7 lg:grid-cols-[1fr_360px]">
          {/* LEFT */}

          <div className="space-y-7">
            {/* BRIEF */}

            <ContentCard icon={<FileText size={19} />} title="Campaign brief">
              <p className="text-sm leading-7 text-slate-600">
                {campaign.brief}
              </p>
            </ContentCard>

            {/* REQUIREMENTS */}

            <ContentCard
              icon={<CheckCircle2 size={19} />}
              title="Content requirements"
            >
              <div className="space-y-3">
                {(campaign.requirements ?? []).map((requirement, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Check size={12} strokeWidth={3} />
                    </div>

                    <p className="text-sm leading-5 text-slate-600">
                      {requirement}
                    </p>
                  </div>
                ))}
              </div>
            </ContentCard>

            {/* CREATIVE DIRECTION */}

            <ContentCard icon={<Play size={19} />} title="Creative direction">
              <div className="grid gap-3 sm:grid-cols-2">
                <CreativeTip
                  title="Hook"
                  text="Start with a strong visual or styling transformation."
                />

                <CreativeTip
                  title="Product"
                  text="Show the saree clearly and highlight its details."
                />

                <CreativeTip
                  title="Story"
                  text="Make the content feel natural and authentic to your audience."
                />

                <CreativeTip
                  title="CTA"
                  text="Encourage viewers to discover the MYSMME collection."
                />
              </div>
            </ContentCard>

            {/* SOCIAL REQUIREMENTS */}

            <ContentCard
              icon={<Link2 size={19} />}
              title="Social publishing requirements"
            >
              <div className="space-y-4">
                {campaign.platforms.map((platform) => (
                  <div
                    key={platform}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={platform} />

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {platform}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          Publish publicly
                        </p>
                      </div>
                    </div>

                    <CheckCircle2 size={18} className="text-emerald-500" />
                  </div>
                ))}
              </div>
            </ContentCard>

            {/* HASHTAGS */}

            <ContentCard
              icon={<Sparkles size={19} />}
              title="Suggested hashtags & mentions"
            >
              <div className="flex flex-wrap gap-2">
                {campaign.hashtags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700"
                  >
                    {tag}
                  </span>
                ))}

                {campaign.mentions?.map((mention) => (
                  <span
                    key={mention}
                    className="rounded-lg bg-pink-50 px-3 py-2 text-xs font-medium text-pink-600"
                  >
                    {mention}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={copyHashtags}
                className="mt-5 flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy hashtags
                  </>
                )}
              </button>
            </ContentCard>
          </div>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="space-y-5">
            {/* PAYOUT */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Creator earnings
              </p>

              <div className="mt-2 flex items-center gap-1">
                <IndianRupee size={24} className="text-emerald-600" />

                <span className="text-3xl font-bold text-slate-900">
                  {campaign.payout.toLocaleString("en-IN")}
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Payment is released after campaign requirements are completed
                and content is approved.
              </p>

              <div className="mt-5 border-t border-slate-100 pt-5">
                <SidebarRow
                  icon={<Video size={15} />}
                  label="Content"
                  value={`${campaign.reelsRequired} Reel${
                    campaign.reelsRequired > 1 ? "s" : ""
                  }`}
                />

                <SidebarRow
                  icon={<Clock3 size={15} />}
                  label="Deadline"
                  value={campaign.deadline}
                />

                <SidebarRow
                  icon={<Users size={15} />}
                  label="Applicants"
                  value={`${campaign.applicants}`}
                />
              </div>
            </div>

            {/* DEADLINE */}

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-500">
                  <Clock3 size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Submission deadline
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    All content should be published and submitted by{" "}
                    <strong>{campaign.deadline}</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* HELP */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <MessageCircle size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Need help?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Contact the MYSMME campaign team if you have questions about
                    the brief.
                  </p>

                  <button
                    type="button"
                    className="mt-3 text-xs font-semibold text-violet-600 hover:text-violet-700"
                  >
                    Contact campaign team →
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* =====================================================
          ACCEPT MODAL
      ===================================================== */}

      {showApplyModal && (
        <AcceptCampaignModal
          campaign={campaign}
          note={note}
          setNote={setNote}
          onClose={() => setShowApplyModal(false)}
          onAccept={handleAccept}
        />
      )}

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {showSuccess && (
        <SuccessModal
          campaign={campaign}
          onClose={() => setShowSuccess(false)}
          onSubmit={handleSubmitReel}
          onGoToCampaigns={() => router.push("/platform/freelancer/campaigns")}
        />
      )}
    </div>
  );
}

/* =========================================================
   DETAIL STAT
========================================================= */

function DetailStat({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-emerald-100 bg-emerald-50"
          : "border-slate-100 bg-slate-50"
      }`}
    >
      <div
        className={`flex items-center gap-2 ${
          highlight ? "text-emerald-600" : "text-slate-400"
        }`}
      >
        {icon}

        <span className="text-[10px] uppercase tracking-wide">{label}</span>
      </div>

      <p className="mt-2 truncate text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

/* =========================================================
   CONTENT CARD
========================================================= */

function ContentCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          {icon}
        </div>

        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

/* =========================================================
   CREATIVE TIP
========================================================= */

function CreativeTip({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-bold text-slate-900">{title}</p>

      <p className="mt-1.5 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}

/* =========================================================
   PLATFORM ICON
========================================================= */

function PlatformIcon({ platform }: { platform: Platform }) {
  if (platform === "Instagram") {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 text-white">
        <FaInstagram size={18} />
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
      <FaYoutube size={19} />
    </div>
  );
}

/* =========================================================
   PLATFORM BADGE
========================================================= */

function PlatformBadge({ platform }: { platform: Platform }) {
  const instagram = platform === "Instagram";

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${
        instagram
          ? "border-pink-100 bg-pink-50 text-pink-600"
          : "border-red-100 bg-red-50 text-red-600"
      }`}
    >
      {instagram ? <FaInstagram size={16} /> : <FaYoutube size={17} />}

      {platform}
    </div>
  );
}

/* =========================================================
   SIDEBAR ROW
========================================================= */

function SidebarRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-xs">{label}</span>
      </div>

      <span className="text-xs font-semibold text-slate-700">{value}</span>
    </div>
  );
}

/* =========================================================
   ACCEPT MODAL
========================================================= */

function AcceptCampaignModal({
  campaign,
  note,
  setNote,
  onClose,
  onAccept,
}: {
  campaign: Campaign;
  note: string;
  setNote: (value: string) => void;
  onClose: () => void;
  onAccept: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">
              MYSMME Creator
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Accept campaign
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <X size={17} />
          </button>
        </div>

        <div className="p-5">
          {/* CAMPAIGN */}

          <div className="flex gap-4 rounded-xl bg-slate-50 p-4">
            <img
              src={campaign.productImage}
              alt={campaign.productName}
              className="h-20 w-20 rounded-xl object-cover"
            />

            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900">{campaign.title}</h3>

              <p className="mt-1 text-xs text-slate-500">
                {campaign.productName}
              </p>

              <p className="mt-2 text-sm font-bold text-emerald-600">
                ₹{campaign.payout.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* CONFIRMATION */}

          <div className="mt-5">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-violet-600"
              />

              <span className="text-xs leading-5 text-slate-600">
                I have read the campaign brief and agree to complete the
                required content, publish it on the specified platforms and
                submit the live URLs before the deadline.
              </span>
            </label>
          </div>

          {/* NOTE */}

          <div className="mt-5">
            <label className="text-xs font-semibold text-slate-700">
              Note to campaign team{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>

            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              placeholder="Tell the campaign team anything they'd like to know..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
            />
          </div>

          {/* BUTTON */}

          <button
            type="button"
            disabled={!confirmed}
            onClick={onAccept}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Accept Campaign
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SUCCESS MODAL
========================================================= */

function SuccessModal({
  campaign,
  onClose,
  onSubmit,
  onGoToCampaigns,
}: {
  campaign: Campaign;
  onClose: () => void;
  onSubmit: () => void;
  onGoToCampaigns: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-slate-900">
          Campaign accepted!
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          You have successfully accepted <strong>{campaign.title}</strong>. The
          campaign has been added to your campaigns.
        </p>

        <div className="mt-6 rounded-xl bg-violet-50 p-4 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-violet-600">
              <Send size={16} />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-900">Next step</p>

              <p className="mt-1 text-xs text-slate-500">
                Open the campaign from My Campaigns when your Reel is ready.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onGoToCampaigns}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Go to My Campaigns
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50"
          >
            Continue viewing
          </button>
        </div>
      </div>
    </div>
  );
}
