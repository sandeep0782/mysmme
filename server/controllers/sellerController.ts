import { Request, Response } from "express";
import Seller from "../models/Seller";
import { verifyGST } from "../services/gstService";

// ==========================================
// GST DATA TYPE
// ==========================================

export interface GSTData {
  gstin: string;
  legal_name: string;
  trade_name: string;
  status: string;
  constitution: string;
  taxpayer_type: string;
  registration_date: string;
  last_updated: string;
  state: string;
  state_code: string;
  pan: string;
  address: string;
  district: string;
  pincode: string;
  nature_of_business: string[];
}

// ==========================================
// VERIFY GST
// ==========================================

export const verifySellerGST = async (req: Request, res: Response) => {
  try {
    const { gstNumber } = req.body;

    // ------------------------------------------
    // Validate GST number
    // ------------------------------------------

    if (!gstNumber) {
      return res.status(400).json({
        success: false,
        message: "GST number is required",
      });
    }

    const normalizedGSTIN = String(gstNumber).trim().toUpperCase();

    // ------------------------------------------
    // Basic GSTIN format validation
    // ------------------------------------------

    if (!/^[0-9A-Z]{15}$/.test(normalizedGSTIN)) {
      return res.status(400).json({
        success: false,
        message: "Invalid GST number format",
      });
    }

    // ------------------------------------------
    // Check if GST already exists
    // ------------------------------------------

    const existingSeller = await Seller.findOne({
      gstNumber: normalizedGSTIN,
    });

    if (existingSeller) {
      return res.status(409).json({
        success: false,
        message: "This GST number is already registered",
      });
    }

    // ------------------------------------------
    // Call GST API
    // ------------------------------------------

    const gst: GSTData = await verifyGST(normalizedGSTIN);

    // ------------------------------------------
    // Determine GST status
    // ------------------------------------------

    const gstStatus =
      gst.status?.toUpperCase() === "ACTIVE" ? "ACTIVE" : "REJECTED";

    // ------------------------------------------
    // Return GST information
    // ------------------------------------------

    return res.status(200).json({
      success: true,

      data: {
        gstNumber: gst.gstin,

        gstStatus,

        sellerName: gst.legal_name,

        businessName: gst.legal_name,

        businessType: gst.constitution,

        panNumber: gst.pan,

        storeName: gst.trade_name,

        address: gst.address,

        city: gst.district,

        state: gst.state,

        pincode: gst.pincode,

        country: "India",

        registrationDate: gst.registration_date,

        taxpayerType: gst.taxpayer_type,

        natureOfBusiness: gst.nature_of_business,
      },
    });
  } catch (error: any) {
    console.error("GST verification error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Unable to verify GST number",
    });
  }
};

// ==========================================
// CREATE SELLER
// ==========================================

