import multer from "multer";
import path from "path";
import fs from "fs";
import { PRODUCT_IMPORT_UPLOAD_DIR } from "./uploadPaths";

const uploadDir = path.join(process.cwd(), "uploads", "product-imports");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, PRODUCT_IMPORT_UPLOAD_DIR);
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);

    const fileName = `products-${Date.now()}${extension}`;

    cb(null, fileName);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedExtensions = [".xlsx", ".xls", ".csv"];

  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    cb(new Error("Only .xlsx, .xls and .csv files are allowed."));

    return;
  }

  cb(null, true);
};

const productImportUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export default productImportUpload;
