"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileVideo,
  Loader2,
  Save,
  Send,
  XCircle,
} from "lucide-react";

import {
  useGetMyReelQuery,
  useCreateReelSubmissionMutation,
  useUpdateReelSubmissionMutation,
  useSubmitReelMutation,
} from "@/store/api/reelApi";

interface FormState {
  title: string;
  caption: string;
  videoUrl: string;
  thumbnailUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
}

function getRouteId(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function isValidUrl(value: string) {
  if (!value.trim()) return false;

  try {
    new URL(value.trim());
    return true;
  } catch {
    return false;
  }
}

export default function ReelEditPage() {
  const router = useRouter();
  const params = useParams();

  const reelId = getRouteId(params?.reelId);

  const [form, setForm] = useState<FormState>({
    title: "",
    caption: "",
    videoUrl: "",
    thumbnailUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    data: reel,
    isLoading,
    isError,
  } = useGetMyReelQuery(reelId, {
    skip: !reelId,
  });

  const [updateReel, { isLoading: isUpdating }] =
    useUpdateReelSubmissionMutation();

  const [submitReel, { isLoading: isSubmitting }] = useSubmitReelMutation();

  useEffect(() => {
    if (!reel) return;

    setForm({
      title: reel.title ?? "",
      caption: reel.caption ?? "",
      videoUrl: reel.videoUrl ?? "",
      thumbnailUrl: reel.thumbnailUrl ?? "",
      instagramUrl: reel.instagramUrl ?? "",
      youtubeUrl: reel.youtubeUrl ?? "",
    });
  }, [reel]);

  const validation = useMemo(() => {
    const errors: string[] = [];

    if (!form.title.trim()) {
      errors.push("Reel title is required.");
    }

    if (!form.videoUrl.trim()) {
      errors.push("Video URL is required.");
    } else if (!isValidUrl(form.videoUrl)) {
      errors.push("Video URL is invalid.");
    }

    if (form.thumbnailUrl.trim() && !isValidUrl(form.thumbnailUrl)) {
      errors.push("Thumbnail URL is invalid.");
    }

    if (form.instagramUrl.trim() && !isValidUrl(form.instagramUrl)) {
      errors.push("Instagram URL is invalid.");
    }

    if (form.youtubeUrl.trim() && !isValidUrl(form.youtubeUrl)) {
      errors.push("YouTube URL is invalid.");
    }

    return errors;
  }, [form]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setMessage(null);
  };

  const handleSave = async () => {
    if (!reelId) {
      setMessage({
        type: "error",
        text: "Reel ID is missing.",
      });

      return;
    }

    if (validation.length > 0) {
      setMessage({
        type: "error",
        text: validation[0],
      });

      return;
    }

    try {
      await updateReel({
        id: reelId,
        title: form.title.trim(),
        caption: form.caption.trim() || undefined,
        videoUrl: form.videoUrl.trim(),
        thumbnailUrl: form.thumbnailUrl.trim() || undefined,
        instagramUrl: form.instagramUrl.trim() || undefined,
        youtubeUrl: form.youtubeUrl.trim() || undefined,
      }).unwrap();

      setMessage({
        type: "success",
        text: "Reel saved successfully.",
      });
    } catch (error: any) {
      console.error(error);

      setMessage({
        type: "error",
        text: error?.data?.message || "Unable to save the reel.",
      });
    }
  };

  const handleSubmit = async () => {
    if (!reelId) return;

    if (validation.length > 0) {
      setMessage({
        type: "error",
        text: validation[0],
      });

      return;
    }

    try {
      await updateReel({
        id: reelId,
        title: form.title.trim(),
        caption: form.caption.trim() || undefined,
        videoUrl: form.videoUrl.trim(),
        thumbnailUrl: form.thumbnailUrl.trim() || undefined,
        instagramUrl: form.instagramUrl.trim() || undefined,
        youtubeUrl: form.youtubeUrl.trim() || undefined,
      }).unwrap();

      await submitReel(reelId).unwrap();

      setMessage({
        type: "success",
        text: "Your reel has been submitted for review.",
      });
    } catch (error: any) {
      console.error(error);

      setMessage({
        type: "error",
        text: error?.data?.message || "Failed to submit reel.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 size={20} className="animate-spin text-violet-600" />
          Loading reel...
        </div>
      </div>
    );
  }

  if (isError || !reel) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
            <div className="flex items-center gap-3 text-red-700">
              <XCircle size={20} />

              <div>
                <h2 className="font-semibold">Reel not found</h2>

                <p className="mt-1 text-sm text-red-600">
                  This reel may have been removed or you may not have access to
                  it.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/platform/freelancer/reels")}
              className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm"
            >
              Back to My Reels
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isEditable = ["draft", "changes_requested", "rejected"].includes(
    reel.status,
  );

  const isBusy = isUpdating || isSubmitting;

  return (
    <div className="min-h-full bg-[#f8f9fc]">
      <div className="mx-auto max-w-5xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
        {/* HEADER */}

        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push("/platform/freelancer/reels")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to My Reels
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                <FileVideo size={12} />
                Reel Editor
              </div>

              <h1 className="mt-4 text-3xl font-bold text-slate-900">
                Edit Your Reel
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Update your campaign content before sending it to admin review.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
              <Clock3 size={14} />
              {reel.status || "draft"}
            </span>
          </div>
        </div>

        {/* MESSAGE */}

        {message && (
          <div
            className={`mt-5 rounded-2xl border p-4 text-sm ${
              message.type === "success"
                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                : "border-red-100 bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* FORM */}

        <div className="mt-5 space-y-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-base font-semibold text-slate-900">
              Content Information
            </h2>

            <div className="mt-6">
              <label className="text-xs font-semibold text-slate-700">
                Reel Title *
              </label>

              <input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                disabled={!isEditable || isBusy}
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 disabled:bg-slate-50"
                placeholder="Enter reel title"
              />
            </div>

            <div className="mt-5">
              <label className="text-xs font-semibold text-slate-700">
                Caption
              </label>

              <textarea
                value={form.caption}
                onChange={(e) => updateField("caption", e.target.value)}
                disabled={!isEditable || isBusy}
                rows={5}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 disabled:bg-slate-50"
                placeholder="Write your caption..."
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-base font-semibold text-slate-900">Video</h2>

            <div className="mt-5">
              <label className="text-xs font-semibold text-slate-700">
                Video URL *
              </label>

              <input
                type="url"
                value={form.videoUrl}
                onChange={(e) => updateField("videoUrl", e.target.value)}
                disabled={!isEditable || isBusy}
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 disabled:bg-slate-50"
                placeholder="https://..."
              />
            </div>

            <div className="mt-5">
              <label className="text-xs font-semibold text-slate-700">
                Thumbnail URL
              </label>

              <input
                type="url"
                value={form.thumbnailUrl}
                onChange={(e) => updateField("thumbnailUrl", e.target.value)}
                disabled={!isEditable || isBusy}
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 disabled:bg-slate-50"
                placeholder="https://..."
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-base font-semibold text-slate-900">
              Social Media Links
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Instagram URL
                </label>

                <input
                  type="url"
                  value={form.instagramUrl}
                  onChange={(e) => updateField("instagramUrl", e.target.value)}
                  disabled={!isEditable || isBusy}
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 disabled:bg-slate-50"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  YouTube URL
                </label>

                <input
                  type="url"
                  value={form.youtubeUrl}
                  onChange={(e) => updateField("youtubeUrl", e.target.value)}
                  disabled={!isEditable || isBusy}
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 disabled:bg-slate-50"
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </section>

          {/* VALIDATION */}

          {validation.length > 0 && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-800">
                Please fix the following:
              </p>

              <ul className="mt-2 space-y-1">
                {validation.map((error) => (
                  <li key={error} className="text-xs text-amber-700">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ACTIONS */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/platform/freelancer/reels")}
                disabled={isBusy}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              {isEditable && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isBusy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-5 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-100 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}

                  {isUpdating ? "Saving..." : "Save Draft"}
                </button>
              )}

              {isEditable && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isBusy || validation.length > 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}

                  {isSubmitting ? "Submitting..." : "Submit for Review"}
                </button>
              )}

              {!isEditable && (
                <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={16} />
                  Submission Locked
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
