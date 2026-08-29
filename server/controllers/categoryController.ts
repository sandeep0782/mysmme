import { Request, Response } from "express";
import Category from "../models/Category";
import { response } from "../utils/responseHandler";
import sharp from "sharp";
import { uploadFileToCloudinary } from "../config/cloudnaryConfig";
import { removeLocalFile } from "../config/removeFile";
import { v2 as cloudinary } from "cloudinary";

// ============================================================
// DELETE FILE FROM CLOUDINARY
// ============================================================

export const deleteFileFromCloudinary = async (
  publicId: string
) => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
};

// ============================================================
// CREATE CATEGORY
// ============================================================

export const createCategory = async (
  req: Request,
  res: Response
) => {
  let filePath: string | undefined;
  let compressedPath: string | undefined;

  try {
    const { name, description } = req.body;

    // Validate name
    if (!name?.trim()) {
      return response(
        res,
        400,
        "Category name is required"
      );
    }

    // Check duplicate name
    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return response(
        res,
        409,
        "Category with this name already exists"
      );
    }

    // Image required when creating category
    if (!req.file) {
      return response(
        res,
        400,
        "Category image is required"
      );
    }

    filePath = req.file.path;

    // ========================================================
    // COMPRESS IMAGE
    // ========================================================

    compressedPath = `${filePath}-compressed.webp`;

    await sharp(filePath)
      .webp({ quality: 60 })
      .toFile(compressedPath);

    // ========================================================
    // UPLOAD TO CLOUDINARY
    // ========================================================

    const upload = await uploadFileToCloudinary({
      ...req.file,
      path: compressedPath,
    });

    // ========================================================
    // REMOVE LOCAL FILES
    // ========================================================

    removeLocalFile(filePath);
    removeLocalFile(compressedPath);

    filePath = undefined;
    compressedPath = undefined;

    // ========================================================
    // CREATE CATEGORY
    // ========================================================

    const category = await Category.create({
      name: name.trim(),
      description: description?.trim() || "",
      image: upload.secure_url,
      imagePublicId: upload.public_id,
      isActive: true,
    });

    return response(
      res,
      201,
      "Category created successfully",
      category
    );
  } catch (error) {
    console.error(
      "Create category error:",
      error
    );

    if (filePath) {
      removeLocalFile(filePath);
    }

    if (compressedPath) {
      removeLocalFile(compressedPath);
    }

    return response(
      res,
      500,
      "Internal Server Error"
    );
  }
};

// ============================================================
// GET ALL CATEGORIES
// ============================================================

export const getAllCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await Category.find().sort({
      createdAt: -1,
    });

    return response(
      res,
      200,
      "Categories fetched successfully",
      categories
    );
  } catch (error) {
    console.error(
      "Get categories error:",
      error
    );

    return response(
      res,
      500,
      "Internal Server Error"
    );
  }
};

// ============================================================
// GET CATEGORY BY ID
// ============================================================

export const getCategoryById = async (
  req: Request,
  res: Response
) => {
  try {
    const category = await Category.findById(
      req.params.id
    );

    if (!category) {
      return response(
        res,
        404,
        "Category not found"
      );
    }

    return response(
      res,
      200,
      "Category fetched successfully",
      category
    );
  } catch (error) {
    console.error(
      "Get category error:",
      error
    );

    return response(
      res,
      500,
      "Internal Server Error"
    );
  }
};

// ============================================================
// UPDATE CATEGORY
// ============================================================

export const updateCategory = async (
  req: Request,
  res: Response
) => {
  let filePath: string | undefined;
  let compressedPath: string | undefined;

  try {
    const {
      name,
      description,
      isActive,
    } = req.body;

    const category = await Category.findById(
      req.params.id
    );

    if (!category) {
      return response(
        res,
        404,
        "Category not found"
      );
    }

    // Keep old image public ID
    const oldImagePublicId =
      category.imagePublicId;

    // ========================================================
    // UPDATE NAME
    // ========================================================

    if (name?.trim()) {
      category.name = name.trim();
    }

    // ========================================================
    // UPDATE DESCRIPTION
    // ========================================================

    if (description !== undefined) {
      category.description =
        description.trim();
    }

    // ========================================================
    // UPDATE STATUS
    // ========================================================

    if (isActive !== undefined) {
      category.isActive =
        isActive === true ||
        isActive === "true";
    }

    // ========================================================
    // HANDLE IMAGE UPLOAD
    // ========================================================

    if (req.file) {
      console.log(
        "req.file:",
        req.file
      );

      filePath = req.file.path;

      // Compress image
      compressedPath =
        `${filePath}-compressed.webp`;

      await sharp(filePath)
        .webp({ quality: 60 })
        .toFile(compressedPath);

      // Upload NEW image
      const upload =
        await uploadFileToCloudinary({
          ...req.file,
          path: compressedPath,
        });

      // Save NEW image information
      category.image =
        upload.secure_url;

      category.imagePublicId =
        upload.public_id;
    }

    // ========================================================
    // SAVE DATABASE FIRST
    // ========================================================

    const updatedCategory =
      await category.save();

    // ========================================================
    // DELETE OLD CLOUDINARY IMAGE
    // ONLY AFTER DB UPDATE SUCCEEDS
    // ========================================================

    if (
      req.file &&
      oldImagePublicId &&
      oldImagePublicId !==
        category.imagePublicId
    ) {
      try {
        console.log(
          "Deleting Cloudinary public ID:",
          oldImagePublicId
        );

        const result =
          await deleteFileFromCloudinary(
            oldImagePublicId
          );

        console.log(
          "Cloudinary destroy result:",
          result
        );
      } catch (
        cloudinaryError
      ) {
        console.error(
          "Failed to delete old Cloudinary category image:",
          cloudinaryError
        );
      }
    }

    // ========================================================
    // REMOVE LOCAL FILES
    // ========================================================

    if (filePath) {
      removeLocalFile(filePath);
      filePath = undefined;
    }

    if (compressedPath) {
      removeLocalFile(
        compressedPath
      );
      compressedPath = undefined;
    }

    return response(
      res,
      200,
      "Category updated successfully",
      updatedCategory
    );
  } catch (error) {
    console.error(
      "Update category error:",
      error
    );

    if (filePath) {
      removeLocalFile(filePath);
    }

    if (compressedPath) {
      removeLocalFile(
        compressedPath
      );
    }

    return response(
      res,
      500,
      "Internal Server Error"
    );
  }
};

// ============================================================
// DELETE CATEGORY
// ============================================================

export const deleteCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const category =
      await Category.findById(
        req.params.id
      );

    if (!category) {
      return response(
        res,
        404,
        "Category not found"
      );
    }

    // Keep public ID before deleting DB document
    const imagePublicId =
      category.imagePublicId;

    // Delete database record
    await Category.findByIdAndDelete(
      req.params.id
    );

    // Delete Cloudinary image
    if (imagePublicId) {
      try {
        console.log(
          "Deleting category image:",
          imagePublicId
        );

        const result =
          await deleteFileFromCloudinary(
            imagePublicId
          );

        console.log(
          "Cloudinary destroy result:",
          result
        );
      } catch (
        cloudinaryError
      ) {
        console.error(
          "Failed to delete category image:",
          cloudinaryError
        );
      }
    }

    return response(
      res,
      200,
      "Category deleted successfully"
    );
  } catch (error) {
    console.error(
      "Delete category error:",
      error
    );

    return response(
      res,
      500,
      "Internal Server Error"
    );
  }
};