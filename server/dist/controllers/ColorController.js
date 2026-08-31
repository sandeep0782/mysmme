"use strict";
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
exports.deleteColor = exports.updateColor = exports.createColor = exports.getColorById = exports.getActiveColors = exports.getColors = void 0;
const Color_1 = __importDefault(require("../models/Color"));
const responseHandler_1 = require("../utils/responseHandler");
// ============================================================
// GET ALL COLORS
// ============================================================
const getColors = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const colors = yield Color_1.default.find().sort({ name: 1 });
        return (0, responseHandler_1.response)(res, 200, "Colors fetched successfully", colors);
    }
    catch (error) {
        console.error("Failed to fetch colors:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to fetch colors");
    }
});
exports.getColors = getColors;
// ============================================================
// GET ACTIVE COLORS
// ============================================================
const getActiveColors = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const colors = yield Color_1.default.find({
            isActive: true,
        }).sort({ name: 1 });
        return (0, responseHandler_1.response)(res, 200, "Active colors fetched successfully", colors);
    }
    catch (error) {
        console.error("Failed to fetch active colors:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to fetch active colors");
    }
});
exports.getActiveColors = getActiveColors;
// ============================================================
// GET COLOR BY ID
// ============================================================
const getColorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const color = yield Color_1.default.findById(req.params.id);
        if (!color) {
            return (0, responseHandler_1.response)(res, 404, "Color not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Color fetched successfully", color);
    }
    catch (error) {
        console.error("Failed to fetch color:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to fetch color");
    }
});
exports.getColorById = getColorById;
// ============================================================
// CREATE COLOR
// ============================================================
const createColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, hexCode, isActive } = req.body;
        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------
        if (!name || !name.trim()) {
            return (0, responseHandler_1.response)(res, 400, "Color name is required");
        }
        if (!hexCode || !hexCode.trim()) {
            return (0, responseHandler_1.response)(res, 400, "Hex code is required");
        }
        const trimmedName = name.trim();
        const trimmedHexCode = hexCode.trim();
        // --------------------------------------------------------
        // CHECK DUPLICATE NAME
        // --------------------------------------------------------
        const existingColor = yield Color_1.default.findOne({
            name: trimmedName,
        });
        if (existingColor) {
            return (0, responseHandler_1.response)(res, 409, "Color with this name already exists");
        }
        // --------------------------------------------------------
        // CREATE
        // --------------------------------------------------------
        const color = yield Color_1.default.create({
            name: trimmedName,
            hexCode: trimmedHexCode,
            isActive: typeof isActive === "boolean"
                ? isActive
                : true,
        });
        return (0, responseHandler_1.response)(res, 201, "Color created successfully", color);
    }
    catch (error) {
        console.error("Failed to create color:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to create color");
    }
});
exports.createColor = createColor;
// ============================================================
// UPDATE COLOR
// ============================================================
const updateColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, hexCode, isActive } = req.body;
        // --------------------------------------------------------
        // FIND COLOR
        // --------------------------------------------------------
        const color = yield Color_1.default.findById(req.params.id);
        if (!color) {
            return (0, responseHandler_1.response)(res, 404, "Color not found");
        }
        // --------------------------------------------------------
        // UPDATE NAME
        // --------------------------------------------------------
        if (name !== undefined) {
            if (!name.trim()) {
                return (0, responseHandler_1.response)(res, 400, "Color name cannot be empty");
            }
            const trimmedName = name.trim();
            // Check if another color already uses this name
            const existingColor = yield Color_1.default.findOne({
                name: trimmedName,
                _id: { $ne: color._id },
            });
            if (existingColor) {
                return (0, responseHandler_1.response)(res, 409, "Color with this name already exists");
            }
            color.name = trimmedName;
        }
        // --------------------------------------------------------
        // UPDATE HEX CODE
        // --------------------------------------------------------
        if (hexCode !== undefined) {
            if (!hexCode.trim()) {
                return (0, responseHandler_1.response)(res, 400, "Hex code cannot be empty");
            }
            color.hexCode = hexCode.trim();
        }
        // --------------------------------------------------------
        // UPDATE STATUS
        // --------------------------------------------------------
        if (isActive !== undefined) {
            if (typeof isActive !== "boolean") {
                return (0, responseHandler_1.response)(res, 400, "isActive must be a boolean");
            }
            color.isActive = isActive;
        }
        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------
        yield color.save();
        return (0, responseHandler_1.response)(res, 200, "Color updated successfully", color);
    }
    catch (error) {
        console.error("Failed to update color:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to update color");
    }
});
exports.updateColor = updateColor;
// ============================================================
// DELETE COLOR
// ============================================================
const deleteColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const color = yield Color_1.default.findByIdAndDelete(req.params.id);
        if (!color) {
            return (0, responseHandler_1.response)(res, 404, "Color not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Color deleted successfully");
    }
    catch (error) {
        console.error("Failed to delete color:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to delete color");
    }
});
exports.deleteColor = deleteColor;
