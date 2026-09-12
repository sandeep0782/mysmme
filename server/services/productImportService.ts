import fs from "fs/promises";
import * as XLSX from "xlsx";

import Product from "../models/Product";
import ProductImport, { IProductImport } from "../models/ProductImport";

import Brand from "../models/Brands";
import Category from "../models/Category";
import Color from "../models/Color";
import Season from "../models/Season";

import { uploadImageUrlToCloudinary } from "../config/cloudnaryConfig";
import { Types } from "mongoose";

import ImageFingerprint from "../models/ImageFingerprint";

type ExcelProductRow = Record<string, unknown>;

// ============================================================
// TYPES
// ============================================================
type UploadedImage = {
  url: string;
  hash: string;
};

type ImageCache = Map<string, UploadedImage>;

// ============================================================
// HELPERS
// ============================================================

const getString = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
};

const getNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : undefined;
};

// ============================================================
// GET IMAGES FROM EXCEL
// ============================================================
const isValidImageUrl = (value: string): boolean => {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const getImages = (row: ExcelProductRow): string[] => {
  return [
    getString(row.image1),
    getString(row.image2),
    getString(row.image3),
    getString(row.image4),
    getString(row.image5),
  ]
    .filter(Boolean)
    .filter(isValidImageUrl);
};

// ============================================================
// TAGS
// ============================================================

const getTags = (value: unknown): string[] => {
  const valueString = getString(value);

  if (!valueString) {
    return [];
  }

  return valueString
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

// ============================================================
// ESCAPE REGEX
// ============================================================

const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ============================================================
// FIND BRAND
// ============================================================

const findBrand = async (value: string) => {
  if (!value) {
    throw new Error("Brand is required");
  }

  const brand = await Brand.findOne({
    name: {
      $regex: `^${escapeRegex(value)}$`,
      $options: "i",
    },
  });

  if (!brand) {
    throw new Error(`Brand not found: ${value}`);
  }

  return brand;
};

// ============================================================
// FIND CATEGORY
// ============================================================

const findCategory = async (value: string) => {
  if (!value) {
    throw new Error("Category is required");
  }

  const category = await Category.findOne({
    name: {
      $regex: `^${escapeRegex(value)}$`,
      $options: "i",
    },
  });

  if (!category) {
    throw new Error(`Category not found: ${value}`);
  }

  return category;
};

// ============================================================
// FIND COLOR
// ============================================================

const findColor = async (value: string) => {
  if (!value) {
    throw new Error("Color is required");
  }

  const color = await Color.findOne({
    name: {
      $regex: `^${escapeRegex(value)}$`,
      $options: "i",
    },
  });

  if (!color) {
    throw new Error(`Color not found: ${value}`);
  }

  return color;
};

// ============================================================
// FIND SEASON
// ============================================================

const findSeason = async (value: string) => {
  if (!value) {
    throw new Error("Season is required");
  }

  const season = await Season.findOne({
    name: {
      $regex: `^${escapeRegex(value)}$`,
      $options: "i",
    },
  });

  if (!season) {
    throw new Error(`Season not found: ${value}`);
  }

  return season;
};

// ============================================================
// UPLOAD PRODUCT IMAGES
// ============================================================

const uploadProductImages = async (
  imageUrls: string[],
  imageCache: ImageCache,
): Promise<UploadedImage[]> => {
  if (imageUrls.length === 0) {
    throw new Error("At least one image is required");
  }

  const uploadedImages: UploadedImage[] = [];

  for (const imageUrl of imageUrls) {
    // ========================================================
    // CHECK IMPORT CACHE
    // ========================================================

    const cachedImage = imageCache.get(imageUrl);

    if (cachedImage) {
      console.log(`Using cached Cloudinary image: ${cachedImage.url}`);

      uploadedImages.push(cachedImage);
      continue;
    }

    try {
      console.log(`Uploading product image to Cloudinary: ${imageUrl}`);

      // ======================================================
      // TRANSFORM + NSFW CHECK + HASH + CLOUDINARY UPLOAD
      // ======================================================

      const uploaded = await uploadImageUrlToCloudinary(
        imageUrl,
        "products/import",
      );

      const existingImage = await ImageFingerprint.findOne({
        hash: uploaded.hash,
      }).lean();

      if (existingImage) {
        throw new Error(
          `Duplicate image detected. This image is already used by another product.`,
        );
      }

      imageCache.set(imageUrl, uploaded);

      uploadedImages.push(uploaded);

      console.log(`Cloudinary image saved: ${uploaded.url}`);
    } catch (error) {
      throw new Error(
        `Failed to process image "${imageUrl}": ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  return uploadedImages;
};

// ============================================================
// IMPORT SINGLE PRODUCT ROW
// ============================================================

const importProductRow = async (
  row: ExcelProductRow,
  imageCache: ImageCache,
  sellerId: Types.ObjectId,
): Promise<void> => {
  // ==========================================================
  // BASIC VALUES
  // ==========================================================

  const productId = getString(row.productId);
  const skuId = getString(row.skuId);
  const groupId = getString(row.groupId);

  const title = getString(row.title);
  const description = getString(row.description);

  if (!title) {
    throw new Error("Title is required");
  }

  if (!description) {
    throw new Error("Description is required");
  }

  // ==========================================================
  // RELATED MODELS
  // ==========================================================

  const brand = await findBrand(getString(row.brand));

  const category = await findCategory(getString(row.category));

  const color = await findColor(getString(row.color));

  const season = await findSeason(getString(row.season));

  // ==========================================================
  // EXCEL IMAGE URLs
  // ==========================================================

  const imageUrls = getImages(row);

  if (imageUrls.length === 0) {
    throw new Error(`At least one image is required for "${title}"`);
  }

  console.log(`Product "${title}" has ${imageUrls.length} images`);

  // ==========================================================
  // DOWNLOAD + UPLOAD TO CLOUDINARY
  // ==========================================================

  const uploadedImages = await uploadProductImages(imageUrls, imageCache);

  const images = uploadedImages.map((image) => image.url);

  const imageHashes = uploadedImages.map((image) => image.hash);
  // ==========================================================
  // PRODUCT DATA
  // ==========================================================

  const productData = {
    productId: productId || undefined,

    skuId: skuId || undefined,

    groupId: groupId || undefined,

    title,

    description,

    brand: brand._id,

    category: category._id,

    color: color._id,

    season: season._id,

    gender: getString(row.gender) === "Unisex" ? "Unisex" : "Womens",

    collectionName: getString(row.collectionName) || undefined,

    // ========================================================
    // PRICING
    // ========================================================

    price: getNumber(row.price) ?? 0,

    finalPrice: getNumber(row.finalPrice) ?? 0,

    mrp: getNumber(row.mrp) ?? 0,

    // ========================================================
    // TAX / PRODUCT INFORMATION
    // ========================================================

    gstPercentage: getNumber(row.gstPercentage),

    hsnId: getString(row.hsnId) || undefined,

    netWeight: getNumber(row.netWeight),

    netQuantity: getNumber(row.netQuantity) ?? 1,

    countryOfOrigin: getString(row.countryOfOrigin) || "India",

    genericName: getString(row.genericName) || undefined,

    // ========================================================
    // INVENTORY
    // ========================================================

    inventory: getNumber(row.inventory) ?? 0,

    // ========================================================
    // MANUFACTURER
    // ========================================================

    manufacturerName: getString(row.manufacturerName) || undefined,

    manufacturerAddress: getString(row.manufacturerAddress) || undefined,

    manufacturerPincode: getString(row.manufacturerPincode) || undefined,

    // ========================================================
    // PACKER
    // ========================================================

    packerName: getString(row.packerName) || undefined,

    packerAddress: getString(row.packerAddress) || undefined,

    packerPincode: getString(row.packerPincode) || undefined,

    // ========================================================
    // IMPORTER
    // ========================================================

    importerName: getString(row.importerName) || undefined,

    importerAddress: getString(row.importerAddress) || undefined,

    importerPincode: getString(row.importerPincode) || undefined,

    // ========================================================
    // SAREE DETAILS
    // ========================================================

    blouse: getString(row.blouse) || undefined,

    blouseColor: getString(row.blouseColor) || undefined,

    blouseFabric: getString(row.blouseFabric) || undefined,

    blousePattern: getString(row.blousePattern) || undefined,

    blouseLengthSize: getNumber(row.blouseLengthSize),

    border: getString(row.border) || undefined,

    borderWidth: getNumber(row.borderWidth),

    colorRemarks: getString(row.colorRemarks) || undefined,

    printOrPatternType: getString(row.printOrPatternType) || undefined,

    pattern: getString(row.pattern) || undefined,

    sareeFabric: getString(row.sareeFabric) || undefined,

    sareeLengthSize: getNumber(row.sareeLengthSize),

    transparency: getString(row.transparency) || undefined,

    type: getString(row.type) || undefined,

    loomType: getString(row.loomType) || undefined,

    occasion: getString(row.occasion) || undefined,

    ornamentation: getString(row.ornamentation) || undefined,

    palluDetails: getString(row.palluDetails) || undefined,

    // ========================================================
    // MEDIA
    // ========================================================

    // IMPORTANT:
    // These are now Cloudinary URLs.
    // The original Meesho URLs are NOT stored.
    images,

    videos: [],

    // ========================================================
    // TAGS
    // ========================================================

    tags: getTags(row.tags),

    // ========================================================
    // STATUS
    // ========================================================

    isActive: true,

    publishStatus: "draft",

    rejectionReason: getString(row.rejectionReason) || undefined,

    // ========================================================
    // REVIEWS
    // ========================================================

    rating: 0,

    numReviews: 0,

    // ========================================================
    // SELLER
    // ========================================================

    seller: sellerId,
  };

  // ==========================================================
  // CREATE PRODUCT
  // ==========================================================

  try {
    const createdProduct = await Product.create(productData);

    await ImageFingerprint.insertMany(
      imageHashes.map((hash, index) => ({
        hash,
        product: createdProduct._id,
        imageUrl: images[index],
      })),
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];

      const duplicateValue = error.keyValue?.[duplicateField];

      throw new Error(
        `Duplicate product: ${duplicateField} "${duplicateValue}" already exists.`,
      );
    }

    throw error;
  }
};

// ============================================================
// PROCESS PRODUCT IMPORT
// ============================================================

export const processProductImport = async (
  productImportId: string,
): Promise<void> => {
  const productImport = await ProductImport.findById(productImportId);

  if (!productImport) {
    throw new Error("Product import has no uploadedBy user");
  }
  const sellerId = productImport.uploadedBy;

  // ==========================================================
  // SET PROCESSING
  // ==========================================================

  await ProductImport.findByIdAndUpdate(productImportId, {
    completedAt: undefined,
    processedRows: 0,
    successRows: 0,
    failedRows: 0,
    importErrors: [],
  });

  try {
    // ========================================================
    // READ EXCEL
    // ========================================================

    const fileBuffer = await fs.readFile(productImport.fileUrl);

    const workbook = XLSX.read(fileBuffer, {
      type: "buffer",
    });

    const sheetName = "Saree-Fill-This";

    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      throw new Error(`Worksheet "${sheetName}" not found in Excel file`);
    }

    const rows = XLSX.utils.sheet_to_json<ExcelProductRow>(worksheet, {
      defval: "",
    });

    await ProductImport.findByIdAndUpdate(productImportId, {
      totalRows: rows.length,
    });

    let successRows = 0;

    let failedRows = 0;

    // ========================================================
    // ERROR STORAGE
    // ========================================================

    const importErrors: IProductImport["importErrors"] = [];

    // ========================================================
    // IMAGE CACHE
    //
    // If the same image URL appears in multiple products,
    // we upload it only once.
    // ========================================================

    const imageCache: ImageCache = new Map();

    // ========================================================
    // PROCESS ROWS
    // ========================================================

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      const rowNumber = index + 2;

      try {
        console.log(`SKU: ${getString(row.skuId)}`);

        // ----------------------------------------------------
        // IMPORT PRODUCT
        // ----------------------------------------------------

        await importProductRow(row, imageCache, sellerId);

        successRows++;

        console.log(`Successfully imported row ${rowNumber}`);
      } catch (error: unknown) {
        failedRows++;

        // ----------------------------------------------------
        // ERROR MESSAGE
        // ----------------------------------------------------

        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";

        const sku = getString(row.skuId);

        const productName = getString(row.title);

        // ----------------------------------------------------
        // SAVE ERROR
        // ----------------------------------------------------

        importErrors.push({
          rowNumber,

          sku,

          productName,

          error: errorMessage,
        });

        console.error(`Failed to import row ${rowNumber}: ${errorMessage}`);
      }

      // ======================================================
      // UPDATE PROGRESS
      // ======================================================

      await ProductImport.findByIdAndUpdate(productImportId, {
        processedRows: successRows + failedRows,

        successRows,

        failedRows,

        importErrors,
      });

      console.log(`Progress: ${successRows + failedRows}/${rows.length}`);
    }

    // ========================================================
    // FINAL STATUS
    // ========================================================

    let status: "completed" | "completed_with_errors" | "failed";

    if (failedRows === 0) {
      status = "completed";
    } else if (successRows > 0) {
      status = "completed_with_errors";
    } else {
      status = "failed";
    }

    // ========================================================
    // FINAL DATABASE UPDATE
    // ========================================================

    await ProductImport.findByIdAndUpdate(productImportId, {
      status,

      completedAt: new Date(),

      processedRows: successRows + failedRows,

      successRows,

      failedRows,

      importErrors,
    });
  } catch (error) {
    console.error("Product import failed:", error);

    throw error;
  }
};
