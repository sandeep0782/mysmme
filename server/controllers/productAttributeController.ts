import { Request, Response } from "express";
import mongoose from "mongoose";
import ProductAttribute from "../models/ProductAttribute";

export const createProductAttribute = async (req: Request, res: Response) => {
  try {
    const { type, value, sortOrder } = req.body;

    // --------------------------------------------------------
    // VALIDATE TYPE
    // --------------------------------------------------------

    if (typeof type !== "string" || !type.trim()) {
      return res.status(400).json({
        success: false,
        message: "type is required and must be a string.",
      });
    }

    // --------------------------------------------------------
    // VALIDATE VALUE
    // --------------------------------------------------------

    if (typeof value !== "string" || !value.trim()) {
      return res.status(400).json({
        success: false,
        message: "value is required and must be a string.",
      });
    }

    // --------------------------------------------------------
    // VALIDATE SORT ORDER
    // --------------------------------------------------------

    let normalizedSortOrder = 0;

    if (sortOrder !== undefined) {
      const parsedSortOrder = Number(sortOrder);

      if (!Number.isFinite(parsedSortOrder)) {
        return res.status(400).json({
          success: false,
          message: "sortOrder must be a valid number.",
        });
      }

      normalizedSortOrder = parsedSortOrder;
    }

    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    const attribute = await ProductAttribute.create({
      type: type.trim(),
      value: value.trim(),
      isActive: true,
      sortOrder: normalizedSortOrder,
    });

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Product attribute created successfully.",
      data: attribute,
    });
  } catch (error: any) {
    console.error("Create product attribute error:", error);

    // Duplicate type + value
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This attribute value already exists for this attribute type.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create product attribute.",
    });
  }
};

export const getProductAttributes = async (req: Request, res: Response) => {
  try {
    const { type, isActive } = req.query;

    const filter: {
      type?: string;
      isActive?: boolean;
    } = {};

    // --------------------------------------------------------
    // FILTER BY TYPE
    // --------------------------------------------------------

    if (typeof type === "string") {
      const normalizedType = type.trim();

      if (normalizedType) {
        filter.type = normalizedType;
      }
    }

    // --------------------------------------------------------
    // FILTER BY ACTIVE
    // --------------------------------------------------------

    if (typeof isActive === "string") {
      if (isActive === "true") {
        filter.isActive = true;
      } else if (isActive === "false") {
        filter.isActive = false;
      }
    }

    // --------------------------------------------------------
    // GET DATA
    // --------------------------------------------------------

    const attributes = await ProductAttribute.find(filter)
      .sort({
        type: 1,
        sortOrder: 1,
        value: 1,
      })
      .lean();

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,
      count: attributes.length,
      data: attributes,
    });
  } catch (error) {
    console.error("Get product attributes error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product attributes.",
    });
  }
};

export const getProductAttributesByType = async (
  req: Request,
  res: Response,
) => {
  try {
    const { type } = req.params;

    // --------------------------------------------------------
    // VALIDATE TYPE
    // --------------------------------------------------------

    if (typeof type !== "string" || !type.trim()) {
      return res.status(400).json({
        success: false,
        message: "Attribute type is required.",
      });
    }

    // --------------------------------------------------------
    // NORMALIZE TYPE
    // --------------------------------------------------------

    const normalizedType = type.trim();

    // --------------------------------------------------------
    // FETCH ACTIVE ATTRIBUTES
    // --------------------------------------------------------

    const attributes = await ProductAttribute.find({
      type: normalizedType,
      isActive: true,
    })
      .sort({
        sortOrder: 1,
        value: 1,
      })
      .lean();

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,
      type: normalizedType,
      count: attributes.length,
      data: attributes,
    });
  } catch (error) {
    console.error("Get product attributes by type error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product attributes.",
    });
  }
};

export const getProductAttributeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------------

    if (typeof id !== "string" || !id.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product attribute ID is required.",
      });
    }

    const normalizedId = id.trim();

    if (!mongoose.Types.ObjectId.isValid(normalizedId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product attribute ID.",
      });
    }

    // --------------------------------------------------------
    // FIND ATTRIBUTE
    // --------------------------------------------------------

    const attribute = await ProductAttribute.findById(normalizedId).lean();

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: "Product attribute not found.",
      });
    }

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,
      data: attribute,
    });
  } catch (error) {
    console.error("Get product attribute by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product attribute.",
    });
  }
};