export const createSeller = async (req: Request, res: Response) => {
  try {
    const { sellerName, email, phone, gstNumber, storeName, commissionRate } =
      req.body;

    // ------------------------------------------
    // Basic validation
    // ------------------------------------------

    if (!sellerName) {
      return res.status(400).json({
        success: false,
        message: "Seller name is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // ------------------------------------------
    // Get authenticated user
    // ------------------------------------------

    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // ------------------------------------------
    // Check existing seller for this user
    // ------------------------------------------

    const existingUserSeller = await Seller.findOne({
      userId,
    });

    if (existingUserSeller) {
      return res.status(409).json({
        success: false,
        message: "Seller profile already exists",
      });
    }

    // ------------------------------------------
    // GST DATA
    // ------------------------------------------

    let gstData: GSTData | null = null;

    // ------------------------------------------
    // Verify GST if provided
    // ------------------------------------------

    if (gstNumber) {
      const normalizedGSTIN = String(gstNumber).trim().toUpperCase();

      // ----------------------------------------
      // Validate GST format
      // ----------------------------------------

      if (!/^[0-9A-Z]{15}$/.test(normalizedGSTIN)) {
        return res.status(400).json({
          success: false,
          message: "Invalid GST number format",
        });
      }

      // ----------------------------------------
      // Check duplicate GST
      // ----------------------------------------

      const existingGSTSeller = await Seller.findOne({
        gstNumber: normalizedGSTIN,
      });

      if (existingGSTSeller) {
        return res.status(409).json({
          success: false,
          message: "This GST number is already registered",
        });
      }

      // ----------------------------------------
      // Verify GST with external API
      // ----------------------------------------

      gstData = await verifyGST(normalizedGSTIN);

      // ----------------------------------------
      // Check GST status
      // ----------------------------------------

      const actualGSTStatus = gstData?.status?.trim().toUpperCase();

      console.log("========== GST STATUS CHECK ==========");
      console.log("GSTIN:", gstData?.gstin);
      console.log("Raw GST status:", gstData?.status);
      console.log("Normalized GST status:", actualGSTStatus);

      if (actualGSTStatus !== "ACTIVE") {
        return res.status(400).json({
          success: false,
          message: "Only active GST registrations can be added.",
          data: {
            gstNumber: gstData.gstin,
            gstStatus: gstData.status,
          },
        });
      }
    }

    // ------------------------------------------
    // Create seller
    // ------------------------------------------

    const seller = await Seller.create({
      userId,

      // ----------------------------------------
      // Seller Information
      // ----------------------------------------

      sellerName: sellerName || gstData?.legal_name || "",

      businessName: gstData?.legal_name || "",

      businessType: gstData?.constitution || "",

      // ----------------------------------------
      // GST
      // ----------------------------------------

      gstNumber: gstData?.gstin || undefined,

      gstStatus:
        gstData?.status?.trim().toUpperCase() === "ACTIVE"
          ? "ACTIVE"
          : "REJECTED",
      gstVerifiedAt: gstData ? new Date() : undefined,

      // ----------------------------------------
      // PAN
      // ----------------------------------------

      panNumber: gstData?.pan || undefined,

      // ----------------------------------------
      // Contact
      // ----------------------------------------

      email: String(email).trim().toLowerCase(),

      phone: phone || "",

      // ----------------------------------------
      // Address
      // ----------------------------------------

      address: gstData?.address || "",

      city: gstData?.district || "",

      state: gstData?.state || "",

      pincode: gstData?.pincode || "",

      country: "India",

      // ----------------------------------------
      // Store
      // ----------------------------------------

      storeName: storeName || gstData?.trade_name || gstData?.legal_name || "",

      // ----------------------------------------
      // Seller platform status
      // ----------------------------------------

      status: "PENDING",

      // ----------------------------------------
      // Commission
      // ----------------------------------------

      commissionRate: commissionRate !== undefined ? Number(commissionRate) : 0,
    });

    // ------------------------------------------
    // Success
    // ------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Seller created successfully",
      data: seller,
    });
  } catch (error: any) {
    console.error("Create seller error:", error);

    // ------------------------------------------
    // Duplicate MongoDB key
    // ------------------------------------------

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Seller information already exists",
      });
    }

    // ------------------------------------------
    // Error
    // ------------------------------------------

    return res.status(500).json({
      success: false,
      message: error?.message || "Unable to create seller",
    });
  }
};

// ==========================================
// GET ALL SELLERS
// ==========================================

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
      error: error?.message,
    });
  }
};

// ==========================================
// GET SELLER BY ID
// ==========================================

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
      error: error?.message,
    });
  }
};

// ==========================================
// UPDATE SELLER
// ==========================================

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

    // ------------------------------------------
    // Seller information
    // ------------------------------------------

    seller.sellerName = sellerName ?? seller.sellerName;

    seller.businessName = businessName ?? seller.businessName;

    seller.businessType = businessType ?? seller.businessType;

    // ------------------------------------------
    // PAN
    // ------------------------------------------

    if (panNumber !== undefined) {
      seller.panNumber = panNumber
        ? String(panNumber).trim().toUpperCase()
        : "";
    }

    // ------------------------------------------
    // Contact
    // ------------------------------------------

    if (email !== undefined) {
      seller.email = String(email).trim().toLowerCase();
    }

    seller.phone = phone ?? seller.phone;

    // ------------------------------------------
    // Address
    // ------------------------------------------

    seller.address = address ?? seller.address;

    seller.city = city ?? seller.city;

    seller.state = state ?? seller.state;

    seller.pincode = pincode ?? seller.pincode;

    seller.country = country ?? seller.country;

    // ------------------------------------------
    // Store
    // ------------------------------------------

    seller.storeName = storeName ?? seller.storeName;

    if (storeSlug !== undefined) {
      seller.storeSlug = storeSlug
        ? String(storeSlug).trim().toLowerCase()
        : "";
    }

    // ------------------------------------------
    // Save
    // ------------------------------------------

    const updatedSeller = await seller.save();

    return res.status(200).json({
      success: true,
      message: "Seller updated successfully",
      seller: updatedSeller,
    });
  } catch (error: any) {
    console.error("Update seller error:", error);

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Seller information already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update seller",
      error: error?.message,
    });
  }
};

// ==========================================
// DELETE SELLER
// ==========================================

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
      error: error?.message,
    });
  }
};

// ==========================================
// UPDATE SELLER STATUS
// ==========================================

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
      error: error?.message,
    });
  }
};
