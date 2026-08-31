"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        const retryAfter = res.getHeader("Retry-After");
        const seconds = Number(retryAfter) || 900;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        let timeMessage = "";
        if (minutes > 0) {
            timeMessage += `${minutes} minute${minutes !== 1 ? "s" : ""}`;
        }
        if (remainingSeconds > 0) {
            if (timeMessage)
                timeMessage += " ";
            timeMessage += `${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
        }
        res.status(429).json({
            success: false,
            message: `Too many login attempts. Please try again in ${timeMessage}.`,
            retryAfter: seconds,
        });
    },
});
