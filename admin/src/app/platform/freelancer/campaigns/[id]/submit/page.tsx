"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileVideo,
  LinkIcon,
  Loader2,
  Save,
  Send,
  Upload,
  Video,
  XCircle,
} from "lucide-react";

import { FaInstagram, FaYoutube } from "react-icons/fa";

import {
  useCreateReelSubmissionMutation,
  useGetMyReelQuery,
  useGetMyReelsQuery,
  useSubmitReelMutation,
  useUpdateReelSubmissionMutation,
} from "@/store/api/reelApi";

/* =========================================================
    TYPES
  ========================================================= */

interface FormState {
  title: string;
  caption: string;
  videoUrl: string;
  thumbnailUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
}

/* =========================================================
    HELPERS
  ========================================================= */

function getRouteId(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function isValidUrl(value: string): boolean {
  if (!value.trim()) return false;

  try {
    new URL(value.trim());
    return true;
  } catch {
    return false;
  }
}

/* =========================================================
    PAGE
  ========================================================= */

export default function FreelancerCampaignSubmitPage() {
  const router = useRouter();
  const params = useParams();

  const campaignId = getRouteId(params?.id);

  /* =====================================================
      STATE
    ===================================================== */

  const [reelId, setReelId] = useState("");

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

  const [isSaved, setIsSaved] = useState(false);

  /* =====================================================
      GET FREELANCER REELS
    ===================================================== */

  const {
    data: myReels = [],
    isLoading: isLoadingMyReels,
    isError: isMyReelsError,
  } = useGetMyReelsQuery();

  /* =====================================================
      FIND REEL FOR THIS CAMPAIGN
    ===================================================== */

  useEffect(() => {
    if (!campaignId || !myReels.length) {
      return;
    }

    const campaignReel = myReels.find(
      (reel) => String(reel.campaignId) === String(campaignId),
    );

    if (campaignReel) {
      setReelId(String(campaignReel.id));
    }
  }, [campaignId, myReels]);

  /* =====================================================
      GET SINGLE REEL
    ===================================================== */

  const {
    data: existingReel,
    isLoading: isLoadingReel,
    isError: isReelError,
  } = useGetMyReelQuery(reelId, {
    skip: !reelId,
  });

  /* =====================================================
      MUTATIONS
    ===================================================== */

  const [createReelSubmission, { isLoading: isCreating }] =
    useCreateReelSubmissionMutation();

  const [updateReelSubmission, { isLoading: isUpdating }] =
    useUpdateReelSubmissionMutation();

  const [submitReel, { isLoading: isSubmitting }] = useSubmitReelMutation();

  const isSaving = isCreating || isUpdating;
  const isBusy = isSaving || isSubmitting;

  /* =====================================================
      LOAD EXISTING REEL
    ===================================================== */

  useEffect(() => {
    if (!existingReel) return;

    setForm({
      title: existingReel.title ?? "",
      caption: existingReel.caption ?? "",
      videoUrl: existingReel.videoUrl ?? "",
      thumbnailUrl: existingReel.thumbnailUrl ?? "",
      instagramUrl: existingReel.instagramUrl ?? "",
      youtubeUrl: existingReel.youtubeUrl ?? "",
    });

    setIsSaved(true);
  }, [existingReel]);

  /* =====================================================
      STATUS
    ===================================================== */

  const currentStatus = existingReel?.status ?? "draft";

  const isAlreadySubmitted = [
    "submitted",
    "under_review",
    "approved",
    "published",
  ].includes(currentStatus);

  /*
   * Drafts, rejected reels and reels with requested changes
   * can be edited and submitted again.
   */
  const isEditable = ["draft", "changes_requested", "rejected"].includes(
    currentStatus,
  );

  /* =====================================================
      VALIDATION
    ===================================================== */

  const validation = useMemo(() => {
    const errors: string[] = [];

    if (!campaignId) {
      errors.push("Campaign ID is missing.");
    }

    if (!form.title.trim()) {
      errors.push("Please enter a reel title.");
    }

    if (!form.videoUrl.trim()) {
      errors.push("Please add your video URL.");
    } else if (!isValidUrl(form.videoUrl)) {
      errors.push("Please enter a valid video URL.");
    }

    if (form.thumbnailUrl.trim() && !isValidUrl(form.thumbnailUrl)) {
      errors.push("Please enter a valid thumbnail URL.");
    }

    if (form.instagramUrl.trim() && !isValidUrl(form.instagramUrl)) {
      errors.push("Please enter a valid Instagram URL.");
    }

    if (form.youtubeUrl.trim() && !isValidUrl(form.youtubeUrl)) {
      errors.push("Please enter a valid YouTube URL.");
    }

    return errors;
  }, [campaignId, form]);

  const canSave = validation.length === 0 && isEditable;

  /* =====================================================
      FORM CHANGE
    ===================================================== */

  const updateField = (field: keyof FormState, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setIsSaved(false);
    setMessage(null);
  };

  /* =====================================================
      CREATE / UPDATE DRAFT
    ===================================================== */

  const saveDraft = async () => {
    setMessage(null);

    if (!campaignId) {
      setMessage({
        type: "error",
        text: "Campaign ID is missing.",
      });

      return null;
    }

    if (!form.title.trim()) {
      setMessage({
        type: "error",
        text: "Please enter a reel title.",
      });

      return null;
    }

    if (!form.videoUrl.trim()) {
      setMessage({
        type: "error",
        text: "Please add your video URL.",
      });

      return null;
    }

    if (!isValidUrl(form.videoUrl)) {
      setMessage({
        type: "error",
        text: "Please enter a valid video URL.",
      });

      return null;
    }

    try {
      /* =================================================
          UPDATE EXISTING REEL
        ================================================= */

      if (reelId) {
        const response = await updateReelSubmission({
          id: reelId,

          title: form.title.trim(),

          caption: form.caption.trim() || undefined,

          videoUrl: form.videoUrl.trim(),

          thumbnailUrl: form.thumbnailUrl.trim() || undefined,

          instagramUrl: form.instagramUrl.trim() || undefined,

          youtubeUrl: form.youtubeUrl.trim() || undefined,
        }).unwrap();

        setReelId(response.id);
        setIsSaved(true);

        setMessage({
          type: "success",
          text: "Draft saved successfully.",
        });

        return response;
      }

      /* =================================================
          CREATE NEW REEL
        ================================================= */

      const response = await createReelSubmission({
        campaignId,

        title: form.title.trim(),

        caption: form.caption.trim() || undefined,

        videoUrl: form.videoUrl.trim(),

        thumbnailUrl: form.thumbnailUrl.trim() || undefined,

        instagramUrl: form.instagramUrl.trim() || undefined,

        youtubeUrl: form.youtubeUrl.trim() || undefined,

        status: "draft",
      }).unwrap();

      setReelId(response.id);
      setIsSaved(true);

      setMessage({
        type: "success",
        text: "Draft created successfully.",
      });

      return response;
    } catch (error) {
      console.error("Failed to save reel:", error);

      setMessage({
        type: "error",
        text: "Unable to save the reel. Please try again.",
      });

      return null;
    }
  };

  /* =====================================================
      SAVE DRAFT
    ===================================================== */

  const handleSaveDraft = async () => {
    await saveDraft();
  };

  /* =====================================================
      SUBMIT
    ===================================================== */

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    setMessage(null);

    if (!canSave) {
      setMessage({
        type: "error",
        text: validation[0] ?? "Please complete all required fields.",
      });

      return;
    }

    try {
      /*
       * Always save first.
       */
      const savedReel = await saveDraft();

      if (!savedReel) {
        return;
      }

      /*
       * Then submit.
       */
      await submitReel(savedReel.id).unwrap();

      setReelId(savedReel.id);
      setIsSaved(true);

      setMessage({
        type: "success",
        text: "Your reel has been submitted for review successfully.",
      });

      setTimeout(() => {
        router.replace(`/platform/freelancer/campaigns/${campaignId}`);
      }, 1200);
    } catch (error: any) {
      console.error("Failed to submit reel:", error);

      console.error("API error data:", error?.data);

      console.error("API error status:", error?.status);

      setMessage({
        type: "error",
        text: error?.data?.message || "Failed to submit reel",
      });
    }
  };

  /* =====================================================
      BACK
    ===================================================== */

  const handleBack = () => {
    if (!campaignId) {
      router.push("/platform/freelancer/my-campaigns");

      return;
    }

    router.push(`/platform/freelancer/campaigns/${campaignId}`);
  };

  /* =====================================================
      LOADING
    ===================================================== */

  if (isLoadingMyReels || (reelId && isLoadingReel)) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 size={20} className="animate-spin text-violet-600" />
          Loading your reel...
        </div>
      </div>
    );
  }

  /* =====================================================
      PAGE
    ===================================================== */

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-5xl p-5 sm:p-7 lg:p-8">
        {/* =================================================
              BACK
          ================================================= */}

        <div className="mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Campaign
          </button>
        </div>

        {/* =================================================
              HEADER
          ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-700">
                <Video size={12} />
                Reel Submission
              </div>

              <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Submit Your Reel
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Submit your campaign content for MYSMME admin review. Make sure
                your video and social links are correct before submitting.
              </p>
            </div>

            <StatusBadge status={currentStatus} />
          </div>
        </div>

        {/* =================================================
              API ERROR
          ================================================= */}

        {isMyReelsError && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <XCircle size={18} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-semibold">Unable to load your reels</p>

              <p className="mt-1 text-xs text-red-600">
                Please refresh the page and try again.
              </p>
            </div>
          </div>
        )}

        {isReelError && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <XCircle size={18} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-semibold">Unable to load this reel</p>

              <p className="mt-1 text-xs text-red-600">
                The reel may have been removed or you may not have access to it.
              </p>
            </div>
          </div>
        )}

        {/* =================================================
              MESSAGE
          ================================================= */}

        {message && (
          <div
            className={`mt-5 flex items-start gap-3 rounded-xl border p-4 text-sm ${
              message.type === "success"
                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                : "border-red-100 bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            ) : (
              <XCircle size={18} className="mt-0.5 shrink-0" />
            )}

            <p>{message.text}</p>
          </div>
        )}

        {/* =================================================
              FORM
          ================================================= */}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* =================================================
                CONTENT INFORMATION
            ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-slate-900">
                Content Information
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Add the basic information for your campaign reel.
              </p>
            </div>

            {/* TITLE */}

            <div>
              <label
                htmlFor="title"
                className="text-xs font-semibold text-slate-700"
              >
                Reel Title
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                disabled={!isEditable || isBusy}
                placeholder="e.g. Festive Saree Styling"
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>

            {/* CAPTION */}

            <div className="mt-5">
              <label
                htmlFor="caption"
                className="text-xs font-semibold text-slate-700"
              >
                Caption
              </label>

              <textarea
                id="caption"
                value={form.caption}
                onChange={(event) => updateField("caption", event.target.value)}
                disabled={!isEditable || isBusy}
                rows={5}
                placeholder="Write the caption you plan to publish with your reel..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 disabled:cursor-not-allowed disabled:bg-slate-50"
              />

              <p className="mt-2 text-[11px] text-slate-400">
                Keep your caption authentic and aligned with the campaign brief.
              </p>
            </div>
          </section>

          {/* =================================================
                VIDEO
            ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-slate-900">Video</h2>

              <p className="mt-1 text-xs text-slate-500">
                Add the URL where your campaign video can be accessed.
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 p-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
                <FileVideo size={24} />
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-sm font-semibold text-slate-900">
                  Video URL
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Paste your hosted video URL below.
                </p>
              </div>

              <div className="relative mt-5">
                <LinkIcon
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="url"
                  value={form.videoUrl}
                  onChange={(event) =>
                    updateField("videoUrl", event.target.value)
                  }
                  disabled={!isEditable || isBusy}
                  placeholder="https://..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* THUMBNAIL */}

            <div className="mt-5">
              <label
                htmlFor="thumbnailUrl"
                className="text-xs font-semibold text-slate-700"
              >
                Thumbnail URL
              </label>

              <div className="relative mt-2">
                <Upload
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="thumbnailUrl"
                  type="url"
                  value={form.thumbnailUrl}
                  onChange={(event) =>
                    updateField("thumbnailUrl", event.target.value)
                  }
                  disabled={!isEditable || isBusy}
                  placeholder="https://..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>

              <p className="mt-2 text-[11px] text-slate-400">
                Optional. Used as the preview image for your submission.
              </p>
            </div>
          </section>

          {/* =================================================
                SOCIAL LINKS
            ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-slate-900">
                Social Media Links
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Add the live post URLs when your content is published.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* INSTAGRAM */}

              <div>
                <label
                  htmlFor="instagramUrl"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-50 text-pink-600">
                    <FaInstagram size={17} />
                  </span>
                  Instagram URL
                </label>

                <input
                  id="instagramUrl"
                  type="url"
                  value={form.instagramUrl}
                  onChange={(event) =>
                    updateField("instagramUrl", event.target.value)
                  }
                  disabled={!isEditable || isBusy}
                  placeholder="https://instagram.com/..."
                  className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>

              {/* YOUTUBE */}

              <div>
                <label
                  htmlFor="youtubeUrl"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <FaYoutube size={17} />
                  </span>
                  YouTube URL
                </label>

                <input
                  id="youtubeUrl"
                  type="url"
                  value={form.youtubeUrl}
                  onChange={(event) =>
                    updateField("youtubeUrl", event.target.value)
                  }
                  disabled={!isEditable || isBusy}
                  placeholder="https://youtube.com/..."
                  className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:ring-4 focus:ring-red-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <Clock3 size={17} className="mt-0.5 shrink-0 text-slate-400" />

                <p className="text-xs leading-5 text-slate-500">
                  Social URLs can be added before or after publishing. If your
                  campaign requires a live social URL, update the submission
                  once the post is live.
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
                VALIDATION
            ================================================= */}

          {validation.length > 0 && (
            <section className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <div className="flex items-start gap-3">
                <XCircle size={18} className="mt-0.5 shrink-0 text-amber-600" />

                <div>
                  <h3 className="text-sm font-semibold text-amber-800">
                    Before submitting
                  </h3>

                  <ul className="mt-2 space-y-1">
                    {validation.map((error) => (
                      <li key={error} className="text-xs text-amber-700">
                        • {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* =================================================
                ACTIONS
            ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {isSaved && !isAlreadySubmitted ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-600">
                    <CheckCircle2 size={15} />
                    Draft saved
                  </div>
                ) : (
                  <p className="text-xs leading-5 text-slate-400">
                    Save your work as a draft or submit it for admin review.
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                {/* CANCEL */}

                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isBusy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                {/* SAVE */}

                {isEditable && (
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isBusy || !form.title.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}

                    {isSaving ? "Saving..." : "Save Draft"}
                  </button>
                )}

                {/* SUBMIT */}

                {!isAlreadySubmitted && (
                  <button
                    type="submit"
                    disabled={isBusy || !canSave}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}

                    {isSubmitting ? "Submitting..." : "Submit for Review"}

                    {!isSubmitting && <ArrowRight size={15} />}
                  </button>
                )}

                {/* SUBMITTED */}

                {isAlreadySubmitted && (
                  <div className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-600">
                    <CheckCircle2 size={17} />
                    Submitted
                  </div>
                )}
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
    STATUS BADGE
  ========================================================= */

function StatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    {
      label: string;
      className: string;
      icon: React.ReactNode;
    }
  > = {
    draft: {
      label: "Draft",
      className: "bg-slate-100 text-slate-600",
      icon: <Save size={13} />,
    },

    submitted: {
      label: "Submitted",
      className: "bg-blue-50 text-blue-600",
      icon: <Send size={13} />,
    },

    under_review: {
      label: "Under Review",
      className: "bg-amber-50 text-amber-600",
      icon: <Clock3 size={13} />,
    },

    changes_requested: {
      label: "Changes Requested",
      className: "bg-orange-50 text-orange-600",
      icon: <XCircle size={13} />,
    },

    approved: {
      label: "Approved",
      className: "bg-emerald-50 text-emerald-600",
      icon: <CheckCircle2 size={13} />,
    },

    rejected: {
      label: "Rejected",
      className: "bg-red-50 text-red-600",
      icon: <XCircle size={13} />,
    },

    published: {
      label: "Published",
      className: "bg-violet-50 text-violet-600",
      icon: <CheckCircle2 size={13} />,
    },
  };

  const current = config[status] ?? config.draft;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${current.className}`}
    >
      {current.icon}

      {current.label}
    </span>
  );
}
