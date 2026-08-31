"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authController = __importStar(require("../controllers/authController"));
const generateToken_1 = require("../utils/generateToken");
const authMiddleware_1 = require("../middleware/authMiddleware");
const loginLimiter_1 = require("../middleware/loginLimiter");
const router = (0, express_1.Router)();
router.post("/register", authController.register);
router.post("/vendor/register", authController.registerVendor);
router.post("/login", loginLimiter_1.loginLimiter, authController.login);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/forgot-password", loginLimiter_1.loginLimiter, authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.get("/verify-auth", authMiddleware_1.authenticateUser, authController.checkUserAuth);
router.get("/logout", authController.logout);
router.get("/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
//google callback routes
router.get("/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    session: false,
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Cast req.user to IUser
        const user = req.user;
        const accessToken = yield (0, generateToken_1.generateToken)(user);
        // Set the token in the cookie
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}`);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
