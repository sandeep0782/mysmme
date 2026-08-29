import { api, BASE_URL } from "../api";

const API_URLS = {
    CATEGORIES: `${BASE_URL}/category`,
    CATEGORY_BY_ID: (id: string) =>
        `${BASE_URL}/category/${id}`,
};

type Category = {
    _id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    slug?: string;
};

type CategoriesResponse = {
    data: Category[];
    message?: string;
};

export const categoryApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getCategories: builder.query<
            CategoriesResponse,
            void
        >({
            query: () => ({
                url: API_URLS.CATEGORIES,
                method: "GET",
            }),

            providesTags: (result) => [
                {
                    type: "Category",
                    id: "LIST",
                },

                ...(result?.data ?? []).map((category) => ({
                    type: "Category" as const,
                    id: category._id,
                })),
            ],
        }),

        getCategoryById: builder.query<
            Category,
            string
        >({
            query: (id) => ({
                url: API_URLS.CATEGORY_BY_ID(id),
                method: "GET",
            }),

            providesTags: (_result, _error, id) => [
                {
                    type: "Category",
                    id,
                },
            ],
        }),

        addCategory: builder.mutation<
            Category,
            FormData
        >({
            query: (categoryData) => ({
                url: API_URLS.CATEGORIES,
                method: "POST",
                body: categoryData,
            }),

            invalidatesTags: [
                {
                    type: "Category",
                    id: "LIST",
                },
            ],
        }),

        updateCategory: builder.mutation<
            Category,
            {
                id: string;
                data: FormData;
            }
        >({
            query: ({ id, data }) => ({
                url: API_URLS.CATEGORY_BY_ID(id),
                method: "PUT",
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
                {
                    type: "Category",
                    id,
                },
                {
                    type: "Category",
                    id: "LIST",
                },
            ],
        }),

        deleteCategory: builder.mutation<
            unknown,
            string
        >({
            query: (id) => ({
                url: API_URLS.CATEGORY_BY_ID(id),
                method: "DELETE",
            }),

            invalidatesTags: (_result, _error, id) => [
                {
                    type: "Category",
                    id,
                },
                {
                    type: "Category",
                    id: "LIST",
                },
            ],
        }),
    }),

    overrideExisting: false,
});

export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;