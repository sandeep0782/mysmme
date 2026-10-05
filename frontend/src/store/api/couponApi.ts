import { api, BASE_URL } from "../api";

const API_URLS = {
  VALIDATE_COUPON: `${BASE_URL}/coupons/validate`,
};

export interface ApplyCouponRequest {
  code: string;
  cartTotal: number;
}

export interface ValidateCouponResponse {
  success: boolean;
  valid: boolean;
  message: string;

  couponId?: string;
  couponCode?: string;

  discountAmount?: number;
  discountType?: "percentage" | "fixed";
  discountValue?: number;

  cartTotal?: number;
  finalAmount?: number;

  minimumOrderAmount?: number;
  maxDiscount?: number;
}

export const couponApi = api.injectEndpoints({
  endpoints: (builder) => ({
    validateCoupon: builder.mutation<
      ValidateCouponResponse,
      ApplyCouponRequest
    >({
      query: (body) => ({
        url: API_URLS.VALIDATE_COUPON,
        method: "POST",
        body,
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useValidateCouponMutation } = couponApi;
