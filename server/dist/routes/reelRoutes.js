"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reelController_1 = require("../controllers/reelController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/* =========================================================
   FREELANCER REELS
========================================================= */
router.get("/my", authMiddleware_1.authenticateUser, reelController_1.getMyReels);
router.get("/:id", authMiddleware_1.authenticateUser, reelController_1.getMyReel);
router.post("/", authMiddleware_1.authenticateUser, reelController_1.createReel);
router.patch("/:id", authMiddleware_1.authenticateUser, reelController_1.updateReel);
router.post("/:id/submit", authMiddleware_1.authenticateUser, reelController_1.submitReel);
exports.default = router;