export const updateProductAttribute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------------

    if (typeof id !== "string" || !id.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product attribute ID is required.",
      });
    }

    const normalizedId = id.trim();

    if (!mongoose.Types.ObjectId.isValid(normalizedId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product attribute ID.",
      });
    }

    // --------------------------------------------------------
    // BODY
    // --------------------------------------------------------

    const { type, value, isActive, sortOrder } = req.body;

    // --------------------------------------------------------
    // UPDATE OBJECT
    // --------------------------------------------------------

    const update: {
      type?: string;
      value?: string;
      isActive?: boolean;
      sortOrder?: number;
    } = {};

    // --------------------------------------------------------
    // TYPE
    // --------------------------------------------------------

    if (type !== undefined) {
      if (typeof type !== "string" || !type.trim()) {
        return res.status(400).json({
          success: false,
          message: "type must be a valid string.",
        });
      }

      update.type = type.trim();
    }

    // --------------------------------------------------------
    // VALUE
    // --------------------------------------------------------

    if (value !== undefined) {
      if (typeof value !== "string" || !value.trim()) {
        return res.status(400).json({
          success: false,
          message: "value must be a valid string.",
        });
      }

      update.value = value.trim();
    }

    // --------------------------------------------------------
    // IS ACTIVE
    // --------------------------------------------------------

    if (isActive !== undefined) {
      if (typeof isActive === "boolean") {
        update.isActive = isActive;
      } else if (isActive === "true") {
        update.isActive = true;
      } else if (isActive === "false") {
        update.isActive = false;
      } else {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false.",
        });
      }
    }

    // --------------------------------------------------------
    // SORT ORDER
    // --------------------------------------------------------

    if (sortOrder !== undefined) {
      const parsedSortOrder = Number(sortOrder);

      if (!Number.isFinite(parsedSortOrder)) {
        return res.status(400).json({
          success: false,
          message: "sortOrder must be a valid number.",
        });
      }

      update.sortOrder = parsedSortOrder;
    }

    // --------------------------------------------------------
    // NOTHING TO UPDATE
    // --------------------------------------------------------

    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    const attribute = await ProductAttribute.findByIdAndUpdate(
      normalizedId,
      update,
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).lean();

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: "Product attribute not found.",
      });
    }

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Product attribute updated successfully.",
      data: attribute,
    });
  } catch (error: any) {
    console.error("Update product attribute error:", error);

    // Duplicate type + value
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Another product attribute with the same type and value already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update product attribute.",
    });
  }
};

export const deleteProductAttribute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------------

    if (typeof id !== "string" || !id.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product attribute ID is required.",
      });
    }

    const normalizedId = id.trim();

    if (!mongoose.Types.ObjectId.isValid(normalizedId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product attribute ID.",
      });
    }

    // --------------------------------------------------------
    // SOFT DELETE
    // --------------------------------------------------------

    const attribute = await ProductAttribute.findByIdAndUpdate(
      normalizedId,
      {
        isActive: false,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).lean();

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: "Product attribute not found.",
      });
    }

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Product attribute deactivated successfully.",
      data: attribute,
    });
  } catch (error) {
    console.error("Delete product attribute error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate product attribute.",
    });
  }
};

export const activateProductAttribute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------------

    if (typeof id !== "string" || !id.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product attribute ID is required.",
      });
    }

    const normalizedId = id.trim();

    if (!mongoose.Types.ObjectId.isValid(normalizedId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product attribute ID.",
      });
    }

    // --------------------------------------------------------
    // ACTIVATE
    // --------------------------------------------------------

    const attribute = await ProductAttribute.findByIdAndUpdate(
      normalizedId,
      {
        isActive: true,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).lean();

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: "Product attribute not found.",
      });
    }

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Product attribute activated successfully.",
      data: attribute,
    });
  } catch (error) {
    console.error("Activate product attribute error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to activate product attribute.",
    });
  }
};
