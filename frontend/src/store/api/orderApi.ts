import { api, BASE_URL } from "../api";

const API_URLS = {
  ORDERS: `${BASE_URL}/order`,

  ORDERS_BY_ID: (orderId: string) => `${BASE_URL}/order/${orderId}`,

  CREATE_RAZORPAY_PAYMENT: `${BASE_URL}/order/payment-razorpay`,

  VERIFY_RAZORPAY_PAYMENT: `${BASE_URL}/order/verify-payment`,
};

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserOrders: builder.query({
      query: () => API_URLS.ORDERS,
      providesTags: ["Order"],
    }),

    getOrderById: builder.query({
      query: (orderId: string) => API_URLS.ORDERS_BY_ID(orderId),
      providesTags: ["Order"],
    }),

    createOrUpdateOrder: builder.mutation({
      query: ({ orderId, updates }) => ({
        url: API_URLS.ORDERS,
        method: "POST",
        body: {
          orderId,
          ...updates,
        },
      }),
      invalidatesTags: ["Order", "Cart"],
    }),

    createRazorpayPayment: builder.mutation({
      query: ({
        couponCode,
        shippingAddress,
      }: {
        couponCode?: string;
        shippingAddress?: any;
      }) => ({
        url: API_URLS.CREATE_RAZORPAY_PAYMENT,
        method: "POST",
        body: {
          couponCode,
          shippingAddress,
        },
      }),
    }),

    verifyRazorpayPayment: builder.mutation({
      query: ({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        shippingAddress,
        couponCode,
      }) => ({
        url: API_URLS.VERIFY_RAZORPAY_PAYMENT,
        method: "POST",
        body: {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          shippingAddress,
          couponCode,
        },
      }),
      invalidatesTags: ["Order", "Cart"],
    }),
  }),
});

export const {
  useCreateOrUpdateOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCreateRazorpayPaymentMutation,
  useVerifyRazorpayPaymentMutation,
} = orderApi;
