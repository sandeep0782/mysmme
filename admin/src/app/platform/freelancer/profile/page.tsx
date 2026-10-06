"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
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
  X,
} from "lucide-react";

import { FaInstagram } from "react-icons/fa";

/* =========================================================
   API URL
========================================================= */

const getApiUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const clean = raw.replace(/\/$/, "");

  return clean.endsWith("/api") ? clean : `${clean}/api`;
};

const API_URL = getApiUrl();

/* =========================================================
   TYPES
========================================================= */

interface UserData {
  _id?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: string;
  role?: string;
  isVerified?: boolean;
}

interface CreatorProfileApi {
  _id?: string;

  user?: UserData | string;

  bio?: string;
  location?: string;
  country?: string;

  categories?: string[];
  languages?: string[];

  expectedPrice?: number;

  instagramUsername?: string;
  instagramUserId?: string;

  followersCount?: number;
  mediaCount?: number;

  avgReelViews?: number;
  avgLikes?: number;
  avgComments?: number;
  engagementRate?: number;

  reelsLast30Days?: number;

  creatorScore?: number;

  creatorTier?: "Elite" | "A" | "B" | "C" | "Review";

  instagramConnected?: boolean;

  isApproved?: boolean;

  lastInstagramSyncAt?: string | null;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

interface ProfileForm {
  firstName: string;
  lastName: string;

  email: string;
  phone: string;

  bio: string;

  location: string;
  country: string;

  categories: string[];
  languages: string[];

  expectedPrice: string;

  instagramUsername: string;

  profileImage: string;

  isVerified: boolean;
}

/* =========================================================
   EMPTY PROFILE
========================================================= */

const emptyProfile: ProfileForm = {
  firstName: "",
  lastName: "",

  email: "",
  phone: "",

  bio: "",

  location: "",
  country: "India",

  categories: [],
  languages: [],

  expectedPrice: "",

  instagramUsername: "",

  profileImage: "",

  isVerified: false,
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

  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);

  const [originalProfile, setOriginalProfile] =
    useState<ProfileForm>(emptyProfile);

  const [creatorData, setCreatorData] = useState<CreatorProfileApi | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  /* =====================================================
     FETCH PROFILE
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const url = `${API_URL}/freelancer/profile`;

        console.log("GET FREELANCER PROFILE:", url);

        const res = await fetch(url, {
          method: "GET",

          credentials: "include",

          headers: {
            Accept: "application/json",
          },

          cache: "no-store",
        });

        const text = await res.text();

        let result: ApiResponse<CreatorProfileApi> | null = null;

        try {
          result = text ? JSON.parse(text) : null;
        } catch {
          throw new Error(`Invalid server response. Status: ${res.status}`);
        }

        if (!res.ok) {
          throw new Error(result?.message || "Unable to load creator profile.");
        }

        const data = result?.data;

        if (!data) {
          throw new Error("Creator profile data not found.");
        }

        if (!mounted) return;

        setCreatorData(data);

        const user =
          data.user && typeof data.user === "object" ? data.user : null;

        const fullName = user?.name?.trim() || "";

        const nameParts = fullName.split(/\s+/);

        const firstName = nameParts[0] || "";

        const lastName = nameParts.slice(1).join(" ");

        const formatted: ProfileForm = {
          firstName,

          lastName,

          email: user?.email || "",

          phone: user?.phoneNumber || "",

          bio: data.bio || "",

          location: data.location || "",

          country: data.country || "India",

          categories: Array.isArray(data.categories) ? data.categories : [],

          languages: Array.isArray(data.languages) ? data.languages : [],

          expectedPrice:
            data.expectedPrice != null ? String(data.expectedPrice) : "",

          instagramUsername: data.instagramUsername || "",

          profileImage: user?.profilePicture || "",

          isVerified: Boolean(user?.isVerified),
        };

        setProfile(formatted);

        setOriginalProfile(formatted);

        /*
         * Automatically open edit mode
         * when required fields are incomplete.
         */

        const complete =
          Boolean(formatted.bio.trim()) &&
          Boolean(formatted.location.trim()) &&
          Boolean(formatted.country.trim()) &&
          formatted.categories.length > 0 &&
          formatted.languages.length > 0;

