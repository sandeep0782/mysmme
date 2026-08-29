import express from "express";
import * as userController from "../controllers/userController";
import { authenticateUser } from "../middleware/authMiddleware";
import { addUser, deleteUser, updateUser } from "../controllers/userController";

const router = express.Router();

router.put(
  "/profile/update/:userId",
  authenticateUser,
  userController.editUserProfile,
);

router.get("/", authenticateUser, userController.getAllUsers);

// Add user
router.post("/", authenticateUser, addUser);

// Update user
router.put("/:userId", authenticateUser, updateUser);

// Delete user
router.delete("/:userId", authenticateUser, deleteUser);


export default router;
