import { api, BASE_URL } from "../api";

const API_URLS = {
  BRANDS: `${BASE_URL}/brand`,
  BRAND_BY_ID: (id: string) => `${BASE_URL}/brand/${id}`,
};

export interface Brand {
  _id: string;
  name: string;
  description: string;
  logo?: string;
  logoPublicId?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  slug: string;
  isFeatured: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const brandsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ============================================================
    // GET ALL BRANDS
    // GET /api/brand
    // ============================================================

    getAllBrands: builder.query<Brand[], void>({
      query: () => ({
        url: API_URLS.BRANDS,
        method: "GET",
      }),

      transformResponse: (response: ApiResponse<Brand[]>) => {
        return response.data;
      },

      providesTags: (result) => [
        {
          type: "Brand",
          id: "LIST",
        },

        ...(result ?? []).map((brand) => ({
          type: "Brand" as const,
          id: brand._id,
        })),
      ],
    }),

    // ============================================================
    // GET BRAND BY ID
    // GET /api/brand/:id
    // ============================================================

    getBrandById: builder.query<Brand, string>({
      query: (id) => ({
        url: API_URLS.BRAND_BY_ID(id),
        method: "GET",
      }),

      transformResponse: (response: ApiResponse<Brand>) => {
        return response.data;
      },

      providesTags: (_result, _error, id) => [
        {
          type: "Brand",
          id,
        },
      ],
    }),
  }),

  overrideExisting: false,
});

export const { useGetAllBrandsQuery, useGetBrandByIdQuery } = brandsApi;
