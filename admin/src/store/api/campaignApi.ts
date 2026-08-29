import { api } from "../api";

/* =========================================================
   TYPES
========================================================= */

export type CampaignPlatform = "Instagram" | "YouTube";

/* =========================================================
   CAMPAIGN
========================================================= */

export interface Campaign {
  id: string;

  title: string;

  description?: string;

  productName?: string;

  productImage?: string;

  category?: string;

  payout: number;

  reelsRequired: number;

  deadline: string;

  platforms: CampaignPlatform[];

  estimatedReach?: string;

  applicants?: number;

  tags?: string[];

  createdAt?: string;

  updatedAt?: string;
}

/* =========================================================
   ACCEPTED CAMPAIGN
========================================================= */

export interface FreelancerCampaign extends Campaign {
  acceptedAt?: string;

  startedAt?: string;

  completedAt?: string;
}

/* =========================================================
   CAMPAIGN FILTERS
========================================================= */

export interface CampaignFilters {
  search?: string;

  category?: string;

  platform?: CampaignPlatform;

  sort?: "recommended" | "highest_payout" | "deadline";

  page?: number;

  limit?: number;
}

/* =========================================================
   ACCEPT CAMPAIGN RESPONSE
========================================================= */

export interface AcceptCampaignResponse {
  success: boolean;
  message: string;
  data: Campaign;
}

/* =========================================================
   CAMPAIGN API
========================================================= */

export const campaignApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /* =====================================================
       FREELANCER
       GET AVAILABLE CAMPAIGNS
    ===================================================== */

    getAvailableCampaigns: builder.query<Campaign[], CampaignFilters | void>({
      query: (params) => ({
        url: "/campaigns",
        ...(params
          ? {
              params,
            }
          : {}),
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Campaign" as const,
                id,
              })),
              {
                type: "Campaign" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Campaign" as const,
                id: "LIST",
              },
            ],
    }),

    /* =====================================================
       GET SINGLE CAMPAIGN
    ===================================================== */

    getCampaign: builder.query<Campaign, string>({
      query: (id) => `/campaigns/${id}`,

      providesTags: (_result, _error, id) => [
        {
          type: "Campaign",
          id,
        },
      ],
    }),

    /* =====================================================
       FREELANCER - MY CAMPAIGNS
    ===================================================== */

    getMyCampaigns: builder.query<FreelancerCampaign[], void>({
      query: () => "/campaigns/my",

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Campaign" as const,
                id,
              })),
              {
                type: "Campaign" as const,
                id: "MY_LIST",
              },
            ]
          : [
              {
                type: "Campaign" as const,
                id: "MY_LIST",
              },
            ],
    }),

    /* =====================================================
       ACCEPT CAMPAIGN
    ===================================================== */

    acceptCampaign: builder.mutation<AcceptCampaignResponse, string>({
      query: (id) => ({
        url: `/campaigns/${id}/accept`,
        method: "POST",
      }),

      invalidatesTags: (_result, _error, id) => [
        {
          type: "Campaign",
          id,
        },
        {
          type: "Campaign",
          id: "LIST",
        },
        {
          type: "Campaign",
          id: "MY_LIST",
        },
      ],
    }),

    /* =====================================================
       START CAMPAIGN
    ===================================================== */

    startCampaign: builder.mutation<Campaign, string>({
      query: (id) => ({
        url: `/campaigns/${id}/start`,
        method: "POST",
      }),

      invalidatesTags: (_result, _error, id) => [
        {
          type: "Campaign",
          id,
        },
        {
          type: "Campaign",
          id: "MY_LIST",
        },
      ],
    }),

    /* =====================================================
       COMPLETE CAMPAIGN
    ===================================================== */

    completeCampaign: builder.mutation<Campaign, string>({
      query: (id) => ({
        url: `/campaigns/${id}/complete`,
        method: "POST",
      }),

      invalidatesTags: (_result, _error, id) => [
        {
          type: "Campaign",
          id,
        },
        {
          type: "Campaign",
          id: "MY_LIST",
        },
      ],
    }),
  }),

  overrideExisting: false,
});

/* =========================================================
   HOOKS
========================================================= */

export const {
  useGetAvailableCampaignsQuery,
  useGetCampaignQuery,
  useGetMyCampaignsQuery,

  useAcceptCampaignMutation,
  useStartCampaignMutation,
  useCompleteCampaignMutation,
} = campaignApi;
