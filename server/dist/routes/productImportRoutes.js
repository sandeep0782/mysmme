"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productImportController_1 = require("../controllers/productImportController");
const productImportUpload_1 = __importDefault(require("../config/productImportUpload"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// ================================================================
// PRODUCT IMPORTS
// ================================================================
router.get("/", authMiddleware_1.authenticateUser, productImportController_1.getProductImports);
router.post("/upload", authMiddleware_1.authenticateUser, productImportUpload_1.default.single("file"), productImportController_1.uploadProductExcel);
router.get("/:id/errors/download", authMiddleware_1.authenticateUser, productImportController_1.downloadProductImportErrors);
router.delete("/:id", authMiddleware_1.authenticateUser, productImportController_1.deleteProductImport);
exports.default = router;
