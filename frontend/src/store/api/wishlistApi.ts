import { api, BASE_URL } from "../api";

const API_URLS = {
  WISHLIST: `${BASE_URL}/wishlist`,

  ADD_TO_WISHLIST: `${BASE_URL}/wishlist/add`,

  REMOVE_FROM_WISHLIST: (productId: string) =>
    `${BASE_URL}/wishlist/remove/${productId}`,
};

export const wishlistApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addToWishlist: builder.mutation({
      query: (productId: string) => ({
        url: API_URLS.ADD_TO_WISHLIST,
        method: "POST",
        body: {
          productId,
        },
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishlist: builder.mutation({
      query: (productId: string) => ({
        url: API_URLS.REMOVE_FROM_WISHLIST(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    getWishlist: builder.query({
      query: () => API_URLS.WISHLIST,
      providesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
