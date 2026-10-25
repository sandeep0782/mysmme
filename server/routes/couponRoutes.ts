import { Router } from "express";
import {
  createCouponController,
  deleteCouponController,
  getCouponFreelancersController,
  getCouponsController,
  getMyCouponController,
  updateCouponController,
  usersAllCoupons,
  validateCouponController,
} from "../controllers/couponController";
import { authenticateUser } from "../middleware/authMiddleware";
import { requireFreelancer } from "../middleware/freelancerMiddleware";

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

router.get(
  "/users-all-coupons",
  authenticateUser,
  requireFreelancer,
  usersAllCoupons,
);
export default router;
