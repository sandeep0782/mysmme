"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sellerOrderController_1 = require("../controllers/sellerOrderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
/*
|--------------------------------------------------------------------------
| Seller Orders
|--------------------------------------------------------------------------
*/
// Get all orders belonging to logged-in seller
router.get("/", authMiddleware_1.authenticateUser, sellerOrderController_1.getSellerOrders);
// Get single seller order
router.get("/:id", authMiddleware_1.authenticateUser, sellerOrderController_1.getSellerOrderById);
// Accept order
router.patch("/:id/accept", authMiddleware_1.authenticateUser, sellerOrderController_1.acceptSellerOrder);
// Start processing
router.patch("/:id/process", authMiddleware_1.authenticateUser, sellerOrderController_1.processSellerOrder);
// Mark ready to ship
router.patch("/:id/ready-to-ship", authMiddleware_1.authenticateUser, sellerOrderController_1.markSellerOrderReadyToShip);
// Dispatch order
router.patch("/:id/dispatch", authMiddleware_1.authenticateUser, sellerOrderController_1.dispatchSellerOrder);
// Mark delivered
router.patch("/:id/delivered", authMiddleware_1.authenticateUser, sellerOrderController_1.markSellerOrderDelivered);
exports.default = router;
