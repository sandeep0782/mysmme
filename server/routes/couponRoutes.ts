import { Router } from "express";
import {
  createCouponController,
  deleteCouponController,
  getCouponFreelancersController,
  getCouponsController,
  getMyCouponController,
  updateCouponController,
  validateCouponController,
} from "../controllers/couponController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/validate", authenticateUser, validateCouponController);
router.get("/my-coupon", authenticateUser, getMyCouponController);
router.get("/admin", authenticateUser, getCouponsController);
router.post("/admin", authenticateUser, createCouponController);
router.patch("/admin/:id", authenticateUser, updateCouponController);
router.delete("/admin/:id", authenticateUser, deleteCouponController);
router.get(
  "/admin/freelancers",
  authenticateUser,
  getCouponFreelancersController,
);
export default router;
