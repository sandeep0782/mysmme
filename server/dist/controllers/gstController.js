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
exports.deleteGst = exports.updateGst = exports.createGst = exports.getGstById = exports.getActiveGsts = exports.getGsts = void 0;
const Gst_1 = __importDefault(require("../models/Gst"));
const responseHandler_1 = require("../utils/responseHandler");
// ============================================================
// GET ALL GST RATES
// ============================================================
const getGsts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gsts = yield Gst_1.default.find().sort({ percentage: 1 });
        return (0, responseHandler_1.response)(res, 200, "GST rates fetched successfully", gsts);
    }
    catch (error) {
        console.error("Failed to fetch GST rates:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to fetch GST rates");
    }
});
exports.getGsts = getGsts;
// ============================================================
// GET ACTIVE GST RATES
// ============================================================
const getActiveGsts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gsts = yield Gst_1.default.find({
            isActive: true,
        }).sort({ percentage: 1 });
        return (0, responseHandler_1.response)(res, 200, "Active GST rates fetched successfully", gsts);
    }
    catch (error) {
        console.error("Failed to fetch active GST rates:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to fetch active GST rates");
    }
});
exports.getActiveGsts = getActiveGsts;
// ============================================================
// GET GST BY ID
// ============================================================
const getGstById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gst = yield Gst_1.default.findById(req.params.id);
        if (!gst) {
            return (0, responseHandler_1.response)(res, 404, "GST rate not found");
        }
        return (0, responseHandler_1.response)(res, 200, "GST rate fetched successfully", gst);
    }
    catch (error) {
        console.error("Failed to fetch GST rate:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to fetch GST rate");
    }
});
exports.getGstById = getGstById;
// ============================================================
// CREATE GST RATE
// ============================================================
const createGst = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { percentage, isActive } = req.body;
        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------
        if (percentage === undefined || percentage === null) {
            return (0, responseHandler_1.response)(res, 400, "GST percentage is required");
        }
        if (typeof percentage !== "number" || !Number.isFinite(percentage)) {
            return (0, responseHandler_1.response)(res, 400, "GST percentage must be a valid number");
        }
        if (percentage < 0 || percentage > 100) {
            return (0, responseHandler_1.response)(res, 400, "GST percentage must be between 0 and 100");
        }
        // --------------------------------------------------------
        // CHECK DUPLICATE
        // --------------------------------------------------------
        const existingGst = yield Gst_1.default.findOne({
            percentage,
        });
        if (existingGst) {
            return (0, responseHandler_1.response)(res, 409, "GST percentage already exists");
        }
        // --------------------------------------------------------
        // CREATE
        // --------------------------------------------------------
        const gst = yield Gst_1.default.create({
            percentage,
            isActive: typeof isActive === "boolean" ? isActive : true,
        });
        return (0, responseHandler_1.response)(res, 201, "GST rate created successfully", gst);
    }
    catch (error) {
        console.error("Failed to create GST rate:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to create GST rate");
    }
});
exports.createGst = createGst;
// ============================================================
// UPDATE GST RATE
// ============================================================
const updateGst = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { percentage, isActive } = req.body;
        // --------------------------------------------------------
        // FIND GST
        // --------------------------------------------------------
        const gst = yield Gst_1.default.findById(req.params.id);
        if (!gst) {
            return (0, responseHandler_1.response)(res, 404, "GST rate not found");
        }
        // --------------------------------------------------------
        // UPDATE PERCENTAGE
        // --------------------------------------------------------
        if (percentage !== undefined) {
            if (typeof percentage !== "number" || !Number.isFinite(percentage)) {
                return (0, responseHandler_1.response)(res, 400, "GST percentage must be a valid number");
            }
            if (percentage < 0 || percentage > 100) {
                return (0, responseHandler_1.response)(res, 400, "GST percentage must be between 0 and 100");
            }
            // Check if another GST record already uses this percentage
            const existingGst = yield Gst_1.default.findOne({
                percentage,
                _id: { $ne: gst._id },
            });
            if (existingGst) {
                return (0, responseHandler_1.response)(res, 409, "GST percentage already exists");
            }
            gst.percentage = percentage;
        }
        // --------------------------------------------------------
        // UPDATE STATUS
        // --------------------------------------------------------
        if (isActive !== undefined) {
            if (typeof isActive !== "boolean") {
                return (0, responseHandler_1.response)(res, 400, "isActive must be a boolean");
            }
            gst.isActive = isActive;
        }
        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------
        yield gst.save();
        return (0, responseHandler_1.response)(res, 200, "GST rate updated successfully", gst);
    }
    catch (error) {
        console.error("Failed to update GST rate:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to update GST rate");
    }
});
exports.updateGst = updateGst;
// ============================================================
// DELETE GST RATE
// ============================================================
const deleteGst = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gst = yield Gst_1.default.findByIdAndDelete(req.params.id);
        if (!gst) {
            return (0, responseHandler_1.response)(res, 404, "GST rate not found");
        }
        return (0, responseHandler_1.response)(res, 200, "GST rate deleted successfully");
    }
    catch (error) {
        console.error("Failed to delete GST rate:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to delete GST rate");
    }
});
exports.deleteGst = deleteGst;
