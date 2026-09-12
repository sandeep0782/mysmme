import { Request, Response } from "express";
import Seller from "../models/Seller";

export const createSeller = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      sellerName,
      businessName,
      businessType,
      gstNumber,
      panNumber,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      storeName,
      storeSlug,
    } = req.body;

    if (!userId || !sellerName || !email) {
      return res.status(400).json({
        success: false,
        message: "userId, sellerName and email are required",
      });
    }

    // Check seller for user
    const existingSeller = await Seller.findOne({ userId });

    if (existingSeller) {
      return res.status(409).json({
        success: false,
        message: "Seller already exists for this user",
      });
    }

    // Check GST
    if (gstNumber) {
      const existingGST = await Seller.findOne({
        gstNumber: gstNumber.toUpperCase(),
      });

      if (existingGST) {
        return res.status(409).json({
          success: false,
          message: "GST number already exists",
        });
      }
    }

    // Check store slug
    if (storeSlug) {
      const existingStore = await Seller.findOne({
        storeSlug: storeSlug.toLowerCase(),
      });

      if (existingStore) {
        return res.status(409).json({
          success: false,
          message: "Store slug already exists",
        });
      }
    }

    const seller = await Seller.create({
      userId,
      sellerName,
      businessName,
      businessType,

      gstNumber: gstNumber?.toUpperCase(),

      panNumber: panNumber?.toUpperCase(),

      email: email.toLowerCase(),
      phone,

      address,
      city,
      state,
      pincode,
      country: country || "India",

      storeName,

      storeSlug: storeSlug?.toLowerCase(),

      status: "PENDING",

      gstVerified: false,
    });

    return res.status(201).json({
      success: true,
      message: "Seller created successfully",
      seller,
    });
  } catch (error: any) {
    console.error("Create seller error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create seller",
      error: error.message,
    });
  }
};

export const getSellers = async (req: Request, res: Response) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: sellers.length,
      sellers,
    });
  } catch (error: any) {
    console.error("Get sellers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sellers",
      error: error.message,
    });
  }
};

export const getSellerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const seller = await Seller.findById(id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    return res.status(200).json({
      success: true,
      seller,
    });
  } catch (error: any) {
    console.error("Get seller error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch seller",
      error: error.message,
    });
  }
};

export const updateSeller = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const seller = await Seller.findById(id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const {
      sellerName,
      businessName,
      businessType,
      panNumber,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      storeName,
      storeSlug,
    } = req.body;

    seller.sellerName = sellerName ?? seller.sellerName;
    seller.businessName = businessName ?? seller.businessName;
    seller.businessType = businessType ?? seller.businessType;

    seller.panNumber = panNumber?.toUpperCase() ?? seller.panNumber;

    seller.email = email?.toLowerCase() ?? seller.email;

    seller.phone = phone ?? seller.phone;

    seller.address = address ?? seller.address;
    seller.city = city ?? seller.city;
    seller.state = state ?? seller.state;
    seller.pincode = pincode ?? seller.pincode;
    seller.country = country ?? seller.country;

    seller.storeName = storeName ?? seller.storeName;

    seller.storeSlug = storeSlug?.toLowerCase() ?? seller.storeSlug;

    const updatedSeller = await seller.save();

    return res.status(200).json({
      success: true,
      message: "Seller updated successfully",
      seller: updatedSeller,
    });
  } catch (error: any) {
    console.error("Update seller error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update seller",
      error: error.message,
    });
  }
};

export const deleteSeller = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const seller = await Seller.findById(id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    await Seller.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Seller deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete seller error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete seller",
      error: error.message,
    });
  }
};

export const updateSellerStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["PENDING", "ACTIVE", "SUSPENDED", "REJECTED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller status",
      });
    }

    const seller = await Seller.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Seller status updated successfully",
      seller,
    });
  } catch (error: any) {
    console.error("Update seller status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update seller status",
      error: error.message,
    });
  }
};

export const verifySellerGST = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const seller = await Seller.findById(id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    if (!seller.gstNumber) {
      return res.status(400).json({
        success: false,
        message: "Seller does not have a GSTIN",
      });
    }

    const gstin = seller.gstNumber.toUpperCase();

    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

    if (!gstinRegex.test(gstin)) {
      return res.status(400).json({
        success: false,
        message: "Invalid GSTIN format",
      });
    }

    const apiKey = process.env.GST_VERIFICATION_API;

    const baseUrl =
      process.env.GST_VERIFY_BASE_URL || "https://gstverify.co.in/api/v1";

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "GST verification API key is not configured",
      });
    }

    const response = await fetch(`${baseUrl}/verify/${gstin}`, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return res.status(response.status || 400).json({
        success: false,
        message: result?.message || "GST verification failed",
        data: result?.data || null,
      });
    }

    const gstData = result.data;

    if (!gstData?.gstin) {
      return res.status(400).json({
        success: false,
        message: "Invalid response from GST verification service",
      });
    }

    // Update seller GST information
    seller.gstNumber = gstData.gstin.toUpperCase();

    seller.gstVerified = gstData.status?.toLowerCase() === "active";

    seller.gstVerifiedAt = seller.gstVerified ? new Date() : undefined;

    // Fill business information from GST if empty
    if (!seller.businessName && gstData.legal_name) {
      seller.businessName = gstData.legal_name;
    }

    if (!seller.storeName && gstData.trade_name) {
      seller.storeName = gstData.trade_name;
    }

    await seller.save();

    return res.status(200).json({
      success: true,
      message: seller.gstVerified
        ? "GSTIN verified successfully"
        : "GSTIN is not active",

      cached: result.cached ?? false,
      credits_remaining: result.credits_remaining ?? null,

      data: {
        gstin: gstData.gstin,
        legal_name: gstData.legal_name,
        trade_name: gstData.trade_name,
        status: gstData.status,
        constitution: gstData.constitution,
        taxpayer_type: gstData.taxpayer_type,
        registration_date: gstData.registration_date,
        state: gstData.state,
        pan: gstData.pan,
        address: gstData.address,
        nature_of_business: gstData.nature_of_business,
      },

      seller: {
        id: seller._id,
        sellerName: seller.sellerName,
        businessName: seller.businessName,
        storeName: seller.storeName,
        gstNumber: seller.gstNumber,
        gstVerified: seller.gstVerified,
        gstVerifiedAt: seller.gstVerifiedAt,
        status: seller.status,
      },
    });
  } catch (error: any) {
    console.error("GST verification error:", error);

    return res.status(500).json({
      success: false,
      message: "GST verification service failed",
      error: error.message,
    });
  }
};
