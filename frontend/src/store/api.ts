import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
console.log("🔥🔥🔥 BASE_URL =", BASE_URL);

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: [
    "User",
    "Product",
    "Cart",
    "Order",
    "Address",
    "Wishlist",
    "Brand",
    "Category",
  ],
  endpoints: (builder) => ({}),
});
