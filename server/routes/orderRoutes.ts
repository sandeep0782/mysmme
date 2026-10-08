import express from "express";
import * as orderController from "../controllers/orderController";
import { authenticateUser } from "../middleware/authMiddleware";
import {
  downloadInvoice,
  verifyPaymentAndCreateOrder,
} from "../controllers/orderController";

const router = express.Router();

router.post("/", authenticateUser, orderController.createOrUpdateOrder);
router.get("/", authenticateUser, orderController.getUserOrders);
router.get("/:id", authenticateUser, orderController.getOrderById);
router.post(
  "/payment-razorpay",
  authenticateUser,
  orderController.createPaymentWithRazorpay,
);
router.post("/verify-payment", authenticateUser, verifyPaymentAndCreateOrder);
router.post("/razorpay-webhook", orderController.handleRazorpayWebhook);

router.get("/:orderId/invoice", authenticateUser, downloadInvoice);

export default router;
