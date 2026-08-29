import { api, BASE_URL } from "../api";

const API_URLS = {
  PRODUCTS: `${BASE_URL}/products`,
  PRODUCT_BY_ID: (id: string) => `${BASE_URL}/products/${id}`,
  PRODUCT_BY_SLUG: (slug: string) =>
    `${BASE_URL}/products/slug/${encodeURIComponent(slug)}`,
  GET_PRODUCT_BY_SELLER_ID: (sellerId: string) =>
    `${BASE_URL}/products/seller/${sellerId}`,
  DELETE_PRODUCT_BY_PRODUCT_ID: (productId: string) =>
    `${BASE_URL}/products/seller/${productId}`,
};

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addProducts: builder.mutation({
      query: (productData) => ({
        url: API_URLS.PRODUCTS,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    getProducts: builder.query({
      query: () => API_URLS.PRODUCTS,
      providesTags: ["Product"],
    }),

    getProductById: builder.query({
      query: (id) => API_URLS.PRODUCT_BY_ID(id),
      providesTags: ["Product"],
    }),
    getProductBySlug: builder.query({
      query: (slug: string) => API_URLS.PRODUCT_BY_SLUG(slug),
      providesTags: ["Product"],
    }),
    getProductBySellerId: builder.query({
      query: (sellerId) => API_URLS.GET_PRODUCT_BY_SELLER_ID(sellerId),
      providesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: API_URLS.DELETE_PRODUCT_BY_PRODUCT_ID(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useAddProductsMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useGetProductBySellerIdQuery,
  useDeleteProductMutation,
} = productApi;
