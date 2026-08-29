import { api, BASE_URL } from "../api";

/* ================================================================
   ORDER STATUS
================================================================ */

/**
 * Must match the SellerOrder Mongoose schema exactly.
 */
export type OrderStatus =
  | "pending"
  | "accepted"
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "cancelled";

/* ================================================================
   API URLS
================================================================ */

const API_URLS = {
  GET_SELLER_ORDERS: `${BASE_URL}/seller/orders`,

  GET_SELLER_ORDER_BY_ID: (orderId: string) =>
    `${BASE_URL}/seller/orders/${orderId}`,

  ACCEPT_ORDER: (orderId: string) =>
    `${BASE_URL}/seller/orders/${orderId}/accept`,

  PROCESS_ORDER: (orderId: string) =>
    `${BASE_URL}/seller/orders/${orderId}/process`,

  READY_TO_SHIP: (orderId: string) =>
    `${BASE_URL}/seller/orders/${orderId}/ready-to-ship`,

  DISPATCH_ORDER: (orderId: string) =>
    `${BASE_URL}/seller/orders/${orderId}/dispatch`,

  DELIVER_ORDER: (orderId: string) =>
    `${BASE_URL}/seller/orders/${orderId}/delivered`,
};

/* ================================================================
   SELLER API
================================================================ */

export const sellerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /* ============================================================
       GET SELLER ORDERS
    ============================================================ */

    getSellerOrders: builder.query<any, void>({
      query: () => ({
        url: API_URLS.GET_SELLER_ORDERS,
        method: "GET",
      }),

      providesTags: ["Order"],
    }),

    /* ============================================================
       GET SINGLE SELLER ORDER
    ============================================================ */

    getSellerOrderById: builder.query<any, string>({
      query: (orderId) => ({
        url: API_URLS.GET_SELLER_ORDER_BY_ID(orderId),
        method: "GET",
      }),

      providesTags: ["Order"],
    }),

    /* ============================================================
       UPDATE SELLER ORDER STATUS
    ============================================================ */

    updateOrderStatus: builder.mutation<
      any,
      {
        orderId: string;
        status: OrderStatus;
      }
    >({
      query: ({ orderId, status }) => {
        switch (status) {
          case "accepted":
            return {
              url: API_URLS.ACCEPT_ORDER(orderId),
              method: "PATCH",
            };

          case "processing":
            return {
              url: API_URLS.PROCESS_ORDER(orderId),
              method: "PATCH",
            };

          case "ready_to_ship":
            return {
              url: API_URLS.READY_TO_SHIP(orderId),
              method: "PATCH",
            };

          case "shipped":
            return {
              url: API_URLS.DISPATCH_ORDER(orderId),
              method: "PATCH",
            };

          case "delivered":
            return {
              url: API_URLS.DELIVER_ORDER(orderId),
              method: "PATCH",
            };

          default:
            throw new Error(`Invalid status transition: ${status}`);
        }
      },

      invalidatesTags: ["Order"],
    }),
  }),

  overrideExisting: false,
});

/* ================================================================
   HOOKS
================================================================ */

export const {
  useGetSellerOrdersQuery,
  useGetSellerOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = sellerApi;
