import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import * as ColorController from "../controllers/ColorController";

const router = express.Router();

// ============================================================
// PUBLIC ROUTES
// ============================================================

// Get active colors for storefront
router.get(
  "/active",
  ColorController.getActiveColors
);

// ============================================================
// PRIVATE / ADMIN ROUTES
// ============================================================

// Get all colors
router.get(
  "/",
  authenticateUser,
  ColorController.getColors
);

// Get color by ID
router.get(
  "/:id",
  authenticateUser,
  ColorController.getColorById
);

// Create color
router.post(
  "/",
  authenticateUser,
  ColorController.createColor
);

// Update color
router.put(
  "/:id",
  authenticateUser,
  ColorController.updateColor
);

// Delete color
router.delete(
  "/:id",
  authenticateUser,
  ColorController.deleteColor
);

export default router;