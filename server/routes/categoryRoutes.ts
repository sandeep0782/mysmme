import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import * as CategoryController from "../controllers/categoryController";
import {
  categoryImageUploadMiddleware,
} from "../config/cloudnaryConfig";

const router = express.Router();

// ============================================================
// PUBLIC ROUTES
// ============================================================

router.get(
  "/",
  CategoryController.getAllCategories
);

// ============================================================
// PRIVATE ROUTES
// ============================================================

router.post(
  "/",
  authenticateUser,
  categoryImageUploadMiddleware,
  CategoryController.createCategory
);

router.get(
  "/:id",
  authenticateUser,
  CategoryController.getCategoryById
);

router.put(
  "/:id",
  authenticateUser,
  categoryImageUploadMiddleware,
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  authenticateUser,
  CategoryController.deleteCategory
);

export default router;