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
exports.deleteSeason = exports.updateSeason = exports.getSeasonById = exports.getAllSeasons = exports.createSeason = void 0;
const Season_1 = __importDefault(require("../models/Season"));
const responseHandler_1 = require("../utils/responseHandler");
// Create a new season
// Create a new season
const createSeason = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, isActive } = req.body;
        if (!(name === null || name === void 0 ? void 0 : name.trim())) {
            return (0, responseHandler_1.response)(res, 400, "Season name is required");
        }
        const existingSeason = yield Season_1.default.findOne({
            name: name.trim(),
        });
        if (existingSeason) {
            return (0, responseHandler_1.response)(res, 409, "Season with this name already exists");
        }
        const newSeason = yield Season_1.default.create({
            name: name.trim(),
            description: (description === null || description === void 0 ? void 0 : description.trim()) || "",
            isActive: isActive !== null && isActive !== void 0 ? isActive : true,
        });
        return (0, responseHandler_1.response)(res, 201, "Season created successfully", newSeason);
    }
    catch (error) {
        console.error("Create season error:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.createSeason = createSeason;
// Get all seasons
const getAllSeasons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seasons = yield Season_1.default.find().sort({ createdAt: -1 });
        return (0, responseHandler_1.response)(res, 200, "Seasons fetched successfully", seasons);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.getAllSeasons = getAllSeasons;
// Get season by ID
const getSeasonById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const season = yield Season_1.default.findById(req.params.id);
        if (!season) {
            return (0, responseHandler_1.response)(res, 404, "Season not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Season fetched successfully", season);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.getSeasonById = getSeasonById;
// Update season
// Update season
const updateSeason = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, icon, isActive } = req.body;
        const season = yield Season_1.default.findById(req.params.id);
        if (!season) {
            return (0, responseHandler_1.response)(res, 404, "Season not found");
        }
        if (name !== undefined) {
            season.name = name;
        }
        if (description !== undefined) {
            season.description = description;
        }
        if (icon !== undefined) {
            season.icon = icon;
        }
        if (isActive !== undefined) {
            season.isActive =
                typeof isActive === "string"
                    ? isActive === "true"
                    : Boolean(isActive);
        }
        const updatedSeason = yield season.save();
        return (0, responseHandler_1.response)(res, 200, "Season updated successfully", updatedSeason);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.updateSeason = updateSeason;
// Delete season
const deleteSeason = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const season = yield Season_1.default.findByIdAndDelete(req.params.id);
        if (!season) {
            return (0, responseHandler_1.response)(res, 404, "Season not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Season deleted successfully");
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.deleteSeason = deleteSeason;
