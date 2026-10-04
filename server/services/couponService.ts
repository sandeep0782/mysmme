import Coupon from "../models/Coupon";
import CouponRedemption from "../models/CouponRedemption";

type ValidateCouponParams = {
  code: string;
  cartTotal: number;
  userId?: string;
  userOrderCount?: number;
};

type CouponResult = {
  valid: boolean;
  message: string;

  couponId?: string;
  couponCode?: string;

  discountAmount?: number;
  finalAmount?: number;
};

export async function validateCoupon({
  code,
  cartTotal,
  userId,
  userOrderCount = 0,
}: ValidateCouponParams): Promise<CouponResult> {
  const normalizedCode = code.trim().toUpperCase();

  const coupon = await Coupon.findOne({
    code: normalizedCode,
  });

  if (!coupon) {
    return {
      valid: false,
      message: "Invalid coupon code.",
    };
  }

  if (!coupon.isActive) {
    return {
      valid: false,
      message: "This coupon is currently inactive.",
    };
  }

  const now = new Date();

  if (now < coupon.startsAt) {
    return {
      valid: false,
      message: "This coupon is not active yet.",
    };
  }

  if (now > coupon.expiresAt) {
    return {
      valid: false,
      message: "This coupon has expired.",
    };
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return {
      valid: false,
      message: "This coupon has reached its usage limit.",
    };
  }

  if (cartTotal < coupon.minimumOrderAmount) {
    return {
      valid: false,
      message: `Minimum order amount of ₹${coupon.minimumOrderAmount} is required.`,
    };
  }

  if (coupon.firstOrderOnly && userOrderCount > 0) {
    return {
      valid: false,
      message: "This coupon is valid only on your first order.",
    };
  }

  if (userId) {
    const userUsageCount = await CouponRedemption.countDocuments({
      coupon: coupon._id,
      user: userId,
      status: {
        $in: ["reserved", "redeemed"],
      },
    });

    if (userUsageCount >= coupon.usageLimitPerUser) {
      return {
        valid: false,
        message: "You have already used this coupon.",
      };
    }
  }

  let discountAmount = 0;

  if (coupon.discountType === "percentage") {
    discountAmount = (cartTotal * coupon.discountValue) / 100;

    if (
      coupon.maximumDiscountAmount &&
      discountAmount > coupon.maximumDiscountAmount
    ) {
      discountAmount = coupon.maximumDiscountAmount;
    }
  }

  if (coupon.discountType === "fixed") {
    discountAmount = coupon.discountValue;
  }

  discountAmount = Math.min(discountAmount, cartTotal);

  discountAmount = Math.round(discountAmount * 100) / 100;

  const finalAmount = Math.round((cartTotal - discountAmount) * 100) / 100;

  return {
    valid: true,
    message: `Coupon applied successfully. You saved ₹${discountAmount}.`,
    couponId: coupon._id.toString(),
    couponCode: coupon.code,
    discountAmount,
    finalAmount,
  };
}
