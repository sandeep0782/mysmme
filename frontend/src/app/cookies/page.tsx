"use client";

import React, { useEffect, useState } from "react";
import {
  Cookie,
  ShieldCheck,
  Settings2,
  BarChart3,
  Megaphone,
  SlidersHorizontal,
  Clock3,
  Globe2,
  RefreshCcw,
  Mail,
  ChevronRight,
  CheckCircle2,
  LockKeyhole,
  Save,
} from "lucide-react";
import Link from "next/link";

type CookiePreferences = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "cookie-consent";

const defaultPreferences: CookiePreferences = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

const cookieSections = [
  {
    icon: Cookie,
    title: "What Are Cookies?",
    description:
      "Cookies are small text files stored on your device when you visit a website. They help websites function correctly, remember preferences, and improve the browsing experience.",
  },
  {
    icon: ShieldCheck,
    title: "Strictly Necessary Cookies",
    description:
      "These cookies support essential website functions such as authentication, security, shopping carts, and checkout. They cannot be disabled through our cookie preference settings.",
  },
  {
    icon: Settings2,
    title: "Functional Cookies",
    description:
      "Functional cookies help remember your preferences, such as language, display settings, and other personalized browsing options.",
  },
  {
    icon: BarChart3,
    title: "Analytics Cookies",
    description:
      "With your permission, analytics cookies help us understand how visitors use our website, which pages are visited, and how we can improve website performance.",
  },
  {
    icon: Megaphone,
    title: "Marketing Cookies",
    description:
      "With your permission, marketing cookies may be used to measure advertising campaigns and display more relevant promotional content.",
  },
  {
    icon: Globe2,
    title: "Third-Party Cookies",
    description:
      "Some website features may rely on third-party service providers, such as payment gateways, analytics platforms, or advertising services. Their use of cookies is governed by the applicable privacy practices.",
  },
  {
    icon: Clock3,
    title: "How Long Do Cookies Last?",
    description:
      "Session cookies generally expire when your browser session ends. Persistent cookies remain for a specified period or until you delete them. Actual retention periods depend on the cookies used.",
  },
  {
    icon: RefreshCcw,
    title: "Updates to This Policy",
    description:
      "We may update this Cookie Policy to reflect changes in our website, technologies, or applicable legal requirements. The latest version will be published on this page.",
  },
];

const preferenceOptions = [
  {
    key: "necessary" as const,
    icon: LockKeyhole,
    title: "Strictly Necessary",
    description:
      "Required for secure login, shopping cart, checkout, and essential website functionality.",
  },
  {
    key: "functional" as const,
    icon: Settings2,
    title: "Functional Cookies",
    description:
      "Remember your preferences and improve your browsing experience.",
  },
  {
    key: "analytics" as const,
    icon: BarChart3,
    title: "Analytics Cookies",
    description: "Help us understand website usage and improve performance.",
  },
  {
    key: "marketing" as const,
    icon: Megaphone,
    title: "Marketing Cookies",
    description:
      "Help measure campaigns and provide more relevant advertising.",
  },
];

