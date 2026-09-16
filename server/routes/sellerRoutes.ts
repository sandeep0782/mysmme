import express from "express";

import {
  createSeller,
  getSellers,
  getSellerById,
  updateSeller,
  deleteSeller,
  updateSellerStatus,
  verifySellerGST,
} from "../controllers/sellerController";

const router = express.Router();

// ==========================================
// GST VERIFICATION
// ==========================================

// POST /api/sellers/verify-gst
router.post("/verify-gst", verifySellerGST);

// ==========================================
// SELLER CRUD
// ==========================================

// POST /api/sellers
router.post("/", createSeller);

// GET /api/sellers
router.get("/", getSellers);

// ==========================================
// SELLER STATUS
// ==========================================

// PATCH /api/sellers/:id/status
router.patch("/:id/status", updateSellerStatus);

// ==========================================
// SELLER BY ID
// ==========================================

// GET /api/sellers/:id
router.get("/:id", getSellerById);

// PUT /api/sellers/:id
router.put("/:id", updateSeller);

// DELETE /api/sellers/:id
router.delete("/:id", deleteSeller);

export default router;
