"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadPaths_1 = require("./uploadPaths");
const uploadDir = path_1.default.join(process.cwd(), "uploads", "product-imports");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, {
        recursive: true,
    });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadPaths_1.PRODUCT_IMPORT_UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        const extension = path_1.default.extname(file.originalname);
        const fileName = `products-${Date.now()}${extension}`;
        cb(null, fileName);
    },
});
const fileFilter = (_req, file, cb) => {
    const allowedExtensions = [".xlsx", ".xls", ".csv"];
    const extension = path_1.default.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
        cb(new Error("Only .xlsx, .xls and .csv files are allowed."));
        return;
    }
    cb(null, true);
};
const productImportUpload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});
exports.default = productImportUpload;
