"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLocalFile = void 0;
const fs_1 = __importDefault(require("fs"));
const removeLocalFile = (filePath) => {
    try {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            console.log("Removed local file:", filePath);
        }
    }
    catch (error) {
        console.error("Failed to remove local file:", error);
    }
};
exports.removeLocalFile = removeLocalFile;
