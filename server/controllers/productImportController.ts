import { Request, Response } from "express";

import ProductImport from "../models/ProductImport";
import fs from "fs/promises";
import path from "path";
import { Types } from "mongoose";

import { response } from "../utils/responseHandler";

export const getProductImports = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { status, search } = req.query;
    const filter: Record<string, unknown> = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search && typeof search === "string" && search.trim()) {
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
    return response(res, 200, "Product imports fetched successfully", imports);
  } catch (error) {
    console.error("Failed to fetch product imports:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product imports",
    });
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
    // ============================================================
    // FILE VALIDATION
    // ============================================================

    if (!req.file) {
      return response(res, 400, "Excel file is required");
    }

    // ============================================================
    // USER
    // ============================================================

    /*
     * Change this according to your authentication middleware.
     *
     * For example:
     * req.user._id
     *
     * If your req.user is typed differently, we should update
     * the Express Request type instead of using `any`.
     */
    const uploadedBy = req.id;

    if (!uploadedBy) {
      return response(res, 401, "unauthorised");
    }

    // ============================================================
    // FILE TYPE VALIDATION
    // ============================================================

    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    const allowedExtensions = [".xlsx", ".xls"];

    const extension = req.file.originalname
      .substring(req.file.originalname.lastIndexOf("."))
      .toLowerCase();

    const isValidMimeType = allowedMimeTypes.includes(req.file.mimetype);
    const isValidExtension = allowedExtensions.includes(extension);

    if (!isValidMimeType || !isValidExtension) {
      res.status(400).json({
        success: false,
        message: "Only Excel files (.xlsx and .xls) are allowed",
      });

      return;
    }

    // ============================================================
    // IMPORT GROUP
    // ============================================================

    const importGroupId = new Types.ObjectId();

    // ============================================================
    // FILE URL
    // ============================================================

    /*
     * This assumes Multer is using local disk storage.
     *
     * If you're using Cloudinary/S3/etc., replace this with
     * the URL returned by your storage provider.
     */
    const fileUrl = req.file.path;

    // ============================================================
    // CREATE IMPORT
    // ============================================================

    const productImport = await ProductImport.create({
      importGroupId,

      fileName: req.file.originalname,

      fileUrl,

      fileSize: req.file.size,

      mimeType: req.file.mimetype,

      totalRows: 0,
      processedRows: 0,
      successRows: 0,
      failedRows: 0,

      status: "uploaded",

      uploadedBy,

      startedAt: undefined,
      completedAt: undefined,
    });

    // ============================================================
    // RESPONSE
    // ============================================================

    res.status(201).json({
      success: true,
      message: "Product Excel file uploaded successfully",
      data: productImport,
    });
  } catch (error) {
    console.error("Failed to upload product Excel:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload product Excel",
    });
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

    // ============================================================
    // VALIDATE ID
    // ============================================================

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid product import ID",
      });
      return;
    }

    // ============================================================
    // FIND IMPORT
    // ============================================================

    const productImport = await ProductImport.findById(id);

    if (!productImport) {
      res.status(404).json({
        success: false,
        message: "Product import not found",
      });
      return;
    }

    // ============================================================
    // DELETE DATABASE RECORD
    // ============================================================

    await ProductImport.findByIdAndDelete(id);

    // ============================================================
    // DELETE PHYSICAL FILE
    // ============================================================

    if (productImport.fileUrl) {
      try {
        const filePath = path.join(
          process.cwd(),
          productImport.fileUrl.replace(/^[/\\]+/, ""),
        );

        await fs.unlink(filePath);
      } catch (fileError: unknown) {
        console.warn(
          "Product import record deleted, but file could not be deleted:",
          fileError,
        );
      }
    }

    // ============================================================
    // DELETE ERROR FILE IF EXISTS
    // ============================================================

    if (productImport.errorFileUrl) {
      try {
        const errorFilePath = path.join(
          process.cwd(),
          productImport.errorFileUrl.replace(/^[/\\]+/, ""),
        );

        await fs.unlink(errorFilePath);
      } catch (fileError: unknown) {
        console.warn("Error file could not be deleted:", fileError);
      }
    }

    // ============================================================
    // RESPONSE
    // ============================================================

    res.status(200).json({
      success: true,
      message: "Product import deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete product import:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product import",
    });
  }
};

import * as XLSX from "xlsx";

export const downloadProductImportErrors = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    console.log("================================");
    console.log("DOWNLOAD ERROR FILE");
    console.log("ID:", id);
    console.log("================================");

    if (!id || typeof id !== "string" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid product import ID",
      });
      return;
    }

    const productImport = await ProductImport.findById(id).lean();

    console.log("PRODUCT IMPORT:", productImport);

    if (!productImport) {
      res.status(404).json({
        success: false,
        message: "Product import not found.",
      });
      return;
    }

    console.log("IMPORT ERRORS:", productImport.importErrors);

    if (!productImport.importErrors?.length) {
      res.status(404).json({
        success: false,
        message: "No import errors found.",
      });
      return;
    }

    const errors = productImport.importErrors.map((error: any) => ({
      "Excel Row": error.rowNumber ?? "",
      SKU: error.sku ?? "",
      "Product Name": error.productName ?? "",
      Error: error.error ?? error.message ?? "Unknown error",
    }));

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(errors);

    worksheet["!cols"] = [{ wch: 12 }, { wch: 25 }, { wch: 35 }, { wch: 80 }];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Import Errors");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    const baseName = productImport.fileName.replace(/\.(xlsx|xls)$/i, "");

    const fileName = `import-errors-${baseName}.xlsx`;

    console.log("GENERATED ERROR FILE:", fileName);
    console.log("ERROR COUNT:", errors.length);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    res.status(200).send(buffer);
  } catch (error) {
    console.error("Failed to generate import error file:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate error file.",
    });
  }
};