        if (!complete) {
          setEditing(true);
        }
      } catch (err: any) {
        console.error("GET PROFILE ERROR:", err);

        if (mounted) {
          setError(err?.message || "Unable to load profile.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
     UPDATE FIELD
  ===================================================== */

  const updateField = (field: keyof ProfileForm, value: string) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSuccess("");
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

    setSuccess("");
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

    setSuccess("");
  };

  /* =====================================================
     COMPLETION
  ===================================================== */

  const completionChecks = useMemo(
    () => [
      Boolean(profile.bio.trim()),

      Boolean(profile.location.trim()),

      Boolean(profile.country.trim()),

      profile.categories.length > 0,

      profile.languages.length > 0,
    ],
    [profile],
  );

  const completedFields = completionChecks.filter(Boolean).length;

  const profileCompletion = Math.round(
    (completedFields / completionChecks.length) * 100,
  );

  const profileComplete = profileCompletion === 100;

  /* =====================================================
     VALIDATE
  ===================================================== */

  const validateProfile = () => {
    if (!profile.bio.trim()) {
      return "Please enter your creator bio.";
    }

    if (!profile.location.trim()) {
      return "Please enter your city/location.";
    }

    if (!profile.country.trim()) {
      return "Please enter your country.";
    }

    if (profile.categories.length === 0) {
      return "Please select at least one content category.";
    }

    if (profile.languages.length === 0) {
      return "Please select at least one language.";
    }

    if (
      profile.expectedPrice &&
      (Number.isNaN(Number(profile.expectedPrice)) ||
        Number(profile.expectedPrice) < 0)
    ) {
      return "Expected price must be a valid amount.";
    }

    return "";
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave = async () => {
    const validationError = validateProfile();

    if (validationError) {
      setError(validationError);

      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const url = `${API_URL}/freelancer/profile`;

      console.log("PATCH FREELANCER PROFILE:", url);

      const payload = {
        bio: profile.bio.trim(),

        location: profile.location.trim(),

        country: profile.country.trim(),

        categories: profile.categories,

        languages: profile.languages,

        instagramUsername: profile.instagramUsername.trim().replace(/^@/, ""),

        expectedPrice: profile.expectedPrice
          ? Number(profile.expectedPrice)
          : 0,
      };

      console.log("PROFILE PAYLOAD:", payload);

      const res = await fetch(url, {
        method: "PATCH",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",

          Accept: "application/json",
        },

        body: JSON.stringify(payload),
      });

      const text = await res.text();

      let result: ApiResponse<CreatorProfileApi> | null = null;

      try {
        result = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(`Invalid server response. Status: ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(result?.message || "Unable to save profile.");
      }

      const updated = result?.data;

      if (updated) {
        setCreatorData(updated);
      }

      setOriginalProfile(profile);

      setEditing(false);

      setSuccess("Profile updated successfully.");

      /*
       * Important:
       *
       * Redirect only after successful backend save.
       */

      router.replace("/platform/freelancer/dashboard");
    } catch (err: any) {
      console.error("UPDATE PROFILE ERROR:", err);

      setError(err?.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     CANCEL
  ===================================================== */

  const handleCancel = () => {
    /*
     * If profile is incomplete,
     * don't let Cancel hide the form.
     */

    if (!profileComplete) {
      setError("Please complete your profile before continuing.");

      return;
    }

    setProfile(originalProfile);

    setEditing(false);

    setShowCategoryMenu(false);

    setShowLanguageMenu(false);

    setError("");
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading your creator profile...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-[1500px] p-5 sm:p-7 lg:p-8">
        {/* ===============================================
            HEADER
        =============================================== */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => router.push("/platform/freelancer/dashboard")}
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
              Complete your creator profile to access campaigns, reels and other
              Creator Studio features.
            </p>
          </div>

          {/* EDIT / SAVE */}

          <div className="flex gap-3">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
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

        {/* ===============================================
            MESSAGE
        =============================================== */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-sm font-medium text-emerald-700">{success}</p>
          </div>
        )}

        {/* ===============================================
            PROFILE HERO
        =============================================== */}

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 sm:h-36" />

          <div className="px-6 pb-6 sm:px-8">
            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                {/* AVATAR */}

                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="h-28 w-28 rounded-2xl border-4 border-white bg-slate-100 object-cover shadow-lg sm:h-32 sm:w-32"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-violet-100 text-4xl font-bold text-violet-700 shadow-lg sm:h-32 sm:w-32">
                    {profile.firstName.charAt(0).toUpperCase() || "C"}
                  </div>
                )}

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

                  <p className="mt-1 text-sm text-slate-500">MYSMME Creator</p>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    {profile.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />

                        {profile.location}

                        {profile.country ? `, ${profile.country}` : ""}
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <Globe2 size={13} />
                      Available for campaigns
                    </span>
                  </div>
                </div>
              </div>

              {/* COMPLETION */}

              <div className="rounded-xl bg-violet-50 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-violet-500">
                  Creator Profile
                </p>

                <div className="mt-1 flex items-end gap-2">
                  <span className="text-2xl font-bold text-violet-700">
                    {profileCompletion}%
                  </span>

                  <span className="pb-1 text-xs text-violet-500">Complete</span>
                </div>

                <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-violet-100">
                  <div
                    className="h-full rounded-full bg-violet-600 transition-all duration-500"
                    style={{
                      width: `${profileCompletion}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===============================================
            MAIN GRID
        =============================================== */}

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* LEFT */}

          <div className="space-y-6">
            {/* BASIC INFORMATION */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionHeader
                title="Basic Information"
                description="Your information used for creator campaigns."
                icon={<User size={18} />}
              />

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <InputField
                  label="First Name"
                  value={profile.firstName}
                  disabled
                />

                <InputField
                  label="Last Name"
                  value={profile.lastName}
                  disabled
                />

                <InputField
                  label="Email"
                  value={profile.email}
                  disabled
                  icon={<Mail size={15} />}
                />

                <InputField label="Phone" value={profile.phone} disabled />

                <InputField
                  label="City / Location"
                  value={profile.location}
                  disabled={!editing}
                  required
                  icon={<MapPin size={15} />}
                  onChange={(value) => updateField("location", value)}
                />

                <InputField
                  label="Country"
                  value={profile.country}
                  disabled={!editing}
                  required
                  onChange={(value) => updateField("country", value)}
                />
              </div>

              {/* BIO */}

              <div className="mt-5">
                <label className="text-xs font-semibold text-slate-700">
                  Creator Bio <span className="text-red-500">*</span>
                </label>

                <textarea
                  value={profile.bio}
                  disabled={!editing}
                  onChange={(event) => updateField("bio", event.target.value)}
                  rows={4}
                  placeholder="Tell brands about yourself, your content style and your audience..."
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
                      >
                        <X size={13} />
                      </button>
                    )}
                  </span>
                ))}

                {profile.categories.length === 0 && (
                  <span className="text-sm text-slate-400">
                    No category selected.
                  </span>
                )}
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

                {profile.languages.length === 0 && (
                  <span className="text-sm text-slate-400">
                    No language selected.
                  </span>
                )}
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
          </div>

          {/* RIGHT */}

          <div className="space-y-6">
            {/* COLLABORATION PRICE */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                title="Collaboration"
                description="Your expected creator collaboration price."
                icon={<IndianRupee size={18} />}
              />

              <div className="mt-5">
                <InputField
                  label="Expected Price"
                  value={profile.expectedPrice}
                  disabled={!editing}
                  type="number"
                  icon={<IndianRupee size={15} />}
                  onChange={(value) => updateField("expectedPrice", value)}
                />

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  This is your expected rate. Final campaign pricing can still
                  vary.
                </p>
              </div>
            </section>

            {/* INSTAGRAM */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                title="Instagram"
                description="Your Instagram creator account."
                icon={<FaInstagram size={18} />}
              />

              <div className="mt-5">
                <InputField
                  label="Instagram Username"
                  value={profile.instagramUsername}
                  disabled={!editing}
                  placeholder="yourusername"
                  onChange={(value) => updateField("instagramUsername", value)}
                />
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Instagram connection
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {creatorData?.instagramConnected
                        ? "Your Instagram account is connected."
                        : "Instagram API connection has not been completed yet."}
                    </p>
                  </div>

                  {creatorData?.instagramConnected ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 size={13} />
                      Connected
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => router.push("/platform/freelancer/social")}
                      className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>

              {creatorData?.instagramConnected && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <SmallStat
                    label="Followers"
                    value={formatNumber(creatorData.followersCount || 0)}
                  />

                  <SmallStat
                    label="Avg. Reel Views"
                    value={formatNumber(creatorData.avgReelViews || 0)}
                  />

                  <SmallStat
                    label="Engagement"
                    value={`${(creatorData.engagementRate || 0).toFixed(2)}%`}
                  />

                  <SmallStat
                    label="Creator Score"
                    value={`${creatorData.creatorScore || 0}/100`}
                  />
                </div>
              )}
            </section>

            {/* COMPLETION REQUIREMENTS */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Profile Requirements
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Complete these fields to unlock Creator Studio.
              </p>

              <div className="mt-5 space-y-3">
                <Requirement
                  label="Creator bio"
                  complete={Boolean(profile.bio.trim())}
                />

                <Requirement
                  label="City / location"
                  complete={Boolean(profile.location.trim())}
                />

                <Requirement
                  label="Country"
                  complete={Boolean(profile.country.trim())}
                />

                <Requirement
                  label="Content category"
                  complete={profile.categories.length > 0}
                />

                <Requirement
                  label="Language"
                  complete={profile.languages.length > 0}
                />
              </div>
            </section>
          </div>
        </div>

        {/* MOBILE SAVE */}

        {editing && (
          <div className="mt-6 sm:hidden">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Save size={16} />

              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        )}
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
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
        {icon}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

function InputField({
  label,
  value,
  disabled,
  onChange,
  icon,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative mt-2">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => onChange?.(event.target.value)}
          className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 disabled:cursor-default disabled:bg-slate-50 ${
            icon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
  );
}

/* =========================================================
   REQUIREMENT
========================================================= */

function Requirement({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full ${
          complete
            ? "bg-emerald-100 text-emerald-600"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {complete ? (
          <Check size={12} />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        )}
      </div>

      <span
        className={`text-xs ${
          complete ? "font-medium text-slate-700" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   SMALL STAT
========================================================= */

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

/* =========================================================
   NUMBER FORMAT
========================================================= */

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
