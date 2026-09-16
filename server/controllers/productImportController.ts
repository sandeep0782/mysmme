import { Request, Response } from "express";
import * as XLSX from "xlsx";
import { Types } from "mongoose";

import ProductImport from "../models/ProductImport";
import { response } from "../utils/responseHandler";

// ================================================================
// GET PRODUCT IMPORTS
// ================================================================

export const getProductImports = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { status, search } = req.query;

    const filter: Record<string, unknown> = {};

    if (typeof status === "string" && status !== "all") {
      filter.status = status;
    }

    if (typeof search === "string" && search.trim()) {
      filter.fileName = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const imports = await ProductImport.find(filter)
      .populate({
        path: "uploadedBy",
        select: "_id name firstName lastName email",
      })
      .sort({ createdAt: -1 })
      .lean();

    response(res, 200, "Product imports fetched successfully", imports);

    return;
  } catch (error) {
    console.error("Failed to fetch product imports:", error);

    response(res, 500, "Failed to fetch product imports");

    return;
  }
};

// ================================================================
// UPLOAD PRODUCT EXCEL
// ================================================================

export const uploadProductExcel = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // ------------------------------------------------------------
    // FILE
    // ------------------------------------------------------------

    if (!req.file) {
      response(res, 400, "Excel file is required");
      return;
    }

    // ------------------------------------------------------------
    // USER
    // ------------------------------------------------------------

    const uploadedBy = req.id;

    if (!uploadedBy) {
      response(res, 401, "Unauthorized");
      return;
    }

    if (!Types.ObjectId.isValid(uploadedBy)) {
      response(res, 401, "Invalid user ID");
      return;
    }

    // ------------------------------------------------------------
    // FILE TYPE
    // ------------------------------------------------------------

    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    const allowedExtensions = [".xlsx", ".xls"];

    const originalName = req.file.originalname;

    const extension = originalName
      .substring(originalName.lastIndexOf("."))
      .toLowerCase();

    const validMimeType = allowedMimeTypes.includes(req.file.mimetype);

    const validExtension = allowedExtensions.includes(extension);

    if (!validMimeType || !validExtension) {
      response(res, 400, "Only Excel files (.xlsx and .xls) are allowed");

      return;
    }

    // ------------------------------------------------------------
    // FILE PATH
    // ------------------------------------------------------------

    const fileUrl = req.file.path;

    if (!fileUrl) {
      response(res, 400, "Uploaded file path is missing");
      return;
    }

    // ------------------------------------------------------------
    // CREATE IMPORT
    // ------------------------------------------------------------

    const productImport = await ProductImport.create({
      importGroupId: new Types.ObjectId(),

      fileName: originalName,

      fileUrl,

      fileSize: req.file.size,

      mimeType: req.file.mimetype,

      totalRows: 0,

      processedRows: 0,

      successRows: 0,

      failedRows: 0,

      importErrors: [],

      workerScope: process.env.PRODUCT_IMPORT_WORKER_SCOPE || "local",

      attempts: 0,

      status: "uploaded",

      processingStage: "waiting",

      processingRow: 0,

      processingSku: "",

      processingProductName: "",

      failureReason: null,

      uploadedBy: new Types.ObjectId(uploadedBy),
    });

    response(
      res,
      201,
      "Product Excel file uploaded successfully",
      productImport,
    );

    return;
  } catch (error) {
    console.error("Failed to upload product Excel:", error);

    response(res, 500, "Failed to upload product Excel");

    return;
  }
};

// ================================================================
// DELETE PRODUCT IMPORT
// ================================================================

export const deleteProductImport = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id;

    // req.params.id can be string | string[]
    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      response(res, 400, "Invalid product import ID");
      return;
    }

    const productImport = await ProductImport.findById(id);

    if (!productImport) {
      response(res, 404, "Product import not found");
      return;
    }

    await ProductImport.findByIdAndDelete(id);

    response(res, 200, "Product import deleted successfully");

    return;
  } catch (error) {
    console.error("Failed to delete product import:", error);

    response(res, 500, "Failed to delete product import");

    return;
  }
};

// ================================================================
// DOWNLOAD PRODUCT IMPORT ERRORS
// ================================================================

export const downloadProductImportErrors = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id;

    // req.params.id can be string | string[]
    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      response(res, 400, "Invalid product import ID");
      return;
    }

    const productImport = await ProductImport.findById(id).lean();

    if (!productImport) {
      response(res, 404, "Product import not found");
      return;
    }

    if (
      !productImport.importErrors ||
      productImport.importErrors.length === 0
    ) {
      response(res, 404, "No import errors found");
      return;
    }

    // ------------------------------------------------------------
    // ERROR ROWS
    // ------------------------------------------------------------

    const errors = productImport.importErrors.map((error: any) => ({
      "Excel Row": error.rowNumber ?? "",
      SKU: error.sku ?? "",
      "Product Name": error.productName ?? "",
      Error: error.error ?? "Unknown error",
    }));

    // ------------------------------------------------------------
    // EXCEL
    // ------------------------------------------------------------

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(errors);

    worksheet["!cols"] = [{ wch: 12 }, { wch: 25 }, { wch: 35 }, { wch: 80 }];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Import Errors");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // ------------------------------------------------------------
    // FILE NAME
    // ------------------------------------------------------------

    const baseName = productImport.fileName.replace(/\.(xlsx|xls)$/i, "");

    const fileName = `import-errors-${baseName}.xlsx`;

    // ------------------------------------------------------------
    // RESPONSE
    // ------------------------------------------------------------

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    res.status(200).send(buffer);

    return;
  } catch (error) {
    console.error("Failed to generate import error file:", error);

    response(res, 500, "Failed to generate error file");

    return;
  }
};
