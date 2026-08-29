import { api } from "../api";

/* =========================================================
   TYPES
========================================================= */

export type ReelStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "published";

export type ReelPlatform = "Instagram" | "YouTube";

/* =========================================================
   FREELANCER
========================================================= */

export interface ReelFreelancer {
  id: string;
  name: string;
  email?: string;

  instagramHandle?: string;
  youtubeHandle?: string;

  followers?: number;
}

/* =========================================================
   CAMPAIGN
========================================================= */

export interface ReelCampaign {
  id: string;
  title: string;
  brand?: string;
}

/* =========================================================
   REEL SUBMISSION
========================================================= */

export interface ReelSubmission {
  id: string;

  campaignId: string;
  freelancerId: string;

  title: string;
  caption?: string;

  videoUrl?: string;
  thumbnailUrl?: string;

  instagramUrl?: string;
  youtubeUrl?: string;

  status: ReelStatus;

  featured?: boolean;
  isActive?: boolean;

  adminNotes?: string;

  submittedAt?: string;
  reviewedAt?: string;
  publishedAt?: string;

  createdAt?: string;
  updatedAt?: string;

  campaign?: ReelCampaign;

  freelancer?: ReelFreelancer;
}

/* =========================================================
   CREATE REEL REQUEST
========================================================= */

export interface CreateReelSubmissionRequest {
  campaignId: string;

  title: string;

  caption?: string;

  videoUrl?: string;

  thumbnailUrl?: string;

  instagramUrl?: string;

  youtubeUrl?: string;

  status?: "draft" | "submitted";
}

/* =========================================================
   UPDATE REEL REQUEST
========================================================= */

export interface UpdateReelSubmissionRequest {
  id: string;

  title?: string;

  caption?: string;

  videoUrl?: string;

  thumbnailUrl?: string;

  instagramUrl?: string;

  youtubeUrl?: string;

  status?: ReelStatus;

  adminNotes?: string;

  featured?: boolean;

  isActive?: boolean;
}

/* =========================================================
   ADMIN REVIEW REQUEST
========================================================= */

export interface ReviewReelRequest {
  id: string;

  status:
    | "under_review"
    | "approved"
    | "rejected"
    | "changes_requested"
    | "published";

  adminNotes?: string;
}

/* =========================================================
   ADMIN REEL FILTERS
========================================================= */

export interface AdminReelFilters {
  status?: ReelStatus;

  search?: string;

  campaignId?: string;

  freelancerId?: string;
}

/* =========================================================
   PUBLIC REEL FILTERS
========================================================= */

export interface PublishedReelFilters {
  featured?: boolean;

  limit?: number;
}

/* =========================================================
   REEL API
========================================================= */

