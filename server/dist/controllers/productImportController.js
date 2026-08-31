"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadProductImportErrors = exports.deleteProductImport = exports.uploadProductExcel = exports.getProductImports = void 0;
const ProductImport_1 = __importDefault(require("../models/ProductImport"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = require("mongoose");
const responseHandler_1 = require("../utils/responseHandler");
const getProductImports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, search } = req.query;
        const filter = {};
        if (status && status !== "all") {
            filter.status = status;
        }
        if (search && typeof search === "string" && search.trim()) {
            filter.fileName = {
                $regex: search.trim(),
                $options: "i",
            };
        }
        const imports = yield ProductImport_1.default.find(filter)
            .populate({
            path: "uploadedBy",
            select: "_id name firstName lastName email",
        })
            .sort({ createdAt: -1 })
            .lean();
        return (0, responseHandler_1.response)(res, 200, "Product imports fetched successfully", imports);
    }
    catch (error) {
        console.error("Failed to fetch product imports:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch product imports",
        });
    }
});
exports.getProductImports = getProductImports;
// ================================================================
// UPLOAD PRODUCT EXCEL
// ================================================================
const uploadProductExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ============================================================
        // FILE VALIDATION
        // ============================================================
        if (!req.file) {
            return (0, responseHandler_1.response)(res, 400, "Excel file is required");
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
            return (0, responseHandler_1.response)(res, 401, "unauthorised");
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
        const importGroupId = new mongoose_1.Types.ObjectId();
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
        const productImport = yield ProductImport_1.default.create({
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
    }
    catch (error) {
        console.error("Failed to upload product Excel:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload product Excel",
        });
    }
});
exports.uploadProductExcel = uploadProductExcel;
// ================================================================
// DELETE PRODUCT IMPORT
// ================================================================
const deleteProductImport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // ============================================================
        // VALIDATE ID
        // ============================================================
        if (typeof id !== "string" || !mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid product import ID",
            });
            return;
        }
        // ============================================================
        // FIND IMPORT
        // ============================================================
        const productImport = yield ProductImport_1.default.findById(id);
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
        yield ProductImport_1.default.findByIdAndDelete(id);
        // ============================================================
        // DELETE PHYSICAL FILE
        // ============================================================
        if (productImport.fileUrl) {
            try {
                const filePath = path_1.default.join(process.cwd(), productImport.fileUrl.replace(/^[/\\]+/, ""));
                yield promises_1.default.unlink(filePath);
            }
            catch (fileError) {
                console.warn("Product import record deleted, but file could not be deleted:", fileError);
            }
        }
        // ============================================================
        // DELETE ERROR FILE IF EXISTS
        // ============================================================
        if (productImport.errorFileUrl) {
            try {
                const errorFilePath = path_1.default.join(process.cwd(), productImport.errorFileUrl.replace(/^[/\\]+/, ""));
                yield promises_1.default.unlink(errorFilePath);
            }
            catch (fileError) {
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
    }
    catch (error) {
        console.error("Failed to delete product import:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete product import",
        });
    }
});
exports.deleteProductImport = deleteProductImport;
const XLSX = __importStar(require("xlsx"));
const downloadProductImportErrors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        const productImport = yield ProductImport_1.default.findById(id).lean();
        console.log("PRODUCT IMPORT:", productImport);
        if (!productImport) {
            res.status(404).json({
                success: false,
                message: "Product import not found.",
            });
            return;
        }
        console.log("IMPORT ERRORS:", productImport.importErrors);
        if (!((_a = productImport.importErrors) === null || _a === void 0 ? void 0 : _a.length)) {
            res.status(404).json({
                success: false,
                message: "No import errors found.",
            });
            return;
        }
        const errors = productImport.importErrors.map((error) => { var _a, _b, _c, _d, _e; return ({
            "Excel Row": (_a = error.rowNumber) !== null && _a !== void 0 ? _a : "",
            SKU: (_b = error.sku) !== null && _b !== void 0 ? _b : "",
            "Product Name": (_c = error.productName) !== null && _c !== void 0 ? _c : "",
            Error: (_e = (_d = error.error) !== null && _d !== void 0 ? _d : error.message) !== null && _e !== void 0 ? _e : "Unknown error",
        }); });
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
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.status(200).send(buffer);
    }
    catch (error) {
        console.error("Failed to generate import error file:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate error file.",
        });
    }
});
exports.downloadProductImportErrors = downloadProductImportErrors;
