"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Globe2,
  IndianRupee,
  Mail,
  MapPin,
  Save,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";

import { FaInstagram, FaYoutube } from "react-icons/fa";

/* =========================================================
   TYPES
========================================================= */

type SocialPlatform = "Instagram" | "YouTube";

interface SocialAccount {
  platform: SocialPlatform;
  username: string;
  followers: number;
  url: string;
  connected: boolean;
}

interface FreelancerProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  bio: string;

  location: string;
  country: string;

  categories: string[];

  languages: string[];

  socialAccounts: SocialAccount[];

  profileImage: string;

  portfolio: string[];

  isVerified: boolean;
}

/* =========================================================
   MOCK PROFILE
========================================================= */

const initialProfile: FreelancerProfile = {
  firstName: "Krishna",
  lastName: "Creator",

  email: "creator@example.com",

  phone: "+91 98765 43210",

  bio: "Fashion and lifestyle creator passionate about sarees, styling, beauty and authentic storytelling.",

  location: "New Delhi",

  country: "India",

  categories: ["Fashion", "Saree Styling", "Lifestyle", "Beauty"],

  languages: ["English", "Hindi"],

  socialAccounts: [
    {
      platform: "Instagram",
      username: "@mysmmecreator",
      followers: 42500,
      url: "https://instagram.com/mysmmecreator",
      connected: true,
    },

    {
      platform: "YouTube",
      username: "MYSMME Creator",
      followers: 18200,
      url: "https://youtube.com",
      connected: true,
    },
  ],

  profileImage:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",

  portfolio: [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",

    "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=600&q=80",

    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
  ],

  isVerified: true,
};

/* =========================================================
   OPTIONS
========================================================= */

const categoryOptions = [
  "Fashion",
  "Saree Styling",
  "Beauty",
  "Lifestyle",
  "Travel",
  "Food",
  "Fitness",
  "Technology",
  "Finance",
  "Parenting",
];

const languageOptions = [
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
];

/* =========================================================
   PAGE
========================================================= */

