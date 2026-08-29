import { api, BASE_URL } from "../api";

const API_URLS = {
  CART: (userId: string) => `${BASE_URL}/cart/${userId}`,
  ADD_TO_CART: `${BASE_URL}/cart/add`,
  CLEAR_CART: "/cart/clear",
  REMOVE_FROM_CART: (productId: string) =>
    `${BASE_URL}/cart/remove/${productId}`,
  UPDATE_CART_ITEM: (productId: string) =>
    `${BASE_URL}/cart/update/${productId}`,
};

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: (productData) => ({
        url: API_URLS.ADD_TO_CART,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: API_URLS.REMOVE_FROM_CART(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    getCart: builder.query({
      query: (userId) => API_URLS.CART(userId),
      providesTags: ["Cart"],
    }),

    updateCartItemQuantity: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: API_URLS.UPDATE_CART_ITEM(productId),
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: API_URLS.CLEAR_CART,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemQuantityMutation,
} = cartApi;
