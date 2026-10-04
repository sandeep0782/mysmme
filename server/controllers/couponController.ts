import { Request, Response } from "express";
import { validateCoupon } from "../services/couponService";
import Coupon from "../models/Coupon";
import User from "../models/User";

export async function validateCouponController(req: Request, res: Response) {
  try {
    const { code, cartTotal, userOrderCount } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required.",
      });
    }

    if (cartTotal === undefined || Number(cartTotal) < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid cart total is required.",
      });
    }

    const userId = (req as any).user?._id;

    const result = await validateCoupon({
      code,
      cartTotal: Number(cartTotal),
      userId: userId?.toString(),
      userOrderCount: Number(userOrderCount) || 0,
    });

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        ...result,
      });
    }

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("VALIDATE COUPON ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to validate coupon.",
    });
  }
}

export async function createCouponController(req: Request, res: Response) {
  try {
    const {
      code,
      name,
      description,

      discountType,
      discountValue,

      minimumOrderAmount,
      maximumDiscountAmount,

      startsAt,
      expiresAt,

      usageLimit,
      usageLimitPerUser,

      firstOrderOnly,

      appliesTo,
      productIds,
      categoryIds,
      brandIds,

      assignedFreelancer,

      commissionType,
      commissionValue,

      isActive,
    } = req.body;

    if (
      !code ||
      !name ||
      !discountType ||
      discountValue === undefined ||
      !startsAt ||
      !expiresAt
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Code, name, discount type, discount value, start date and expiry date are required.",
      });
    }

    const existingCoupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
    });

    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message: "A coupon with this code already exists.",
      });
    }

    const coupon = await Coupon.create({
      code: code.trim().toUpperCase(),
      name,
      description,

      discountType,
      discountValue,

      minimumOrderAmount: Number(minimumOrderAmount) || 0,

      maximumDiscountAmount:
        maximumDiscountAmount !== undefined
          ? Number(maximumDiscountAmount)
          : undefined,

      startsAt,
      expiresAt,

      usageLimit: usageLimit !== undefined ? Number(usageLimit) : undefined,

      usageLimitPerUser: Number(usageLimitPerUser) || 1,

      firstOrderOnly: Boolean(firstOrderOnly),

      appliesTo: appliesTo || "all",

      productIds: productIds || [],
      categoryIds: categoryIds || [],
      brandIds: brandIds || [],

      assignedFreelancer: assignedFreelancer || null,

      commissionType: assignedFreelancer ? commissionType : undefined,

      commissionValue:
        assignedFreelancer && commissionValue !== undefined
          ? Number(commissionValue)
          : undefined,

      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully.",
      data: coupon,
    });
  } catch (error: any) {
    console.error("CREATE COUPON ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Unable to create coupon.",
    });
  }
}

export async function getCouponsController(req: Request, res: Response) {
  try {
    const coupons = await Coupon.find()
      .populate("assignedFreelancer", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    console.error("GET COUPONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch coupons.",
    });
  }
}

export async function getMyCouponController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const coupon = await Coupon.findOne({
      assignedFreelancer: userId,
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    console.error("GET MY COUPON ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch freelancer coupon.",
    });
  }
}

export async function updateCouponController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    const allowedFields = [
      "code",
      "name",
      "description",
      "discountType",
      "discountValue",
      "minimumOrderAmount",
      "maximumDiscountAmount",
      "startsAt",
      "expiresAt",
      "usageLimit",
      "usageLimitPerUser",
      "firstOrderOnly",
      "appliesTo",
      "productIds",
      "categoryIds",
      "brandIds",
      "assignedFreelancer",
      "commissionType",
      "commissionValue",
      "isActive",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        (coupon as any)[field] = req.body[field];
      }
    }

    if (coupon.code) {
      coupon.code = coupon.code.trim().toUpperCase();
    }

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully.",
      data: coupon,
    });
  } catch (error: any) {
    console.error("UPDATE COUPON ERROR:", error);

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A coupon with this code already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error?.message || "Unable to update coupon.",
    });
  }
}

export async function deleteCouponController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE COUPON ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete coupon.",
    });
  }
}

export async function getCouponFreelancersController(
  req: Request,
  res: Response,
) {
  try {
    const freelancers = await User.find({
      role: "freelancer",
    })
      .select("_id name email role")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      data: freelancers,
    });
  } catch (error) {
    console.error("GET COUPON FREELANCERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch freelancers.",
    });
  }
}
