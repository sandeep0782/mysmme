import { api, BASE_URL } from "../api";

// ============================================================
// API URLS
// ============================================================

const API_URLS = {
    COLORS: `${BASE_URL}/colors`,
    ACTIVE_COLORS: `${BASE_URL}/colors/active`,
    COLOR_BY_ID: (id: string) =>
        `${BASE_URL}/colors/${id}`,
};

// ============================================================
// TYPES
// ============================================================

export type Color = {
    _id: string;
    name: string;
    hexCode: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
};

type ColorsResponse = {
    data: Color[];
    message?: string;
};

type ColorResponse = {
    data: Color;
    message?: string;
};

// ============================================================
// COLOR API
// ============================================================

export const colorApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // ========================================================
        // GET ALL COLORS
        // Admin - returns active + inactive colors
        // ========================================================

        getColors: builder.query<ColorsResponse, void>({
            query: () => ({
                url: API_URLS.COLORS,
                method: "GET",
            }),

            providesTags: (result) => [
                {
                    type: "Color",
                    id: "LIST",
                },

                ...(result?.data ?? []).map((color) => ({
                    type: "Color" as const,
                    id: color._id,
                })),
            ],
        }),

        // ========================================================
        // GET ACTIVE COLORS
        // Public - storefront/product filters
        // ========================================================

        getActiveColors: builder.query<ColorsResponse, void>({
            query: () => ({
                url: API_URLS.ACTIVE_COLORS,
                method: "GET",
            }),

            providesTags: [
                {
                    type: "Color",
                    id: "ACTIVE_LIST",
                },
            ],
        }),

        // ========================================================
        // GET COLOR BY ID
        // ========================================================

        getColorById: builder.query<ColorResponse, string>({
            query: (id) => ({
                url: API_URLS.COLOR_BY_ID(id),
                method: "GET",
            }),

            providesTags: (_result, _error, id) => [
                {
                    type: "Color",
                    id,
                },
            ],
        }),

        // ========================================================
        // ADD COLOR
        // ========================================================

        addColor: builder.mutation<
            ColorResponse,
            {
                name: string;
                hexCode: string;
                isActive?: boolean;
            }
        >({
            query: (colorData) => ({
                url: API_URLS.COLORS,
                method: "POST",
                body: colorData,
            }),

            invalidatesTags: [
                {
                    type: "Color",
                    id: "LIST",
                },
                {
                    type: "Color",
                    id: "ACTIVE_LIST",
                },
            ],
        }),

        // ========================================================
        // UPDATE COLOR
        // ========================================================

        updateColor: builder.mutation<
            ColorResponse,
            {
                id: string;
                data: {
                    name?: string;
                    hexCode?: string;
                    isActive?: boolean;
                };
            }
        >({
            query: ({ id, data }) => ({
                url: API_URLS.COLOR_BY_ID(id),
                method: "PUT",
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
                {
                    type: "Color",
                    id,
                },
                {
                    type: "Color",
                    id: "LIST",
                },
                {
                    type: "Color",
                    id: "ACTIVE_LIST",
                },
            ],
        }),

        // ========================================================
        // DELETE COLOR
        // ========================================================

        deleteColor: builder.mutation<
            unknown,
            string
        >({
            query: (id) => ({
                url: API_URLS.COLOR_BY_ID(id),
                method: "DELETE",
            }),

            invalidatesTags: (_result, _error, id) => [
                {
                    type: "Color",
                    id,
                },
                {
                    type: "Color",
                    id: "LIST",
                },
                {
                    type: "Color",
                    id: "ACTIVE_LIST",
                },
            ],
        }),
    }),

    overrideExisting: false,
});

// ============================================================
// HOOKS
// ============================================================

export const {
    useGetColorsQuery,
    useGetActiveColorsQuery,
    useGetColorByIdQuery,
    useAddColorMutation,
    useUpdateColorMutation,
    useDeleteColorMutation,
} = colorApi;