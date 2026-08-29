import { api, BASE_URL } from "../api";

const API_URLS = {
    SEASONS: `${BASE_URL}/season`,
    SEASON_BY_ID: (id: string) => `${BASE_URL}/season/${id}`,
};

export const seasonApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Create Season
        addSeason: builder.mutation({
            query: (seasonData) => ({
                url: API_URLS.SEASONS,
                method: "POST",
                body: seasonData,
            }),
            invalidatesTags: ["Season"],
        }),

        // Get All Seasons
        getSeasons: builder.query({
            query: () => API_URLS.SEASONS,
            providesTags: ["Season"],
        }),

        // Get Season By ID
        getSeasonById: builder.query({
            query: (id) => API_URLS.SEASON_BY_ID(id),
            providesTags: ["Season"],
        }),

        // Update Season
        updateSeason: builder.mutation({
            query: ({ id, data }) => ({
                url: API_URLS.SEASON_BY_ID(id),
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Season"],
        }),

        // Delete Season
        deleteSeason: builder.mutation({
            query: (id) => ({
                url: API_URLS.SEASON_BY_ID(id),
                method: "DELETE",
            }),
            invalidatesTags: ["Season"],
        }),
    }),
});

export const {
    useAddSeasonMutation,
    useGetSeasonsQuery,
    useGetSeasonByIdQuery,
    useUpdateSeasonMutation,
    useDeleteSeasonMutation,
} = seasonApi;