export const reelApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /* =====================================================
       FREELANCER
    ===================================================== */

    getMyReels: builder.query<ReelSubmission[], void>({
      query: () => "/reels/my",

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Reel" as const,
                id,
              })),
              { type: "Reel" as const, id: "LIST" },
            ]
          : [{ type: "Reel" as const, id: "LIST" }],
    }),

    /* =====================================================
       GET SINGLE FREELANCER REEL
    ===================================================== */

    getMyReel: builder.query<ReelSubmission, string>({
      query: (id) => `/reels/${id}`,

      providesTags: (_result, _error, id) => [
        {
          type: "Reel",
          id,
        },
      ],
    }),

    /* =====================================================
       CREATE REEL
    ===================================================== */

    createReelSubmission: builder.mutation<
      ReelSubmission,
      CreateReelSubmissionRequest
    >({
      query: (body) => ({
        url: "/reels",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Reel"],
    }),

    /* =====================================================
       UPDATE REEL
    ===================================================== */

    updateReelSubmission: builder.mutation<
      ReelSubmission,
      UpdateReelSubmissionRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/reels/${id}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        "Reel",
        {
          type: "Reel",
          id,
        },
      ],
    }),

    /* =====================================================
       SUBMIT REEL FOR REVIEW
    ===================================================== */

    submitReel: builder.mutation<ReelSubmission, string>({
      query: (id) => ({
        url: `/reels/${id}/submit`,
        method: "POST",
      }),

      invalidatesTags: (_result, _error, id) => [
        "Reel",
        {
          type: "Reel",
          id,
        },
      ],
    }),

    /* =====================================================
       ADMIN - GET ALL REELS
    ===================================================== */

    getAdminReels: builder.query<ReelSubmission[], AdminReelFilters | void>({
      query: (params) => ({
        url: "/admin/reels",

        ...(params
          ? {
              params,
            }
          : {}),
      }),

      providesTags: ["Reel"],
    }),

    /* =====================================================
       ADMIN - GET SINGLE REEL
    ===================================================== */

    getAdminReel: builder.query<ReelSubmission, string>({
      query: (id) => `/admin/reels/${id}`,

      providesTags: (_result, _error, id) => [
        {
          type: "Reel",
          id,
        },
      ],
    }),

    /* =====================================================
       ADMIN - REVIEW REEL
    ===================================================== */

    reviewReel: builder.mutation<ReelSubmission, ReviewReelRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/reels/${id}/review`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        "Reel",
        {
          type: "Reel",
          id,
        },
      ],
    }),

    /* =====================================================
       ADMIN - APPROVE
    ===================================================== */

    approveReel: builder.mutation<ReelSubmission, string>({
      query: (id) => ({
        url: `/admin/reels/${id}/approve`,
        method: "POST",
      }),

      invalidatesTags: ["Reel"],
    }),

    /* =====================================================
       ADMIN - REQUEST CHANGES
    ===================================================== */

    requestReelChanges: builder.mutation<
      ReelSubmission,
      {
        id: string;
        adminNotes: string;
      }
    >({
      query: ({ id, adminNotes }) => ({
        url: `/admin/reels/${id}/request-changes`,
        method: "POST",
        body: {
          adminNotes,
        },
      }),

      invalidatesTags: ["Reel"],
    }),

    /* =====================================================
       ADMIN - REJECT
    ===================================================== */

    rejectReel: builder.mutation<
      ReelSubmission,
      {
        id: string;
        adminNotes?: string;
      }
    >({
      query: ({ id, adminNotes }) => ({
        url: `/admin/reels/${id}/reject`,
        method: "POST",
        body: {
          adminNotes,
        },
      }),

      invalidatesTags: ["Reel"],
    }),

    /* =====================================================
       ADMIN - PUBLISH
    ===================================================== */

    publishReel: builder.mutation<ReelSubmission, string>({
      query: (id) => ({
        url: `/admin/reels/${id}/publish`,
        method: "POST",
      }),

      invalidatesTags: ["Reel"],
    }),

    /* =====================================================
       ADMIN - UNPUBLISH
    ===================================================== */

    unpublishReel: builder.mutation<ReelSubmission, string>({
      query: (id) => ({
        url: `/admin/reels/${id}/unpublish`,
        method: "POST",
      }),

      invalidatesTags: ["Reel"],
    }),

    /* =====================================================
       ADMIN - FEATURE / UNFEATURE
    ===================================================== */

    featureReel: builder.mutation<
      ReelSubmission,
      {
        id: string;
        featured: boolean;
      }
    >({
      query: ({ id, featured }) => ({
        url: `/admin/reels/${id}/feature`,
        method: "PATCH",
        body: {
          featured,
        },
      }),

      invalidatesTags: ["Reel"],
    }),

    /* =====================================================
       PUBLIC - PUBLISHED REELS
    ===================================================== */

    getPublishedReels: builder.query<
      ReelSubmission[],
      PublishedReelFilters | void
    >({
      query: (params) => ({
        url: "/reels/published",

        ...(params
          ? {
              params,
            }
          : {}),
      }),

      providesTags: ["Reel"],
    }),
  }),

  overrideExisting: false,
});

/* =========================================================
   HOOKS
========================================================= */

export const {
  /* Freelancer */
  useGetMyReelsQuery,
  useGetMyReelQuery,

  useCreateReelSubmissionMutation,
  useUpdateReelSubmissionMutation,
  useSubmitReelMutation,

  /* Admin */
  useGetAdminReelsQuery,
  useGetAdminReelQuery,

  useReviewReelMutation,
  useApproveReelMutation,
  useRequestReelChangesMutation,
  useRejectReelMutation,

  usePublishReelMutation,
  useUnpublishReelMutation,
  useFeatureReelMutation,

  /* Public */
  useGetPublishedReelsQuery,
} = reelApi;
