import express from "express";

import {
  searchUsers,
  updateUserRole,
} from "../controllers/adminUserController";

import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/search", authenticateUser, searchUsers);

router.patch("/:id/role", authenticateUser, updateUserRole);

export default router;
