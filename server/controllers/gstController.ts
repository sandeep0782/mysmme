import { Request, Response } from "express";
import Gst from "../models/Gst";
import { response } from "../utils/responseHandler";

// ============================================================
// GET ALL GST RATES
// ============================================================

export const getGsts = async (_req: Request, res: Response) => {
  try {
    const gsts = await Gst.find().sort({ percentage: 1 });

    return response(res, 200, "GST rates fetched successfully", gsts);
  } catch (error) {
    console.error("Failed to fetch GST rates:", error);

    return response(res, 500, "Failed to fetch GST rates");
  }
};

// ============================================================
// GET ACTIVE GST RATES
// ============================================================

export const getActiveGsts = async (_req: Request, res: Response) => {
  try {
    const gsts = await Gst.find({
      isActive: true,
    }).sort({ percentage: 1 });

    return response(res, 200, "Active GST rates fetched successfully", gsts);
  } catch (error) {
    console.error("Failed to fetch active GST rates:", error);

    return response(res, 500, "Failed to fetch active GST rates");
  }
};

// ============================================================
// GET GST BY ID
// ============================================================

export const getGstById = async (req: Request, res: Response) => {
  try {
    const gst = await Gst.findById(req.params.id);

    if (!gst) {
      return response(res, 404, "GST rate not found");
    }

    return response(res, 200, "GST rate fetched successfully", gst);
  } catch (error) {
    console.error("Failed to fetch GST rate:", error);

    return response(res, 500, "Failed to fetch GST rate");
  }
};

// ============================================================
// CREATE GST RATE
// ============================================================

export const createGst = async (req: Request, res: Response) => {
  try {
    const { percentage, isActive } = req.body;

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (percentage === undefined || percentage === null) {
      return response(res, 400, "GST percentage is required");
    }

    if (typeof percentage !== "number" || !Number.isFinite(percentage)) {
      return response(res, 400, "GST percentage must be a valid number");
    }

    if (percentage < 0 || percentage > 100) {
      return response(res, 400, "GST percentage must be between 0 and 100");
    }

    // --------------------------------------------------------
    // CHECK DUPLICATE
    // --------------------------------------------------------

    const existingGst = await Gst.findOne({
      percentage,
    });

    if (existingGst) {
      return response(res, 409, "GST percentage already exists");
    }

    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    const gst = await Gst.create({
      percentage,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    return response(res, 201, "GST rate created successfully", gst);
  } catch (error) {
    console.error("Failed to create GST rate:", error);

    return response(res, 500, "Failed to create GST rate");
  }
};

// ============================================================
// UPDATE GST RATE
// ============================================================

export const updateGst = async (req: Request, res: Response) => {
  try {
    const { percentage, isActive } = req.body;

    // --------------------------------------------------------
    // FIND GST
    // --------------------------------------------------------

    const gst = await Gst.findById(req.params.id);

    if (!gst) {
      return response(res, 404, "GST rate not found");
    }

    // --------------------------------------------------------
    // UPDATE PERCENTAGE
    // --------------------------------------------------------

    if (percentage !== undefined) {
      if (typeof percentage !== "number" || !Number.isFinite(percentage)) {
        return response(res, 400, "GST percentage must be a valid number");
      }

      if (percentage < 0 || percentage > 100) {
        return response(res, 400, "GST percentage must be between 0 and 100");
      }

      // Check if another GST record already uses this percentage
      const existingGst = await Gst.findOne({
        percentage,
        _id: { $ne: gst._id },
      });

      if (existingGst) {
        return response(res, 409, "GST percentage already exists");
      }

      gst.percentage = percentage;
    }

    // --------------------------------------------------------
    // UPDATE STATUS
    // --------------------------------------------------------

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return response(res, 400, "isActive must be a boolean");
      }

      gst.isActive = isActive;
    }

    // --------------------------------------------------------
    // SAVE
    // --------------------------------------------------------

    await gst.save();

    return response(res, 200, "GST rate updated successfully", gst);
  } catch (error) {
    console.error("Failed to update GST rate:", error);

    return response(res, 500, "Failed to update GST rate");
  }
};

// ============================================================
// DELETE GST RATE
// ============================================================

export const deleteGst = async (req: Request, res: Response) => {
  try {
    const gst = await Gst.findByIdAndDelete(req.params.id);

    if (!gst) {
      return response(res, 404, "GST rate not found");
    }

    return response(res, 200, "GST rate deleted successfully");
  } catch (error) {
    console.error("Failed to delete GST rate:", error);

    return response(res, 500, "Failed to delete GST rate");
  }
};