export default function FreelancerProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<FreelancerProfile>(initialProfile);

  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);

  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  /* =====================================================
     FORM UPDATE
  ===================================================== */

  const updateField = (field: keyof FreelancerProfile, value: string) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =====================================================
     CATEGORY
  ===================================================== */

  const toggleCategory = (category: string) => {
    setProfile((previous) => {
      const exists = previous.categories.includes(category);

      return {
        ...previous,
        categories: exists
          ? previous.categories.filter((item) => item !== category)
          : [...previous.categories, category],
      };
    });
  };

  /* =====================================================
     LANGUAGE
  ===================================================== */

  const toggleLanguage = (language: string) => {
    setProfile((previous) => {
      const exists = previous.languages.includes(language);

      return {
        ...previous,
        languages: exists
          ? previous.languages.filter((item) => item !== language)
          : [...previous.languages, language],
      };
    });
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave = async () => {
    setSaving(true);

    try {
      /*
       * TODO:
       * Replace this with your RTK Query mutation
       * once the freelancer API is connected.
       */

      await new Promise((resolve) => setTimeout(resolve, 800));

      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     SOCIAL CONNECT
  ===================================================== */

  const handleConnectSocial = (platform: SocialPlatform) => {
    /*
     * Later this will start the real OAuth flow.
     *
     * Instagram:
     * Instagram Graph API / Meta OAuth
     *
     * YouTube:
     * Google OAuth / YouTube Data API
     */

    alert(
      `${platform} connection will be available after API/OAuth integration.`,
    );
  };

  /* =====================================================
     REMOVE SOCIAL
  ===================================================== */

  const handleDisconnectSocial = (platform: SocialPlatform) => {
    setProfile((previous) => ({
      ...previous,

      socialAccounts: previous.socialAccounts.map((account) =>
        account.platform === platform
          ? {
              ...account,
              connected: false,
            }
          : account,
      ),
    }));
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-[1500px] p-5 sm:p-7 lg:p-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => router.push("/platform/freelancer")}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-violet-600"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-700">
                <Sparkles size={11} />
                MYSMME Creator
              </span>

              {profile.isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600">
                  <CheckCircle2 size={12} />
                  Verified
                </span>
              )}
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your creator profile, social accounts, portfolio and
              information used for MYSMME campaigns.
            </p>
          </div>

          {/* EDIT / SAVE */}

          <div className="flex gap-3">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />

                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* =================================================
            PROFILE HERO
        ================================================= */}

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 sm:h-36" />

          <div className="px-6 pb-6 sm:px-8">
            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                {/* AVATAR */}

                <div className="relative">
                  <div className="h-28 w-28 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-lg sm:h-32 sm:w-32">
                    <img
                      src={profile.profileImage}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {editing && (
                    <button
                      type="button"
                      className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-700"
                    >
                      <Camera size={16} />
                    </button>
                  )}
                </div>

                {/* NAME */}

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {profile.firstName} {profile.lastName}
                    </h2>

                    {profile.isVerified && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white">
                        <Check size={12} />
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Fashion & Lifestyle Creator
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} />
                      {profile.location}, {profile.country}
                    </span>

                    <span className="flex items-center gap-1">
                      <Globe2 size={13} />
                      Available for campaigns
                    </span>
                  </div>
                </div>
              </div>

              {/* CREATOR SCORE */}

              <div className="rounded-xl bg-violet-50 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-violet-500">
                  Creator Profile
                </p>

                <div className="mt-1 flex items-end gap-2">
                  <span className="text-2xl font-bold text-violet-700">
                    92%
                  </span>

                  <span className="pb-1 text-xs text-violet-500">Complete</span>
                </div>

                <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-violet-100">
                  <div className="h-full w-[92%] rounded-full bg-violet-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6">
            {/* BASIC INFORMATION */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionHeader
                title="Basic Information"
                description="Your personal information used for campaign communication."
                icon={<User size={18} />}
              />

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <InputField
                  label="First Name"
                  value={profile.firstName}
                  disabled={!editing}
                  onChange={(value) => updateField("firstName", value)}
                />

                <InputField
                  label="Last Name"
                  value={profile.lastName}
                  disabled={!editing}
                  onChange={(value) => updateField("lastName", value)}
                />

                <InputField
                  label="Email"
                  value={profile.email}
                  disabled={!editing}
                  icon={<Mail size={15} />}
                  onChange={(value) => updateField("email", value)}
                />

                <InputField
                  label="Phone"
                  value={profile.phone}
                  disabled={!editing}
                  onChange={(value) => updateField("phone", value)}
                />

                <InputField
                  label="City"
                  value={profile.location}
                  disabled={!editing}
                  icon={<MapPin size={15} />}
                  onChange={(value) => updateField("location", value)}
                />

                <InputField
                  label="Country"
                  value={profile.country}
                  disabled={!editing}
                  onChange={(value) => updateField("country", value)}
                />
              </div>

              {/* BIO */}

              <div className="mt-5">
                <label className="text-xs font-semibold text-slate-700">
                  Creator Bio
                </label>

                <textarea
                  value={profile.bio}
                  disabled={!editing}
                  onChange={(event) => updateField("bio", event.target.value)}
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 disabled:cursor-default disabled:bg-slate-50"
                />
              </div>
            </section>

            {/* CATEGORIES */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionHeader
                title="Content Categories"
                description="Select the types of content you create."
                icon={<Sparkles size={18} />}
              />

              <div className="mt-5 flex flex-wrap gap-2">
                {profile.categories.map((category) => (
                  <span
                    key={category}
                    className="flex items-center gap-2 rounded-full bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700"
                  >
                    {category}

                    {editing && (
                      <button
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className="rounded-full hover:bg-violet-100"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {editing && (
                <div className="relative mt-5">
                  <button
                    type="button"
                    onClick={() => setShowCategoryMenu((value) => !value)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:border-violet-300"
                  >
                    Add Category
                    <ChevronDown size={14} />
                  </button>

                  {showCategoryMenu && (
                    <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                      {categoryOptions.map((category) => {
                        const selected = profile.categories.includes(category);

                        return (
                          <button
                            type="button"
                            key={category}
                            onClick={() => toggleCategory(category)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs hover:bg-violet-50"
                          >
                            {category}

                            {selected && (
                              <Check size={14} className="text-violet-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* LANGUAGES */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionHeader
                title="Languages"
                description="Languages you can create content and communicate in."
                icon={<Globe2 size={18} />}
              />

              <div className="mt-5 flex flex-wrap gap-2">
                {profile.languages.map((language) => (
                  <span
                    key={language}
                    className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600"
                  >
                    {language}

                    {editing && (
                      <button
                        type="button"
                        onClick={() => toggleLanguage(language)}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {editing && (
                <div className="relative mt-5">
                  <button
                    type="button"
                    onClick={() => setShowLanguageMenu((value) => !value)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:border-violet-300"
                  >
                    Add Language
                    <ChevronDown size={14} />
                  </button>

                  {showLanguageMenu && (
                    <div className="absolute left-0 top-full z-20 mt-2 max-h-64 w-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                      {languageOptions.map((language) => {
                        const selected = profile.languages.includes(language);

                        return (
                          <button
                            type="button"
                            key={language}
                            onClick={() => toggleLanguage(language)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs hover:bg-violet-50"
                          >
                            {language}

                            {selected && (
                              <Check size={14} className="text-violet-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* PORTFOLIO */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionHeader
                title="Creator Portfolio"
                description="Show brands the quality and style of your content."
                icon={<Sparkles size={18} />}
              />

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {profile.portfolio.map((image, index) => (
                  <div
                    key={image}
                    className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-slate-100"
                  >
                    <img
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition group-hover:opacity-100" />

                    {editing && (
                      <button
                        type="button"
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}

                {editing && (
                  <button
                    type="button"
                    className="flex aspect-[4/5] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                  >
                    <Camera size={22} />

                    <span className="mt-2 text-xs font-semibold">Add Work</span>
                  </button>
                )}
              </div>
            </section>
          </div>

          {/* =================================================
              RIGHT
          ================================================= */}

          <div className="space-y-6">
            {/* SOCIAL ACCOUNTS */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                title="Social Accounts"
                description="Connect your creator accounts for campaigns."
                icon={<Users size={18} />}
              />

              <div className="mt-5 space-y-4">
                {profile.socialAccounts.map((account) => (
                  <SocialAccountCard
                    key={account.platform}
                    account={account}
                    onConnect={() => handleConnectSocial(account.platform)}
                    onDisconnect={() =>
                      handleDisconnectSocial(account.platform)
                    }
                  />
                ))}
              </div>

              <div className="mt-5 rounded-xl bg-amber-50 p-4">
                <p className="text-xs font-semibold text-amber-800">
                  Why connect your accounts?
                </p>

                <p className="mt-1 text-[11px] leading-5 text-amber-700">
                  Connected accounts allow MYSMME to verify your audience size
                  and match you with suitable campaigns.
                </p>
              </div>
            </section>

            {/* CREATOR STATS */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                title="Creator Statistics"
                description="Your current social reach."
                icon={<Users size={18} />}
              />

              <div className="mt-5 space-y-3">
                {profile.socialAccounts.map((account) => (
                  <div
                    key={account.platform}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={account.platform} />

                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          {account.platform}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {account.username}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">
                        {formatFollowers(account.followers)}
                      </p>

                      <p className="text-[9px] uppercase tracking-wide text-slate-400">
                        {account.platform === "Instagram"
                          ? "Followers"
                          : "Subscribers"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CAMPAIGN ELIGIBILITY */}

            <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                  <Sparkles size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Campaign Eligibility
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your current profile qualifies you for the following creator
                    campaigns.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <EligibilityItem text="Fashion campaigns" />

                <EligibilityItem text="Saree & ethnic wear campaigns" />

                <EligibilityItem text="Instagram campaigns" />

                <EligibilityItem text="Lifestyle campaigns" />
              </div>
            </section>

            {/* PAYMENT */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                title="Payment Profile"
                description="Manage how your campaign earnings are paid."
                icon={<IndianRupee size={18} />}
              />

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Payment details
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Not configured
                    </p>
                  </div>

                  <button
                    type="button"
                    className="text-xs font-semibold text-violet-600 hover:text-violet-700"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* =================================================
            FOOTER NOTE
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-800">
                Keep your profile updated
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                Brands use your profile, audience information and portfolio to
                determine campaign eligibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
        {icon}
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>

        <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
      </div>
    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  value,
  disabled,
  icon,
  onChange,
}: {
  label: string;
  value: string;
  disabled: boolean;
  icon?: React.ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-700">{label}</label>

      <div className="relative mt-2">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition ${
            icon ? "pl-10" : ""
          } ${
            disabled
              ? "cursor-default bg-slate-50"
              : "bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
          }`}
        />
      </div>
    </div>
  );
}

/* =========================================================
   SOCIAL ACCOUNT CARD
========================================================= */

function SocialAccountCard({
  account,
  onConnect,
  onDisconnect,
}: {
  account: SocialAccount;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const isInstagram = account.platform === "Instagram";

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <PlatformIcon platform={account.platform} />

          <div>
            <p className="text-xs font-bold text-slate-800">
              {account.platform}
            </p>

            <p className="mt-0.5 text-[10px] text-slate-400">
              {account.username}
            </p>
          </div>
        </div>

        {account.connected && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-600">
            <CheckCircle2 size={11} />
            Connected
          </span>
        )}
      </div>

      {account.connected ? (
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">
              {formatFollowers(account.followers)}
            </p>

            <p className="text-[9px] uppercase tracking-wide text-slate-400">
              {isInstagram ? "Followers" : "Subscribers"}
            </p>
          </div>

          <button
            type="button"
            onClick={onDisconnect}
            className="text-[10px] font-semibold text-red-500 hover:text-red-600"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onConnect}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-white ${
            isInstagram
              ? "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isInstagram ? <FaInstagram size={15} /> : <FaYoutube size={15} />}
          Connect {account.platform}
        </button>
      )}
    </div>
  );
}

/* =========================================================
   PLATFORM ICON
========================================================= */

function PlatformIcon({ platform }: { platform: SocialPlatform }) {
  const isInstagram = platform === "Instagram";

  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
        isInstagram ? "bg-pink-50 text-pink-600" : "bg-red-50 text-red-600"
      }`}
    >
      {isInstagram ? <FaInstagram size={19} /> : <FaYoutube size={19} />}
    </div>
  );
}

/* =========================================================
   ELIGIBILITY ITEM
========================================================= */

function EligibilityItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <Check size={11} />
      </div>

      <span className="text-xs font-medium text-slate-600">{text}</span>
    </div>
  );
}

/* =========================================================
   FORMAT FOLLOWERS
========================================================= */

function formatFollowers(followers: number) {
  if (followers >= 1000000) {
    return `${(followers / 1000000).toFixed(1)}M`;
  }

  if (followers >= 1000) {
    return `${(followers / 1000).toFixed(1)}K`;
  }

  return followers.toString();
}
