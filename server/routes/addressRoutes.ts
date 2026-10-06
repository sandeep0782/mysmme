import express from "express";
import * as cartController from "../controllers/addressController";
import * as addressController from "../controllers/addressController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authenticateUser, cartController.getAddressByUserId);
router.post(
  "/create-or-update",
  authenticateUser,
  cartController.createOrUpdateAddressByUserId,
);
// router.delete('/remove/:productId', authenticateUser, cartController.removeFromCart);

// Admin: get address of a specific user
router.get(
  "/user/:userId",
  authenticateUser,
  addressController.getAddressByAdminUserId,
);
export default router;
