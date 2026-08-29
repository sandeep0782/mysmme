import { Router } from "express";

import {
  deleteProductImport,
  downloadProductImportErrors,
  getProductImports,
  uploadProductExcel,
} from "../controllers/productImportController";

import productImportUpload from "../config/productImportUpload";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

// ================================================================
// PRODUCT IMPORTS
// ================================================================

router.get("/", authenticateUser, getProductImports);

router.post(
  "/upload",
  authenticateUser,
  productImportUpload.single("file"),
  uploadProductExcel,
);

router.get(
  "/:id/errors/download",
  authenticateUser,
  downloadProductImportErrors,
);

router.delete("/:id", authenticateUser, deleteProductImport);

export default router;
