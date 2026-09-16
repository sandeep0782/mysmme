import fs from "fs";
import * as XLSX from "xlsx";
import { Types } from "mongoose";

import ProductImport from "../../models/ProductImport";
import Product from "../../models/Product";
import Brand from "../../models/Brands";
import Category from "../../models/Category";
import Color from "../../models/Color";
import Season from "../../models/Season";
import { generateStyleId } from "./styleIdService";

export interface ProductImportResult {
  totalRows: number;
  processedRows: number;
  successRows: number;
  failedRows: number;
}

type ExcelRow = Record<string, unknown>;

const SHEET_NAME = "Saree-Fill-This";

// ============================================================
// VALUE HELPERS
// ============================================================

function text(value: unknown): string {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function hasValue(value: unknown): boolean {
  return text(value) !== "";
}

function isEmptyRow(row: ExcelRow): boolean {
  return !Object.values(row).some(hasValue);
}

function requiredText(row: ExcelRow, field: string): string {
  const value = text(row[field]);

  if (!value) {
    throw new Error(`${field} is required`);
  }

  return value;
}

function requiredNumber(row: ExcelRow, field: string): number {
  const raw = text(row[field]);

  if (!raw) {
    throw new Error(`${field} is required`);
  }

  const value = Number(raw);

  if (!Number.isFinite(value)) {
    throw new Error(`${field} must be a valid number`);
  }

  return value;
}

function optionalNumber(value: unknown): number | undefined {
  if (!hasValue(value)) return undefined;

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid numeric value: ${text(value)}`);
  }

  return parsed;
}

function parseTags(value: unknown): string[] {
  if (!hasValue(value)) return [];

  return text(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseImages(row: ExcelRow): string[] {
  return ["image1", "image2", "image3", "image4", "image5"]
    .map((field) => text(row[field]))
    .filter(Boolean);
}

// ============================================================
// LOOKUP HELPERS
// ============================================================

async function resolveBrand(name: string) {
  const item = await Brand.findOne({
    name: { $regex: `^${escapeRegex(name)}$`, $options: "i" },
    isActive: { $ne: false },
  }).select("_id");

  if (!item) {
    throw new Error(`Brand "${name}" was not found or is inactive`);
  }

  return item._id;
}

async function resolveCategory(name: string) {
  const item = await Category.findOne({
    name: { $regex: `^${escapeRegex(name)}$`, $options: "i" },
    isActive: { $ne: false },
  }).select("_id");

  if (!item) {
    throw new Error(`Category "${name}" was not found or is inactive`);
  }

  return item._id;
}

async function resolveColor(name: string) {
  const item = await Color.findOne({
    name: { $regex: `^${escapeRegex(name)}$`, $options: "i" },
    isActive: { $ne: false },
  }).select("_id");

  if (!item) {
    throw new Error(`Color "${name}" was not found or is inactive`);
  }

  return item._id;
}

async function resolveSeason(name: string) {
  const item = await Season.findOne({
    name: { $regex: `^${escapeRegex(name)}$`, $options: "i" },
    isActive: { $ne: false },
  }).select("_id");

  if (!item) {
    throw new Error(`Season "${name}" was not found or is inactive`);
  }

  return item._id;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ============================================================
// PROCESS IMPORT
// ============================================================

export async function processProductImport(
  importId: string | Types.ObjectId,
): Promise<ProductImportResult> {
  const productImport = await ProductImport.findById(importId);

  if (!productImport) {
    throw new Error(`Product import not found: ${importId}`);
  }

  // ------------------------------------------------------------
  // READ FILE
  // ------------------------------------------------------------

  await ProductImport.findByIdAndUpdate(productImport._id, {
    $set: {
      processingStage: "reading_file",
      processingRow: 0,
      processingSku: "",
      processingProductName: "",
      failureReason: null,
    },
  });

  const filePath = productImport.fileUrl;

  if (!filePath) {
    throw new Error("Uploaded Excel file path is missing");
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`Uploaded Excel file not found: ${filePath}`);
  }

  let workbook: XLSX.WorkBook;

  try {
    workbook = XLSX.readFile(filePath);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Excel read error";

    throw new Error(`Unable to read Excel file: ${message}`);
  }

  const worksheet = workbook.Sheets[SHEET_NAME];

  if (!worksheet) {
    throw new Error(
      `Required worksheet "${SHEET_NAME}" was not found`,
    );
  }

  const rawRows = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, {
    defval: "",
    raw: false,
  });

  const rows = rawRows.filter((row) => !isEmptyRow(row));

  if (rows.length === 0) {
    throw new Error(`Worksheet "${SHEET_NAME}" contains no product rows`);
  }

  // ------------------------------------------------------------
  // INITIALIZE COUNTERS
  // ------------------------------------------------------------

  await ProductImport.findByIdAndUpdate(productImport._id, {
    $set: {
      totalRows: rows.length,
      processedRows: 0,
      successRows: 0,
      failedRows: 0,
      importErrors: [],
      processingStage: "processing_rows",
      processingRow: 0,
    },
  });

  let processedRows = 0;
  let successRows = 0;
  let failedRows = 0;

  // ============================================================
  // PROCESS ROWS
  // ============================================================

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];

    // Excel row 1 is the header.
    const excelRowNumber = index + 2;

    const currentSku = text(row.skuId);
    const currentTitle = text(row.title);

    await ProductImport.findByIdAndUpdate(productImport._id, {
      $set: {
        processingStage: "processing_rows",
        processingRow: excelRowNumber,
        processingSku: currentSku,
        processingProductName: currentTitle,
      },
    });

    try {
      // ----------------------------------------------------------
      // REQUIRED TEXT
      // ----------------------------------------------------------

      const title = requiredText(row, "title");
      const description = requiredText(row, "description");

      const brandName = requiredText(row, "brand");
      const categoryName = requiredText(row, "category");
      const colorName = requiredText(row, "color");
      const seasonName = requiredText(row, "season");

      const gender = requiredText(row, "gender");

      if (gender !== "Womens" && gender !== "Unisex") {
        throw new Error(`gender must be "Womens" or "Unisex"`);
      }

      // ----------------------------------------------------------
      // NUMBERS
      // ----------------------------------------------------------

      const price = requiredNumber(row, "price");
      const finalPrice = requiredNumber(row, "finalPrice");
      const mrp = requiredNumber(row, "mrp");

      const inventory = requiredNumber(row, "inventory");
      const netQuantity = requiredNumber(row, "netQuantity");

      if (price <= 0) {
        throw new Error("Price must be greater than 0");
      }

      if (finalPrice < 0) {
        throw new Error("Final price must be 0 or greater");
      }

      if (mrp < 0) {
        throw new Error("MRP must be 0 or greater");
      }

      if (finalPrice > price) {
        throw new Error("Final price cannot be greater than price");
      }

      if (price > mrp) {
        throw new Error("MRP must be greater than or equal to price");
      }

      if (inventory < 0) {
        throw new Error("Inventory cannot be negative");
      }

      if (netQuantity < 1) {
        throw new Error("Net quantity must be at least 1");
      }

      const gstPercentage = optionalNumber(row.gstPercentage);

      if (
        gstPercentage !== undefined &&
        (gstPercentage < 0 || gstPercentage > 100)
      ) {
        throw new Error("GST percentage must be between 0 and 100");
      }

      // ----------------------------------------------------------
      // IMAGES
      // ----------------------------------------------------------

      const images = parseImages(row);

      if (images.length === 0) {
        throw new Error("At least image1 is required");
      }

      // ----------------------------------------------------------
      // RESOLVE SYSTEM VALUES
      // ----------------------------------------------------------

      const [brand, category, color, season] = await Promise.all([
        resolveBrand(brandName),
        resolveCategory(categoryName),
        resolveColor(colorName),
        resolveSeason(seasonName),
      ]);

      // ----------------------------------------------------------
      // FIND EXISTING PRODUCT BY SKU
      // ----------------------------------------------------------

      let product = currentSku
        ? await Product.findOne({ skuId: currentSku })
        : null;

      const isExistingProduct = Boolean(product);

      // ----------------------------------------------------------
      // STYLE ID
      // ----------------------------------------------------------

      let styleId: number;

      if (hasValue(row.styleId)) {
        styleId = Number(row.styleId);

        if (!Number.isInteger(styleId) || styleId < 1) {
          throw new Error("styleId must be a positive integer");
        }
      } else if (product?.styleId) {
        // Preserve styleId when updating an existing SKU.
        styleId = product.styleId;
      } else {
        // Generate styleId only for a new product.
        styleId = await generateStyleId();
      }

      // ----------------------------------------------------------
      // CREATE OR UPDATE PRODUCT
      // ----------------------------------------------------------

      if (!product) {
        product = new Product();
      }

      product.set({
        title,
        description,

        brand,
        category,
        color,
        season,

        gender,
        collectionName: text(row.collectionName) || undefined,

        price,
        finalPrice,
        mrp,

        gstPercentage,
        hsnId: text(row.hsnId) || undefined,
        netWeight: optionalNumber(row.netWeight),
        netQuantity,
        countryOfOrigin: text(row.countryOfOrigin) || "India",
        genericName: text(row.genericName) || undefined,

        inventory,
        reservedInventory: isExistingProduct ? product.reservedInventory : 0,

        manufacturerName: text(row.manufacturerName) || undefined,
        manufacturerAddress: text(row.manufacturerAddress) || undefined,
        manufacturerPincode: text(row.manufacturerPincode) || undefined,

        packerName: text(row.packerName) || undefined,
        packerAddress: text(row.packerAddress) || undefined,
        packerPincode: text(row.packerPincode) || undefined,

        importerName: text(row.importerName) || undefined,
        importerAddress: text(row.importerAddress) || undefined,
        importerPincode: text(row.importerPincode) || undefined,

        blouse: text(row.blouse) || undefined,
        blouseColor: text(row.blouseColor) || undefined,
        blouseFabric: text(row.blouseFabric) || undefined,
        blousePattern: text(row.blousePattern) || undefined,
        blouseLengthSize: optionalNumber(row.blouseLengthSize),

        border: text(row.border) || undefined,
        borderWidth: text(row.borderWidth) || undefined,

        colorRemarks: text(row.colorRemarks) || undefined,

        printOrPatternType: text(row.printOrPatternType) || undefined,
        pattern: text(row.pattern) || undefined,

        sareeFabric: text(row.sareeFabric) || undefined,
        sareeLengthSize: optionalNumber(row.sareeLengthSize),

        transparency: text(row.transparency) || undefined,
        type: text(row.type) || undefined,

        loomType: text(row.loomType) || undefined,
        occasion: text(row.occasion) || undefined,
        ornamentation: text(row.ornamentation) || undefined,
        palluDetails: text(row.palluDetails) || undefined,

        productId: text(row.productId) || undefined,
        styleId,
        skuId: currentSku || undefined,
        groupId: text(row.groupId) || undefined,

        images,
        videos: isExistingProduct ? product.videos : [],

        tags: parseTags(row.tags),

        isActive: isExistingProduct ? product.isActive : true,
        publishStatus: isExistingProduct ? product.publishStatus : "draft",

        rejectionReason: text(row.rejectionReason) || undefined,

        rating: isExistingProduct ? product.rating : 0,
        numReviews: isExistingProduct ? product.numReviews : 0,

        seller: productImport.uploadedBy,
      });

      // Preserve the existing slug when updating.
      // New products will generate their slug in Product pre-validation.
      await product.save();

      console.log(
        `[ProductImport] Row ${excelRowNumber} ${
          isExistingProduct ? "updated" : "created"
        }: ${currentSku}`,
      );

      successRows += 1;
    } catch (error) {
      failedRows += 1;

      const message =
        error instanceof Error ? error.message : "Unknown row import error";

      console.error(
        `[ProductImport] Row ${excelRowNumber} failed: ${message}`,
      );

      await ProductImport.findByIdAndUpdate(productImport._id, {
        $push: {
          importErrors: {
            rowNumber: excelRowNumber,
            sku: currentSku,
            productName: currentTitle,
            error: message,
          },
        },
      });
    }

    processedRows += 1;

    await ProductImport.findByIdAndUpdate(productImport._id, {
      $set: {
        processedRows,
        successRows,
        failedRows,
      },
    });
  }

  // ============================================================
  // FINALIZE
  // ============================================================

  const finalStatus =
    failedRows === 0 ? "completed" : "completed_with_errors";

  await ProductImport.findByIdAndUpdate(productImport._id, {
    $set: {
      status: finalStatus,
      processingStage: "completed",
      processedRows,
      successRows,
      failedRows,
      processingRow: 0,
      processingSku: "",
      processingProductName: "",
      completedAt: new Date(),
      failureReason: null,
    },
  });

  console.log(
    `[ProductImport] ${productImport._id} completed: ${successRows} successful, ${failedRows} failed`,
  );

  return {
    totalRows: rows.length,
    processedRows,
    successRows,
    failedRows,
  };
}
