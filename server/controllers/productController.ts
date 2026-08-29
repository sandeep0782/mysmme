import { Request, Response } from "express";
import Product from "../models/Product";
import { response } from "../utils/responseHandler";
import { uploadFileToCloudinary } from "../config/cloudnaryConfig";

// ============================================================
// CREATE PRODUCT
// ============================================================

export const createProduct = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.id;

    const {
      title,
      description,

      slug,

      brand,
      category,
      color,
      season,
      gender,
      collectionName,

      price,
      finalPrice,
      mrp,

      gstPercentage,
      hsnId,
      netWeight,
      netQuantity,
      countryOfOrigin,
      genericName,

      inventory,

      manufacturerName,
      manufacturerAddress,
      manufacturerPincode,

      packerName,
      packerAddress,
      packerPincode,

      importerName,
      importerAddress,
      importerPincode,

      blouse,
      blouseColor,
      blouseFabric,
      blousePattern,
      blouseLengthSize,

      border,
      borderWidth,

      colorRemarks,

      printOrPatternType,
      pattern,

      sareeFabric,
      sareeLengthSize,

      transparency,
      type,

      loomType,
      occasion,
      ornamentation,
      palluDetails,

      productId,
      styleId,
      skuId,
      groupId,

      tags,

      isActive,
      publishStatus,
      rejectionReason,
    } = req.body;

    // ============================================================
    // FILES
    // ============================================================

    const images = req.files as Express.Multer.File[];

    if (!images || images.length === 0) {
      return response(res, 400, "At least one product image is required");
    }

    // ============================================================
    // REQUIRED FIELDS
    // ============================================================

    if (!title?.trim()) {
      return response(res, 400, "Product title is required");
    }

    if (!description?.trim()) {
      return response(res, 400, "Product description is required");
    }

    if (!brand) {
      return response(res, 400, "Brand is required");
    }

    if (!category) {
      return response(res, 400, "Category is required");
    }

    if (!color) {
      return response(res, 400, "Color is required");
    }

    if (!season) {
      return response(res, 400, "Season is required");
    }

    // ============================================================
    // PARSE NUMBERS
    // ============================================================

    const numericPrice = Number(price);
    const numericFinalPrice = Number(finalPrice);
    const numericMrp = Number(mrp);

    const numericInventory = Number(inventory ?? 0);
    const numericNetQuantity = Number(netQuantity ?? 1);

    const numericGstPercentage =
      gstPercentage !== undefined && gstPercentage !== ""
        ? Number(gstPercentage)
        : undefined;

    const numericNetWeight =
      netWeight !== undefined && netWeight !== ""
        ? Number(netWeight)
        : undefined;

    const numericBlouseLengthSize =
      blouseLengthSize !== undefined && blouseLengthSize !== ""
        ? Number(blouseLengthSize)
        : undefined;

    const numericBorderWidth =
      borderWidth !== undefined && borderWidth !== ""
        ? Number(borderWidth)
        : undefined;

    const numericSareeLengthSize =
      sareeLengthSize !== undefined && sareeLengthSize !== ""
        ? Number(sareeLengthSize)
        : undefined;

    // ============================================================
    // PRICE VALIDATION
    // ============================================================

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return response(res, 400, "Price must be greater than 0");
    }

    if (!Number.isFinite(numericFinalPrice) || numericFinalPrice < 0) {
      return response(res, 400, "Final price must be 0 or greater");
    }

    if (!Number.isFinite(numericMrp) || numericMrp < 0) {
      return response(res, 400, "MRP must be 0 or greater");
    }

    if (numericFinalPrice > numericPrice) {
      return response(res, 400, "Final price cannot be greater than price");
    }

    if (numericPrice > numericMrp) {
      return response(res, 400, "MRP must be greater than or equal to price");
    }

    // ============================================================
    // INVENTORY VALIDATION
    // ============================================================

    if (!Number.isFinite(numericInventory) || numericInventory < 0) {
      return response(res, 400, "Inventory cannot be negative");
    }

    if (!Number.isFinite(numericNetQuantity) || numericNetQuantity < 1) {
      return response(res, 400, "Net quantity must be at least 1");
    }

    // ============================================================
    // UPLOAD IMAGES
    // ============================================================

    const uploadPromises = images.map((file) =>
      uploadFileToCloudinary(file as any),
    );

    const uploadedImages = await Promise.all(uploadPromises);

    const imageUrls = uploadedImages.map((image) => image.secure_url);

    if (!imageUrls.length) {
      return response(res, 400, "Failed to upload product images");
    }

    // ============================================================
    // PARSE TAGS
    // ============================================================

    let parsedTags: string[] = [];

    if (tags) {
      if (Array.isArray(tags)) {
        parsedTags = tags.map((tag) => String(tag).trim()).filter(Boolean);
      } else if (typeof tags === "string") {
        try {
          const jsonTags = JSON.parse(tags);

          if (Array.isArray(jsonTags)) {
            parsedTags = jsonTags
              .map((tag) => String(tag).trim())
              .filter(Boolean);
          } else {
            parsedTags = tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean);
          }
        } catch {
          parsedTags = tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
        }
      }
    }

    // ============================================================
    // CREATE PRODUCT
    // ============================================================

    const product = new Product({
      title: title.trim(),

      // Slug is automatically generated by Product schema
      ...(slug?.trim() ? { slug: slug.trim() } : {}),

      description: description.trim(),

      brand,
      category,
      color,
      season,

      gender: gender || "Womens",
      collectionName: collectionName?.trim(),

      // Pricing
      price: numericPrice,
      finalPrice: numericFinalPrice,
      mrp: numericMrp,

      // Tax / Product Information
      gstPercentage: numericGstPercentage,
      hsnId: hsnId?.trim(),
      netWeight: numericNetWeight,
      netQuantity: numericNetQuantity,
      countryOfOrigin: countryOfOrigin?.trim() || "India",
      genericName: genericName?.trim(),

      // Inventory
      inventory: numericInventory,

      // Manufacturer
      manufacturerName: manufacturerName?.trim(),
      manufacturerAddress: manufacturerAddress?.trim(),
      manufacturerPincode: manufacturerPincode?.trim(),

      // Packer
      packerName: packerName?.trim(),
      packerAddress: packerAddress?.trim(),
      packerPincode: packerPincode?.trim(),

      // Importer
      importerName: importerName?.trim(),
      importerAddress: importerAddress?.trim(),
      importerPincode: importerPincode?.trim(),

      // Saree Details
      blouse: blouse?.trim(),
      blouseColor: blouseColor?.trim(),
      blouseFabric: blouseFabric?.trim(),
      blousePattern: blousePattern?.trim(),
      blouseLengthSize: numericBlouseLengthSize,

      border: border?.trim(),
      borderWidth: numericBorderWidth,

      colorRemarks: colorRemarks?.trim(),

      printOrPatternType: printOrPatternType?.trim(),
      pattern: pattern?.trim(),

      sareeFabric: sareeFabric?.trim(),
      sareeLengthSize: numericSareeLengthSize,

      transparency: transparency?.trim(),
      type: type?.trim(),

      loomType: loomType?.trim(),
      occasion: occasion?.trim(),
      ornamentation: ornamentation?.trim(),
      palluDetails: palluDetails?.trim(),

      // Product Identification
      productId: productId?.trim(),
      styleId: styleId?.trim(),
      skuId: skuId?.trim(),
      groupId: groupId?.trim(),

      // Media
      images: imageUrls,
      videos: [],

      // Search
      tags: parsedTags,

      // Status
      isActive:
        isActive === undefined
          ? true
          : isActive === true || isActive === "true",

      publishStatus: publishStatus || "draft",

      rejectionReason: rejectionReason?.trim(),

      // Reviews
      rating: 0,
      numReviews: 0,

      // Seller
      seller: loggedInUser,
    });

    await product.save();

    return response(res, 201, "Product created successfully", product);
  } catch (error: unknown) {
    console.error("====================================");
    console.error("CREATE PRODUCT ERROR");
    console.error(error);
    console.error("====================================");

    const message =
      error instanceof Error ? error.message : "Error creating product";

    return response(res, 500, message);
  }
};

