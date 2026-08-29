import { api } from "../api";

export interface FreelancerEarnings {
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
}

export const earningApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyEarnings: builder.query<FreelancerEarnings, void>({
      query: () => "/earnings/my",
      providesTags: ["Earning"],
    }),
  }),

  overrideExisting: false,
});

export const { useGetMyEarningsQuery } = earningApi;
