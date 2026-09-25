import { METHODS } from "http";
import { api, BASE_URL } from "../api";

const API_URLS = {
  ORDERS: `${BASE_URL}/order`,
  ORDERS_BY_ID: (orderId: string) => `${BASE_URL}/orders/${orderId}`,
  CREATE_RAZORPAY_PAYMENT: `${BASE_URL}/order/payment-razorpay`,

  ADMIN_ORDERS: `${BASE_URL}/admin/orders`,
  ADMIN_ORDER_BY_ID: (orderId: string) => `${BASE_URL}/admin/orders/${orderId}`,
  ADMIN_ORDER_STATUS: (orderId: string) =>
    `${BASE_URL}/admin/orders/${orderId}/status`,
};

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserOrders: builder.query({
      query: () => API_URLS.ORDERS,
      providesTags: ["Order"],
    }),

    getOrderById: builder.query({
      query: (orderId) => API_URLS.ORDERS_BY_ID(orderId),
      providesTags: ["Order"],
    }),

    createOrUpdateOrder: builder.mutation({
      query: ({ orderId, orderData }) => ({
        url: API_URLS.ORDERS,
        method: orderId ? "Patch" : "POST",
        body: { orderId, orderData },
      }),
      invalidatesTags: ["Order"],
    }),
    createRazorpayPayment: builder.mutation({
      query: (orderId) => ({
        url: API_URLS.CREATE_RAZORPAY_PAYMENT,
        method: "POST",
        body: { orderId },
      }),
    }),

    getAdminOrders: builder.query({
      query: () => API_URLS.ADMIN_ORDERS,
      providesTags: ["Order"],
    }),

    getAdminOrderById: builder.query({
      query: (orderId) => API_URLS.ADMIN_ORDER_BY_ID(orderId),

      providesTags: (_result, _error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),

    updateAdminOrderStatus: builder.mutation({
      query: ({ orderId, status }: { orderId: string; status: string }) => ({
        url: API_URLS.ADMIN_ORDER_STATUS(orderId),
        method: "PATCH",
        body: { status },
      }),

      invalidatesTags: (_result, _error, { orderId }) => [
        "Order",
        { type: "Order", id: orderId },
      ],
    }),
  }),
});

export const {
  useCreateOrUpdateOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCreateRazorpayPaymentMutation,

  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useUpdateAdminOrderStatusMutation,
} = orderApi;
