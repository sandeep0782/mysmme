import { api, BASE_URL } from "../api";

const API_URLS = {
    BRANDS: `${BASE_URL}/brand`,
    BRAND_BY_ID: (id: string) => `${BASE_URL}/brand/${id}`,
};

type Brand = {
    _id: string;
    name: string;
    description: string;
    logo?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    slug?: string;
};

type BrandsResponse = {
    data: Brand[];
    message?: string;
};

export const brandApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // ============================================================
        // GET ALL BRANDS
        // ============================================================

        getBrands: builder.query<BrandsResponse, void>({
            query: () => ({
                url: API_URLS.BRANDS,
                method: "GET",
            }),

            providesTags: (result) => [
                {
                    type: "Brand",
                    id: "LIST",
                },

                ...(result?.data ?? []).map((brand) => ({
                    type: "Brand" as const,
                    id: brand._id,
                })),
            ],
        }),

        // ============================================================
        // GET BRAND BY ID
        // ============================================================

        getBrandById: builder.query<Brand, string>({
            query: (id) => ({
                url: API_URLS.BRAND_BY_ID(id),
                method: "GET",
            }),

            providesTags: (_result, _error, id) => [
                {
                    type: "Brand",
                    id,
                },
            ],
        }),

        // ============================================================
        // ADD BRAND
        // ============================================================

        addBrand: builder.mutation<Brand, FormData>({
            query: (brandData) => ({
                url: API_URLS.BRANDS,
                method: "POST",
                body: brandData,
            }),

            invalidatesTags: [
                {
                    type: "Brand",
                    id: "LIST",
                },
            ],
        }),

        // ============================================================
        // UPDATE BRAND
        // ============================================================

        updateBrand: builder.mutation<
            Brand,
            {
                id: string;
                data: FormData;
            }
        >({
            query: ({ id, data }) => ({
                url: API_URLS.BRAND_BY_ID(id),
                method: "PUT",
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
                {
                    type: "Brand",
                    id,
                },
                {
                    type: "Brand",
                    id: "LIST",
                },
            ],
        }),

        // ============================================================
        // DELETE BRAND
        // ============================================================

        deleteBrand: builder.mutation<unknown, string>({
            query: (id) => ({
                url: API_URLS.BRAND_BY_ID(id),
                method: "DELETE",
            }),

            invalidatesTags: (_result, _error, id) => [
                {
                    type: "Brand",
                    id,
                },
                {
                    type: "Brand",
                    id: "LIST",
                },
            ],
        }),
    }),

    overrideExisting: false,
});

export const {
    useAddBrandMutation,
    useGetBrandsQuery,
    useGetBrandByIdQuery,
    useUpdateBrandMutation,
    useDeleteBrandMutation,
} = brandApi;