export default function CookiesPage() {
  const [preferences, setPreferences] =
    useState<CookiePreferences>(defaultPreferences);

  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        setPreferences({
          necessary: true,
          functional: parsed.functional === true,
          analytics: parsed.analytics === true,
          marketing: parsed.marketing === true,
        });
      }
    } catch {
      // Keep optional cookies disabled.
    }

    setMounted(true);
  }, []);

  const savePreferences = (value: CookiePreferences) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...value,
          savedAt: new Date().toISOString(),
        }),
      );

      setPreferences(value);
      setSaved(true);

      window.dispatchEvent(
        new CustomEvent("cookie-consent-updated", {
          detail: value,
        }),
      );

      window.setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaved(false);
      alert("Unable to save preferences in this browser.");
    }
  };

  const togglePreference = (key: "functional" | "analytics" | "marketing") => {
    setSaved(false);

    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
  };

  const rejectOptional = () => {
    savePreferences(defaultPreferences);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/70">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="transition-colors hover:text-red-600">
              Home
            </Link>

            <ChevronRight size={14} />

            <span className="font-semibold text-gray-900">Cookie Policy</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-red-50/70 to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-xs font-semibold text-red-600 shadow-sm">
              <ShieldCheck size={15} />
              Privacy & Transparency
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Cookie <span className="text-red-600">Policy</span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
              We believe in providing a transparent and secure shopping
              experience. Learn how cookies work, why we may use them, and how
              you can manage your preferences.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="inline-flex items-center gap-2">
                <Clock3 size={15} className="text-red-600" />
                Last updated: November 2026
              </span>

              <span className="inline-flex items-center gap-2">
                <LockKeyhole size={15} className="text-red-600" />
                Your privacy matters
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Policy Content */}
            <div className="space-y-5 lg:col-span-8">
              <div className="mb-7">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Understanding Our Cookies
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  The following sections explain the different types of cookies
                  and their purposes.
                </p>
              </div>

              {cookieSections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <article
                    key={section.title}
                    className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-red-100 hover:shadow-md sm:p-7"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100 transition-all duration-300 group-hover:scale-105 group-hover:bg-red-600 group-hover:text-white">
                        <Icon size={21} strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0">
                        <div className="mb-2 flex items-center gap-3">
                          <span className="text-xs font-bold text-red-500">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <h3 className="text-base font-bold text-gray-900 transition-colors group-hover:text-red-600">
                            {section.title}
                          </h3>
                        </div>

                        <p className="text-sm leading-7 text-gray-600">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* Contact */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100">
                    <Mail size={21} strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Questions About Cookies?
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-gray-600">
                      If you have questions about our use of cookies or your
                      privacy, please contact our support team.
                    </p>

                    <Link
                      href="/contact-us"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
                    >
                      Contact Support
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-red-50/50 p-6">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-red-600 ring-1 ring-red-100">
                    <SlidersHorizontal size={21} />
                  </div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Cookie Preferences
                  </h2>

                  <p className="mt-2 text-xs leading-6 text-gray-600">
                    Control how optional cookies are used on your device.
                  </p>
                </div>

                <div className="divide-y divide-gray-100 px-5">
                  {preferenceOptions.map((option) => {
                    const Icon = option.icon;
                    const isNecessary = option.key === "necessary";

                    const enabled = isNecessary
                      ? true
                      : preferences[option.key];

                    return (
                      <div key={option.key} className="py-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="mt-0.5 text-red-600">
                              <Icon size={18} />
                            </div>

                            <div>
                              <h3 className="text-sm font-semibold text-gray-900">
                                {option.title}
                              </h3>

                              <p className="mt-1 text-xs leading-5 text-gray-500">
                                {option.description}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            role="switch"
                            aria-label={option.title}
                            aria-checked={enabled}
                            disabled={isNecessary || !mounted}
                            onClick={() => {
                              if (!isNecessary) {
                                togglePreference(option.key);
                              }
                            }}
                            className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                              enabled ? "bg-red-600" : "bg-gray-200"
                            } ${
                              isNecessary
                                ? "cursor-not-allowed opacity-70"
                                : "cursor-pointer"
                            }`}
                          >
                            <span
                              className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                enabled ? "translate-x-5" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {isNecessary && (
                          <p className="mt-2 pl-7 text-[11px] font-medium text-red-600">
                            Always Active
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 border-t border-gray-100 p-5">
                  <button
                    type="button"
                    disabled={!mounted}
                    onClick={() => savePreferences(preferences)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-md disabled:opacity-50"
                  >
                    {saved ? (
                      <>
                        <CheckCircle2 size={17} />
                        Preferences Saved
                      </>
                    ) : (
                      <>
                        <Save size={17} />
                        Save Preferences
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={!mounted}
                    onClick={acceptAll}
                    className="w-full rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                  >
                    Accept All Cookies
                  </button>

                  <button
                    type="button"
                    disabled={!mounted}
                    onClick={rejectOptional}
                    className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    Reject Optional Cookies
                  </button>

                  <p className="text-center text-[11px] leading-5 text-gray-400">
                    You can update your preferences at any time.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Bottom Privacy Section */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Your Privacy Is Important to Us
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                  Learn more about how we handle personal information and
                  protect your data.
                </p>
              </div>
            </div>

            <Link
              href="/privacy-policy"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-md"
            >
              Privacy Policy
              <ChevronRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
