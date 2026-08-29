import express from "express";

import {
  getSellerOrders,
  getSellerOrderById,
  acceptSellerOrder,
  processSellerOrder,
  markSellerOrderReadyToShip,
  dispatchSellerOrder,
  markSellerOrderDelivered,
} from "../controllers/sellerOrderController";

import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Seller Orders
|--------------------------------------------------------------------------
*/

// Get all orders belonging to logged-in seller
router.get("/", authenticateUser, getSellerOrders);

// Get single seller order
router.get("/:id", authenticateUser, getSellerOrderById);

// Accept order
router.patch("/:id/accept", authenticateUser, acceptSellerOrder);

// Start processing
router.patch("/:id/process", authenticateUser, processSellerOrder);

// Mark ready to ship
router.patch(
  "/:id/ready-to-ship",
  authenticateUser,
  markSellerOrderReadyToShip,
);

// Dispatch order
router.patch("/:id/dispatch", authenticateUser, dispatchSellerOrder);

// Mark delivered
router.patch("/:id/delivered", authenticateUser, markSellerOrderDelivered);

export default router;
