import { api, BASE_URL } from "../api";

const API_URLS = {
  CATEGORIES: `${BASE_URL}/category`,
  CATEGORY_BY_ID: (id: string) => `${BASE_URL}/category/${id}`,
};

export interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  image?: string;
  imagePublicId?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ============================================================
    // GET ALL CATEGORIES
    // GET /api/category
    // ============================================================

    getAllCategories: builder.query<Category[], void>({
      query: () => ({
        url: API_URLS.CATEGORIES,
        method: "GET",
      }),

      transformResponse: (response: ApiResponse<Category[]>) => {
        return response.data;
      },

      providesTags: (result) => [
        {
          type: "Category",
          id: "LIST",
        },

        ...(result ?? []).map((category) => ({
          type: "Category" as const,
          id: category._id,
        })),
      ],
    }),

    // ============================================================
    // GET CATEGORY BY ID
    // GET /api/category/:id
    // ============================================================

    getCategoryById: builder.query<Category, string>({
      query: (id) => ({
        url: API_URLS.CATEGORY_BY_ID(id),
        method: "GET",
      }),

      transformResponse: (response: ApiResponse<Category>) => {
        return response.data;
      },

      providesTags: (_result, _error, id) => [
        {
          type: "Category",
          id,
        },
      ],
    }),
  }),

  overrideExisting: false,
});

export const { useGetAllCategoriesQuery, useGetCategoryByIdQuery } =
  categoriesApi;