// ============================================================
// GET ALL PRODUCTS
// ============================================================

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("brand", "name slug")
      .populate("color", "name slug")
      .populate("category", "name slug")
      .populate("season", "name slug");

    return response(res, 200, "Products fetched successfully", products);
  } catch (error: unknown) {
    console.error("Error fetching products:", error);

    return response(res, 500, "Error fetching products");
  }
};

// ============================================================
// GET PRODUCT BY ID
// ============================================================

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand", "name slug")
      .populate("color", "name slug")
      .populate("category", "name slug")
      .populate("season", "name slug");

    if (!product) {
      return response(res, 404, "Product not found");
    }

    return response(res, 200, "Product fetched successfully", product);
  } catch (error: unknown) {
    console.error("Error fetching product:", error);

    return response(res, 500, "Error fetching product");
  }
};

// ============================================================
// GET PRODUCT BY SLUG
// ============================================================

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug })
      .populate("category", "name slug")
      .populate("brand", "name slug")
      .populate("season", "name slug")
      .populate("color", "name slug");

    if (!product) {
      return response(res, 404, "Product not found");
    }

    return response(res, 200, "Product fetched successfully", product);
  } catch (error: unknown) {
    console.error("Error fetching product by slug:", error);

    return response(res, 500, "Internal server error");
  }
};

// ============================================================
// DELETE PRODUCT
// ============================================================

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
      return response(res, 404, "Product not found");
    }

    return response(res, 200, "Product deleted successfully");
  } catch (error: unknown) {
    console.error("Error deleting product:", error);

    return response(res, 500, "Error deleting product");
  }
};

// ============================================================
// GET PRODUCTS BY SELLER
// ============================================================

export const getProductsBySeller = async (req: Request, res: Response) => {
  try {
    const sellerId = req.params.sellerId;

    if (!sellerId) {
      return response(res, 400, "Seller ID is required");
    }

    const products = await Product.find({
      seller: sellerId,
    })
      .sort({ createdAt: -1 })
      .populate("brand", "name slug")
      .populate("color", "name slug")
      .populate("category", "name slug")
      .populate("season", "name slug");

    if (products.length === 0) {
      return response(res, 200, "No products found for this seller", []);
    }

    return response(res, 200, "Products fetched successfully", products);
  } catch (error: unknown) {
    console.error("Error fetching seller products:", error);

    return response(res, 500, "Error fetching products");
  }
};

