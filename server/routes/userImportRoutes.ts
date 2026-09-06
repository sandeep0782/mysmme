import express from "express";
import multer from "multer";

import { authenticateUser } from "../middleware/authMiddleware";
import { importUsersFromExcel } from "../controllers/importUserController";

const router = express.Router();

const excelUpload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    const allowedExtensions = [".xlsx", ".xls"];

    const extension = file.originalname
      .substring(file.originalname.lastIndexOf("."))
      .toLowerCase();

    if (
      allowedMimeTypes.includes(file.mimetype) &&
      allowedExtensions.includes(extension)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files (.xlsx and .xls) are allowed."));
    }
  },
});

router.post(
  "/import",
  authenticateUser,
  excelUpload.single("file"),
  importUsersFromExcel,
);

export default router;
