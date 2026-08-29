import { Request, Response } from "express";
import Color from "../models/Color";
import { response } from "../utils/responseHandler";

// ============================================================
// GET ALL COLORS
// ============================================================

export const getColors = async (_req: Request, res: Response) => {
  try {
    const colors = await Color.find().sort({ name: 1 });

    return response(
      res,
      200,
      "Colors fetched successfully",
      colors
    );
  } catch (error) {
    console.error("Failed to fetch colors:", error);

    return response(
      res,
      500,
      "Failed to fetch colors"
    );
  }
};

// ============================================================
// GET ACTIVE COLORS
// ============================================================

export const getActiveColors = async (
  _req: Request,
  res: Response
) => {
  try {
    const colors = await Color.find({
      isActive: true,
    }).sort({ name: 1 });

    return response(
      res,
      200,
      "Active colors fetched successfully",
      colors
    );
  } catch (error) {
    console.error("Failed to fetch active colors:", error);

    return response(
      res,
      500,
      "Failed to fetch active colors"
    );
  }
};

// ============================================================
// GET COLOR BY ID
// ============================================================

export const getColorById = async (
  req: Request,
  res: Response
) => {
  try {
    const color = await Color.findById(req.params.id);

    if (!color) {
      return response(
        res,
        404,
        "Color not found"
      );
    }

    return response(
      res,
      200,
      "Color fetched successfully",
      color
    );
  } catch (error) {
    console.error("Failed to fetch color:", error);

    return response(
      res,
      500,
      "Failed to fetch color"
    );
  }
};

// ============================================================
// CREATE COLOR
// ============================================================

export const createColor = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, hexCode, isActive } = req.body;

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!name || !name.trim()) {
      return response(
        res,
        400,
        "Color name is required"
      );
    }

    if (!hexCode || !hexCode.trim()) {
      return response(
        res,
        400,
        "Hex code is required"
      );
    }

    const trimmedName = name.trim();
    const trimmedHexCode = hexCode.trim();

    // --------------------------------------------------------
    // CHECK DUPLICATE NAME
    // --------------------------------------------------------

    const existingColor = await Color.findOne({
      name: trimmedName,
    });

    if (existingColor) {
      return response(
        res,
        409,
        "Color with this name already exists"
      );
    }

    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    const color = await Color.create({
      name: trimmedName,
      hexCode: trimmedHexCode,
      isActive:
        typeof isActive === "boolean"
          ? isActive
          : true,
    });

    return response(
      res,
      201,
      "Color created successfully",
      color
    );
  } catch (error) {
    console.error("Failed to create color:", error);

    return response(
      res,
      500,
      "Failed to create color"
    );
  }
};

// ============================================================
// UPDATE COLOR
// ============================================================

export const updateColor = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, hexCode, isActive } = req.body;

    // --------------------------------------------------------
    // FIND COLOR
    // --------------------------------------------------------

    const color = await Color.findById(req.params.id);

    if (!color) {
      return response(
        res,
        404,
        "Color not found"
      );
    }

    // --------------------------------------------------------
    // UPDATE NAME
    // --------------------------------------------------------

    if (name !== undefined) {
      if (!name.trim()) {
        return response(
          res,
          400,
          "Color name cannot be empty"
        );
      }

      const trimmedName = name.trim();

      // Check if another color already uses this name
      const existingColor = await Color.findOne({
        name: trimmedName,
        _id: { $ne: color._id },
      });

      if (existingColor) {
        return response(
          res,
          409,
          "Color with this name already exists"
        );
      }

      color.name = trimmedName;
    }

    // --------------------------------------------------------
    // UPDATE HEX CODE
    // --------------------------------------------------------

    if (hexCode !== undefined) {
      if (!hexCode.trim()) {
        return response(
          res,
          400,
          "Hex code cannot be empty"
        );
      }

      color.hexCode = hexCode.trim();
    }

    // --------------------------------------------------------
    // UPDATE STATUS
    // --------------------------------------------------------

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return response(
          res,
          400,
          "isActive must be a boolean"
        );
      }

      color.isActive = isActive;
    }

    // --------------------------------------------------------
    // SAVE
    // --------------------------------------------------------

    await color.save();

    return response(
      res,
      200,
      "Color updated successfully",
      color
    );
  } catch (error) {
    console.error("Failed to update color:", error);

    return response(
      res,
      500,
      "Failed to update color"
    );
  }
};

// ============================================================
// DELETE COLOR
// ============================================================

export const deleteColor = async (
  req: Request,
  res: Response
) => {
  try {
    const color = await Color.findByIdAndDelete(
      req.params.id
    );

    if (!color) {
      return response(
        res,
        404,
        "Color not found"
      );
    }

    return response(
      res,
      200,
      "Color deleted successfully"
    );
  } catch (error) {
    console.error("Failed to delete color:", error);

    return response(
      res,
      500,
      "Failed to delete color"
    );
  }
};