import { Request, Response } from "express";
import Brand from "../models/Brands";
import { response } from "../utils/responseHandler";
import sharp from "sharp";
import { uploadFileToCloudinary } from "../config/cloudnaryConfig";
import { removeLocalFile } from "../config/removeFile";
import { v2 as cloudinary } from "cloudinary";


export const createBrand = async (req: Request, res: Response) => {
  let filePath: string | undefined;
  let compressedPath: string | undefined;

  try {
    const { name, description } = req.body;

    if (!name?.trim()) {
      return response(res, 400, "Brand name is required");
    }

    const existing = await Brand.findOne({
      name: name.trim(),
    });

    if (existing) {
      return response(
        res,
        409,
        "Brand with this name already exists"
      );
    }

    if (!req.file) {
      return response(
        res,
        400,
        "Brand logo is required"
      );
    }

    console.log("req.file:", req.file);

    filePath = req.file.path;

    // Compress logo
    compressedPath = `${filePath}-compressed.webp`;

    await sharp(filePath)
      .webp({ quality: 60 })
      .toFile(compressedPath);

    // Upload compressed logo to Cloudinary
    const upload = await uploadFileToCloudinary({
      ...req.file,
      path: compressedPath,
    });

    // Remove temporary local files
    removeLocalFile(filePath);
    removeLocalFile(compressedPath);

    // Create brand
    const brand = await Brand.create({
      name: name.trim(),
      description: description?.trim() || "",
      logo: upload.secure_url,
      logoPublicId: upload.public_id,
      isActive: true,
    });

    return response(
      res,
      201,
      "Brand created successfully",
      brand
    );
  } catch (error) {
    console.error("Create brand error:", error);

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

export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    return response(res, 200, "Brands fetched successfully", brands);
  } catch (err) {
    console.error(err);
    return response(res, 500, "Internal Server Error");
  }
};

// Get brand by ID
export const getBrandById = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return response(res, 404, "Brand not found");
    }

    return response(res, 200, "Brand fetched successfully", brand);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

export const deleteFileFromCloudinary = async (
  publicId: string
) => {
  console.log(
    "Deleting Cloudinary public ID:",
    publicId
  );

  const result = await cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: "image",
      type: "upload",
      invalidate: true,
    }
  );

  console.log(
    "Cloudinary destroy result:",
    result
  );

  return result;
};
// Update brand


export const updateBrand = async (
  req: Request,
  res: Response
) => {
  let filePath: string | undefined;
  let compressedPath: string | undefined;

  try {
    const { name, description, isActive } = req.body;

    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return response(res, 404, "Brand not found");
    }

    // Keep old logo public ID
    const oldLogoPublicId = brand.logoPublicId;

    // Update name
    if (name?.trim()) {
      brand.name = name.trim();
    }

    // Update description
    if (description !== undefined) {
      brand.description = description.trim();
    }

    // Update status
    if (isActive !== undefined) {
      brand.isActive =
        isActive === true ||
        isActive === "true";
    }

    // Handle logo upload
    if (req.file) {
      console.log("req.file:", req.file);

      filePath = req.file.path;

      // Compress logo
      compressedPath = `${filePath}-compressed.webp`;

      await sharp(filePath)
        .webp({ quality: 60 })
        .toFile(compressedPath);

      // Upload NEW logo to Cloudinary
      const upload = await uploadFileToCloudinary({
        ...req.file,
        path: compressedPath,
      });

      // Save NEW logo information
      brand.logo = upload.secure_url;
      brand.logoPublicId = upload.public_id;
    }

    // Save MongoDB first
    const updatedBrand = await brand.save();

    // Delete OLD logo only after DB update succeeds
    if (
      req.file &&
      oldLogoPublicId &&
      oldLogoPublicId !== brand.logoPublicId
    ) {
      try {
        await deleteFileFromCloudinary(
          oldLogoPublicId
        );
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete old Cloudinary logo:",
          cloudinaryError
        );
      }
    }

    // Remove temporary files
    if (filePath) {
      removeLocalFile(filePath);
      filePath = undefined;
    }

    if (compressedPath) {
      removeLocalFile(compressedPath);
      compressedPath = undefined;
    }

    return response(
      res,
      200,
      "Brand updated successfully",
      updatedBrand
    );
  } catch (error) {
    console.error("Update brand error:", error);

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

// export const updateBrand = async (req: Request, res: Response) => {
//   try {
//     const { name, description, logo } = req.body;

//     const brand = await Brand.findById(req.params.id);
//     if (!brand) {
//       return response(res, 404, "Brand not found");
//     }

//     if (name) brand.name = name;
//     if (description) brand.description = description;
//     if (logo) brand.logo = logo;

//     const updatedBrand = await brand.save();

//     return response(res, 200, "Brand updated successfully", updatedBrand);
//   } catch (error) {
//     console.error(error);
//     return response(res, 500, "Internal Server Error");
//   }
// };

// Delete brand
export const deleteBrand = async (
  req: Request,
  res: Response
) => {
  
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return response(
        res,
        404,
        "Brand not found"
      );
    }

    // Keep the Cloudinary public ID before deleting MongoDB document
    const logoPublicId = brand.logoPublicId;

    // Delete brand from MongoDB
    await Brand.findByIdAndDelete(req.params.id);

    // Delete logo from Cloudinary
    if (logoPublicId) {
      try {
        await deleteFileFromCloudinary(
          logoPublicId
        );
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete brand logo from Cloudinary:",
          cloudinaryError
        );
      }
    }

    return response(
      res,
      200,
      "Brand deleted successfully"
    );
  } catch (error) {
    console.error(
      "Delete brand error:",
      error
    );

    return response(
      res,
      500,
      "Internal Server Error"
    );
  }
};