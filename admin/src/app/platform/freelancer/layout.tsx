"use client";

import React, { useEffect, useMemo, useState, type ReactNode } from "react";

import { usePathname, useRouter } from "next/navigation";

import FreelancerNavbar from "@/components/Freelancer/FreelancerNavbar";
import FreelancerSidebar from "@/components/Freelancer/FreelancerSidebar";

/* =========================================================
   API URL
========================================================= */

const getApiUrl = () => {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const cleanUrl = rawUrl.replace(/\/$/, "");

  return cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
};

const API_URL = getApiUrl();

/* =========================================================
   TYPES
========================================================= */

interface CreatorProfile {
  bio?: string;

  location?: string;
  city?: string;
  state?: string;
  country?: string;

  category?: string;
  categories?: string[];

  languages?: string[];
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

/* =========================================================
   LAYOUT
========================================================= */

export default function FreelancerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(
    null,
  );

  const [profileLoading, setProfileLoading] = useState(true);

  const [profileFetched, setProfileFetched] = useState(false);

  const [profileError, setProfileError] = useState("");

  /* =====================================================
     SIDEBAR
  ===================================================== */

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  /* =====================================================
     PROFILE PAGE EXCEPTION
  ===================================================== */

  const isProfilePage = pathname === "/platform/freelancer/profile";

  /* =====================================================
     FETCH CREATOR PROFILE
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    const fetchCreatorProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError("");

        const url = `${API_URL}/freelancer/profile`;

        console.log("FREELANCER PROFILE CHECK:", url);

        const res = await fetch(url, {
          method: "GET",

          credentials: "include",

          headers: {
            Accept: "application/json",
          },

          cache: "no-store",
        });

        /*
         * CreatorProfile not found.
         * Treat as incomplete profile.
         */
        if (res.status === 404) {
          if (mounted) {
            setCreatorProfile(null);
            setProfileFetched(true);
          }

          return;
        }

        const text = await res.text();

        let result: ApiResponse<CreatorProfile> | CreatorProfile | null = null;

        try {
          result = text ? JSON.parse(text) : null;
        } catch {
          if (mounted) {
            setProfileError(`Invalid server response. Status: ${res.status}`);
          }

          return;
        }

        if (!res.ok) {
          const apiResult = result as ApiResponse<CreatorProfile>;

          if (mounted) {
            setProfileError(
              apiResult?.message ||
                `Unable to load profile. Status: ${res.status}`,
            );
          }

          return;
        }

        const profile =
          result && typeof result === "object" && "data" in result
            ? (result as ApiResponse<CreatorProfile>).data
            : (result as CreatorProfile);

        if (mounted) {
          setCreatorProfile(profile || null);

          setProfileFetched(true);
        }
      } catch (error) {
        console.error("FREELANCER PROFILE CHECK ERROR:", error);

        if (mounted) {
          setProfileError("Unable to verify creator profile.");
        }
      } finally {
        if (mounted) {
          setProfileLoading(false);
        }
      }
    };

    fetchCreatorProfile();

    return () => {
      mounted = false;
    };
  }, [pathname]);

  /* =====================================================
     NORMALIZE PROFILE
  ===================================================== */

  const categories = useMemo(() => {
    if (Array.isArray(creatorProfile?.categories)) {
      return creatorProfile.categories;
    }

    if (creatorProfile?.category?.trim()) {
      return [creatorProfile.category.trim()];
    }

    return [];
  }, [creatorProfile]);

  const languages = useMemo(() => {
    return Array.isArray(creatorProfile?.languages)
      ? creatorProfile.languages
      : [];
  }, [creatorProfile]);

  const profileLocation = useMemo(() => {
    if (creatorProfile?.location?.trim()) {
      return creatorProfile.location.trim();
    }

    const parts = [creatorProfile?.city, creatorProfile?.state]
      .filter(Boolean)
      .map((item) => item?.trim())
      .filter(Boolean);

    return parts.join(", ");
  }, [creatorProfile]);

  /* =====================================================
     PROFILE COMPLETION
  ===================================================== */

  const profileChecks = useMemo(
    () => [
      Boolean(creatorProfile?.bio?.trim()),

      Boolean(profileLocation),

      Boolean(creatorProfile?.country?.trim()),

      categories.length > 0,

      languages.length > 0,
    ],
    [creatorProfile, profileLocation, categories, languages],
  );

  const profileComplete = profileChecks.every(Boolean);

  /* =====================================================
     GLOBAL REDIRECT
  ===================================================== */

  useEffect(() => {
    if (profileLoading) {
      return;
    }

    if (!profileFetched) {
      return;
    }

    /*
     * Don't redirect because of temporary API errors.
     */
    if (profileError) {
      return;
    }

    /*
     * IMPORTANT:
     * profile page must remain accessible,
     * otherwise redirect loop will happen.
     */
    if (isProfilePage) {
      return;
    }

    if (!profileComplete) {
      router.replace("/platform/freelancer/profile");
    }
  }, [
    profileLoading,
    profileFetched,
    profileError,
    profileComplete,
    isProfilePage,
    router,
  ]);

  /* =====================================================
     LOADING WHILE CHECKING
  ===================================================== */

  if (
    !isProfilePage &&
    (profileLoading || (profileFetched && !profileComplete && !profileError))
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Checking your creator profile...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Complete your profile before accessing Creator Studio.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     LAYOUT
  ===================================================== */

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* SIDEBAR */}

      <FreelancerSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* MAIN */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* NAVBAR */}

        <FreelancerNavbar toggleSidebar={toggleSidebar} />

        {/* PROFILE API ERROR */}

        {profileError && (
          <div className="border-b border-amber-200 bg-amber-50 px-5 py-3">
            <p className="text-xs text-amber-700">{profileError}</p>
          </div>
        )}

        {/* CONTENT */}

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-[#f7f7f8]">
          {children}
        </main>
      </div>
    </div>
  );
}
