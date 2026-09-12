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

router.post("/", createSeller);
router.get("/", getSellers);
router.get("/:id", getSellerById);
router.put("/:id", updateSeller);
router.delete("/:id", deleteSeller);

router.patch("/:id/status", updateSellerStatus);

router.get("/:id/verify-gst", verifySellerGST);

export default router;
